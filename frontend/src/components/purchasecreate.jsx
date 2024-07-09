import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/20/solid';
import Select from "react-tailwindcss-select";

export default function PurchaseCreateForm() {
  const [createSuccess, setCreateSuccess] = useState(null);
  const [errorMessages, setErrorMessages] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [products, setProducts] = useState([{ category: '', subcategory: '', quantity: '', unit_price: '', subcategories: [] }]);


  const handleCompanyChange = (value) => setSelectedCompany(value);

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchData = async () => {
      try {
        const [
          categoryRes,
          technicalAreaRes,
          usersRes,
          companyRes
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/category/read`, { headers: { authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.REACT_APP_API_URL}/technicalarea/read`, { headers: { authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.REACT_APP_API_URL}/user/read`, { headers: { authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.REACT_APP_API_URL}/company/read`, { headers: { authorization: `Bearer ${token}` }, params: { filter: "Suppliers" }})
        ]);

        setCategories(categoryRes.data.categories);
        setTechnicalAreas(technicalAreaRes.data.technicalareas);
       
        setUsers(usersRes.data.users.map((user) => ({
          value: user.id_user,
          label: `${user.name} ${user.surname}`,
        })));
        setCompanies(companyRes.data.value.sort((a, b) => new Date(b.ReceptionDate) - new Date(a.ReceptionDate)).map((company) => ({
          value: company.id,
          label: company.name
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    const token = Cookies.get('token');
    // Fetching subcategories with the selected category
    axios.get(`${process.env.REACT_APP_API_URL}/subcategory/read/${event.target.value}`, { headers: { authorization: `Bearer ${token}` } })
    .then((response) => {
      setSubcategories(response.data.subcategories);
      console.log(response.data.subcategories)
      console.log(event.target.value)
    })
    .catch((error) => {
      console.error('Error fetching subcategory data:', error);
    });
  };


  const addProduct = () => {
    setProducts([...products, { category: '', subcategory: '', quantity: '', unit_price: '', subcategories: [] }]);
  };

  const createPurchaseOrder = async (event) => {
    event.preventDefault();
    const token = Cookies.get('token');
    const form = document.forms.createpurchaseorder;
    const formData = new FormData(form);
    const jsonObject = Object.fromEntries(formData.entries()); 
    
    jsonObject.products = products;

    console.log('Create purchase order payload:', jsonObject);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/purchase-order/create`, jsonObject, { headers: { authorization: `Bearer ${token}` } });
      setCreateSuccess(true);
    } catch (error) {
      setErrorMessages(error.response?.data?.message || 'An error occurred');
      setCreateSuccess(false);
    }
  };

  return (
    <form name="createpurchaseorder">
      {/* Account Information */}
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Informazioni Ordine di Acquisto</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Ricorda, i dati inseriti ora saranno quelli che verranno utilizzati per creare l'ordine di acquisto</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="quotationrequest" className="block text-sm font-medium leading-6 text-gray-900">
                Ordine di Acquisto
              </label>
              <div className="mt-2">
                <select
                  id="quotationrequest"
                  name="quotationrequest"
                  autoComplete="company-name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                >
                
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="azienda" className="block text-sm font-medium leading-6 text-gray-900">
                Azienda
              </label>
              <div className="mt-2">
                <Select
                  id="azienda"
                  name="azienda"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  options={companies}
                />
              </div>
            </div>
            
            

           

            <div className="sm:col-span-3">
              <label htmlFor="dateorder" className="block text-sm font-medium leading-6 text-gray-900">
                Data Acquisto
              </label>
              <div className="mt-2">
                <input
                  id="dateorder"
                  name="dateorder"
                  type="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm"
                  min={new Date().toISOString().split('T')[0]}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Descrizione
              </label>
              <div className="mt-2">
                <textarea
                  rows={4}
                  maxLength={150}
                  name="description"
                  id="description"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Massimo 150 caratteri</p>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      {/* Products Information */}
      <div className="space-y-12 py-8">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Prodotti</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Ricorda, i dati inseriti ora saranno quelli che verranno utilizzati per creare l'ordine di acquisto</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {products.map((product, index) => (
              <div key={index} className="col-span-full grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                    Categoria
                  </label>
                  <div className="mt-2">
                    <select
                      id="category"
                      name="category"
                      onChange={handleCategoryChange}
                      autoComplete="category-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      {categories.map((item) => (
                        <option key={item.id_category} value={item.id_category}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="subcategory" className="block text-sm font-medium leading-6 text-gray-900">
                    Sotto Categoria
                  </label>
                  <div className="mt-2">
                    <select
                      id="subcategory"
                      name="subcategory"
                      autoComplete="subcategory-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      disabled={subcategories.length === 0}
                    >
                      {subcategories.map((item) => (
                        <option key={item.id_subcategory} value={item.id_subcategory}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                
                <div className="sm:col-span-1">
                  <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                    Quantità
                  </label>
                  <div className="mt-2">
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm"
                    />
                  </div>
                </div>
                    

                <div className="sm:col-span-2">
                  <label htmlFor={`unit_price-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                    Prezzo Unitario
                  </label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input
                      type="text"
                      name="unit_price"
                      id={`unit_price`}
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="0.00"
                      aria-describedby="price-currency"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm" id="price-currency">
                        EUR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addProduct}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            >
              Aggiungi Prodotto
            </button>
          </div>
        </div>
      </div>
      
      {/* Create Purchase Order Button */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {createSuccess === true && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckBadgeIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              <h3 className="ml-3 text-sm font-medium text-green-800">Ordine di acquisto creato con successo</h3>
            </div>
          </div>
        )}

        {createSuccess === false && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              <h3 className="ml-3 text-sm font-medium text-red-800">{errorMessages}</h3>
            </div>
          </div>
        )}

        <button
          onClick={createPurchaseOrder}
          type="submit"
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
        >
          Crea
        </button>
      </div>
    </form>
  );
}
