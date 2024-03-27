// Import necessary modules
import cron from 'node-cron';
import axios from 'axios';
import logger from '../utils/logger.js';
import sequelize from '../utils/db.js';
import fs from 'fs';
import path from 'path';
import { Sequelize, Op } from 'sequelize';

  // Define the base directory
  const __dirname = path.resolve();

// Define the main class for handling Doceasy functionality
class Doceasy {
    constructor() {
      // Initialize properties
      this.baseUrl = process.env.DOCEASY_URL;
      this.activeInvoices = [];
      this.passiveInvoices = [];
      this.company = sequelize.models.Company;
      this.invoice = sequelize.models.Invoices;

      // Set headers for API requests
      this.headers = {
        'APIKey': process.env.DOCEASY_APIKEY,
        'APISecret': process.env.DOCEASY_APISECRET,
        'PartitaIva': process.env.DOCEASY_CODICECLIENTE
      };
    }

  // Check if Doceasy server is up
  async checkServer() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/about/version`);
      logger('success', 'Doceasy server is up and running', null, 'doceasy');
    } catch (error) {
      logger('error', 'Doceasy server is down', null, 'doceasy');
    }
  }

  // Retrieve active invoices from Doceasy
  async getActiveInvoices() {
    try {
      let maxID = await this.invoice.max('DoceasyID', { where: { InvoiceType: "AttivaSdi" } }) || 0;
      const response = await axios.get(`${this.baseUrl}/api/documentoattivo/elenco/${maxID}`, { headers: this.headers });
      this.activeInvoices = response.data;
      logger('debug', `Active invoices retrieved (Numero: ${this.activeInvoices.length})`, null, 'doceasy')
      for (const invoice of this.activeInvoices) {
        await this.processActiveInvoice(invoice);
      }
    } catch (error) {
      logger('error', `Error getting active invoices: ${error.message}`, null, 'doceasy');
    }
  }

  // Retrieve passive invoices from Doceasy
  async getPassiveInvoices() {
    try {
      let maxID = await this.invoice.max('DoceasyID', { where: { InvoiceType: "PassivaSdi" } }) || 0;
      const response = await axios.get(`${this.baseUrl}/api/documentopassivo/elenco/${maxID}`, { headers: this.headers });
      this.passiveInvoices = response.data;
      logger('debug', `Passive invoices retrieved (Numero: ${this.passiveInvoices.length})`, null, 'doceasy')
      for (const invoice of this.passiveInvoices) {
        await this.processPassiveInvoice(invoice);
      }
    } catch (error) {
      logger('error', `Error getting passive invoices: ${error.message}`, null, 'doceasy');
    }
  }

  // Process a passive invoice
  async processPassiveInvoice(invoice) {
    let company = await this.findOrCreateCompany(invoice);

    if (company && !company.isSuppliers) {
      company.isSuppliers = true;
      await company.save();
    }
  
    this.logCompanyInfo(company, invoice);

    let existingInvoice = await this.invoice.findOne({ where: { DoceasyID: invoice.ID } });
    if (!existingInvoice) {
      await this.createInvoice(invoice, company);
    }
  }

  // Process an active invoice
  async processActiveInvoice(invoice) {
    let company = await this.findOrCreateCompany(invoice);

    if (company && !company.isClient) {
      company.isClient = true;
      await company.save();
    }

    this.logCompanyInfo(company, invoice);

    let existingInvoice = await this.invoice.findOne({ where: { DoceasyID: invoice.ID } });
    if (!existingInvoice) {
      await this.createInvoice(invoice, company);
    }
  }  

  // Find or create a company based on invoice details
  async findOrCreateCompany(invoice) {
    let company = null;

    if (invoice.PartitaIva !== "" && invoice.PartitaIva !== null) {
        company = await this.company.findOne({
            where: {
              vat: invoice.PartitaIva, 
            }
        });
    } else if (invoice.CodiceFiscale !== "" && invoice.CodiceFiscale !== null) {
        company = await this.company.findOne({
            where: {
              fiscal_code: invoice.CodiceFiscale, 
            }
        });
    } else {
        company = await this.company.findOne({
            where: {
              name: invoice.Denominazione, 
            }
        });
    }


    if (!company) {
        let lastCompany = await this.company.max('id_company') || 0;
        let code = 'C' + (lastCompany + 1).toString().padStart(5, '0');
        const newCompany = {
            Code: code,
            name: invoice.Denominazione,
            VAT: invoice.PartitaIva || "",
            Fiscal_Code: invoice.CodiceFiscale || "",
            SDI: invoice.IdentificativoSdI,
            PEC: invoice.PEC,
            Address: invoice.Indirizzo,
            ZIP: invoice.CAP,
            City: invoice.Comune,
            Province: invoice.Provincia,
            Country: invoice.Nazione,
            isClient: false,
            isSuppliers: false,
            isPartner: false
        };
        company = await this.company.create(newCompany);
    }
    return company;
  }

  // Log company information
  logCompanyInfo(company, invoice) {
    if (company) {
      fs.appendFile(path.join(__dirname, 'company_found.txt'), `${invoice.Denominazione}\n`, (err) => {
        if (err) console.log(err);
      });
    } else {
      fs.appendFile(path.join(__dirname, 'company_not_found.txt'), `${invoice.Denominazione + invoice.PartitaIva}\n`, (err) => {
        if (err) console.log(err);
      });
    }
  }

  // Create a new invoice
  async createInvoice(invoice, company) {
    let number = invoice.Numero.toString().padStart(5, '0');
    let invnumcode = (invoice.TipoFattura === "PassivaSdI") ? `FTP${new Date(invoice.Data).getFullYear().toString().slice(-2)}_${number}` : `FTA${new Date(invoice.Data).getFullYear().toString().slice(-2)}_${number}`;

    const newInvoice = {
      DoceasyID: invoice.ID,
      DocumentType: invoice.TipoDocumento,
      InvoiceType: invoice.TipoFattura,
      InvoiceCompany: company.id_company,
      Number: invnumcode,
      Date: invoice.Data,
      ReceptionDate: invoice.DataRicezione,
      Amount: invoice.Importo,
      ClientOutcome: invoice.EsitoCommittente,
      FileName: invoice.NomeFile,
      SDIIdentifier: invoice.IdentificativoSdI,
      LastMessage: invoice.UltimoMessaggio,
      Stored: invoice.Conservato,
      DocumentStatus: invoice.StatoDocumento
    };

    await this.invoice.create(newInvoice);
  }

  // Start scheduled task to retrieve invoices
  start() {
    logger('debug', 'Scheduled task started', null, 'doceasy');
    cron.schedule(process.env.DOCEASY_SCHEDULE, () => {
      this.getActiveInvoices();
      this.getPassiveInvoices();
      logger('debug', 'Scheduled task started', null, 'doceasy');
    });
  }
}

// Export the Doceasy class
export { Doceasy };
