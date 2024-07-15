import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function PurchaseInformation({ item }) {
  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Dettagli sull'ordine di acquisto</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Informazioni dettagliate sull'ordine di acquisto</p>
      </div>
      <div className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">N. Ordine</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{item.id_order}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Azienda</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{item.Company.name}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Descrizione</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{item.description}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">IVA</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{item.IVA}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Metodo di Pagamento</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{item.payment_method}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Totale</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{item.total + ' €'}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Stato</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{item.status}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Data di Creazione</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{new Date(item.createdAt).toLocaleDateString() + " " + new Date(item.createdAt).toLocaleTimeString()}</dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 lg:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Data di Aggiornamento</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{new Date(item.updatedAt).toLocaleDateString() + " " + new Date(item.updatedAt).toLocaleTimeString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
