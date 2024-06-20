import Role from './role.js';
import Permissions from './permissions.js';
import User from './user.js';
import RolePermissions from './rolepermissions.js';
import Group from './group.js';
import Subgroup from './subgroup.js';
import ContractType from './contracttype.js';
import Invoice from './invoice.js';
import Company from './company.js';
import WorkingSite from './workingsite.js';
import Category from './category.js';
import Subcategory from './subcategory.js';
import TechnicalArea from './technicalarea.js';
import QuotationRequest from './quotationrequest.js';
import Offer from './offer.js';
import SalesOrder from './salesorder.js';
import JobSalesOrder from './jobsalesorder.js';
import Job from './job.js';
import Reporting from './reporting.js';
import Tasks from './tasks.js';
import OfferTeam from './offerteam.js';
import InvoiceLine from './invoicelines.js';

// Define associations
User.belongsTo(Role, { foreignKey: 'role' });
Role.hasMany(User, { foreignKey: 'role' });

Role.belongsToMany(Permissions, { through: RolePermissions, foreignKey: 'id_role' });
Permissions.belongsToMany(Role, { through: RolePermissions, foreignKey: 'id_permissions' });

//User is associated with Group
User.belongsTo(Group, { foreignKey: 'group' });
Group.hasMany(User, { foreignKey: 'group' });

//User is associated with Subgroup
User.belongsTo(Subgroup, { foreignKey: 'subgroup' });
Subgroup.hasMany(User, { foreignKey: 'subgroup' });

//User is associated with ContractType
User.belongsTo(ContractType, { foreignKey: 'contracttype' });
ContractType.hasMany(User, { foreignKey: 'contracttype' });

//Role is associated with User in the createdBy, updatedBy, and deletedBy fields
Role.hasMany(User, { foreignKey: 'createdBy' });
Role.hasMany(User, { foreignKey: 'updatedBy' });
Role.hasMany(User, { foreignKey: 'deletedBy' });

//ContractType is associated with User in the createdBy, updatedBy, and deletedBy fields
ContractType.hasMany(User, { foreignKey: 'createdBy' });
ContractType.hasMany(User, { foreignKey: 'updatedBy' });
ContractType.hasMany(User, { foreignKey: 'deletedBy' });

//Invoice is associated with the Company in the Invoicecompany by id_company
Invoice.belongsTo(Company, { foreignKey: 'invoicecompany' });
Company.hasMany(Invoice, { foreignKey: 'invoicecompany' });

//User is associated with WorkingSite
User.belongsTo(WorkingSite, { foreignKey: 'workingsite' });
WorkingSite.hasMany(User, { foreignKey: 'workingsite' });

//Category is associated with Subcategory
Category.hasMany(Subcategory, { foreignKey: 'category' });
Subcategory.belongsTo(Category, { foreignKey: 'category' });

//QuotationRequest is associated with Category
QuotationRequest.belongsTo(Category, { foreignKey: 'category' });
Category.hasMany(QuotationRequest, { foreignKey: 'category' });

//QuotationRequest is associated with Subcategory
QuotationRequest.belongsTo(Subcategory, { foreignKey: 'subcategory' });
Subcategory.hasMany(QuotationRequest, { foreignKey: 'subcategory' });

//QuotationRequest is associated with TechnicalArea
QuotationRequest.belongsTo(TechnicalArea, { foreignKey: 'technicalarea' });
TechnicalArea.hasMany(QuotationRequest, { foreignKey: 'technicalarea' });

//QuotationRequest is associated with Company
QuotationRequest.belongsTo(Company, { foreignKey: 'company' });
Company.hasMany(QuotationRequest, { foreignKey: 'company' });

//QuotationRequest is associated with User in the createdBy, updatedBy, and deletedBy fields
QuotationRequest.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
QuotationRequest.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
QuotationRequest.belongsTo(User, { foreignKey: 'deletedBy', as: 'deletedByUser' });

//Offer is associated with User in the createdBy, updatedBy, and deletedBy fields
Offer.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
Offer.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
Offer.belongsTo(User, { foreignKey: 'deletedBy', as: 'deletedByUser' });

//Offer is associated with QuotationRequest
Offer.belongsTo(QuotationRequest, { foreignKey: 'quotationrequest' });
QuotationRequest.hasMany(Offer, { foreignKey: 'quotationrequest' });

//salesorder is associated with offer in the offer field
SalesOrder.belongsTo(Offer, { foreignKey: 'offer' });
Offer.hasMany(SalesOrder, { foreignKey: 'offer' });

//salesorder is associated with User in the createdBy, updatedBy, and deletedBy fields
SalesOrder.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
SalesOrder.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
SalesOrder.belongsTo(User, { foreignKey: 'deletedBy', as: 'deletedByUser' });

//Job has many SalesOrder through JobSalesOrder
Job.belongsToMany(SalesOrder, { through: JobSalesOrder, foreignKey: 'job' });
SalesOrder.belongsToMany(Job, { through: JobSalesOrder, foreignKey: 'salesorder' });

//Offer has many User in the team through OfferTeam
Offer.belongsToMany(User, { through: OfferTeam, foreignKey: 'offer', as:'team' });
User.belongsToMany(Offer, { through: OfferTeam, foreignKey: 'user', as:'team' });

//Job is associated with User in the createdBy, updatedBy, and deletedBy fields
Job.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
Job.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
Job.belongsTo(User, { foreignKey: 'deletedBy', as: 'deletedByUser' });

//reporting is associated with Job
Reporting.belongsTo(Job, { foreignKey: 'job' });
Job.hasMany(Reporting, { foreignKey: 'job' });

//reporting is associated with Task
Reporting.belongsTo(Tasks, { foreignKey: 'task' });
Tasks.hasMany(Reporting, { foreignKey: 'task' });

//reporting is associated with User in the createdBy, updatedBy, and deletedBy fields
Reporting.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
Reporting.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
Reporting.belongsTo(User, { foreignKey: 'deletedBy', as: 'deletedByUser' });

//reporting is associated with Tasks
Reporting.belongsTo(Tasks, { foreignKey: 'task' });
Tasks.hasMany(Reporting, { foreignKey: 'task' });

//Tasks is associated with User in the createdBy, updatedBy, and deletedBy fields
Tasks.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
Tasks.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
Tasks.belongsTo(User, { foreignKey: 'deletedBy', as: 'deletedByUser' });

//Tasks is associated with Job
Tasks.belongsTo(Job, { foreignKey: 'job' });
Job.hasMany(Tasks, { foreignKey: 'job' });

//Tasks is associated with User in the assignedTo field
Tasks.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
User.hasMany(Tasks, { foreignKey: 'assignedTo' });

//Tasks is associated with Tasks in the parentTask field
Tasks.belongsTo(Tasks, { foreignKey: 'parentTask', as: 'parentTasks' });
Tasks.hasMany(Tasks, { foreignKey: 'parentTask' });

//Invoice Line is associated with Invoice
InvoiceLine.belongsTo(Invoice, { foreignKey: 'invoice' });
Invoice.hasMany(InvoiceLine, { foreignKey: 'invoice' });

export default {
    User,
    Role,
    Permissions,
    RolePermissions,
    ContractType,
    Group,
    Subgroup,
    Invoice,
    Company,
    WorkingSite,
    Category,
    Subcategory,
    TechnicalArea,
    QuotationRequest,
    Offer,
    SalesOrder,
    JobSalesOrder,
    Job
  };