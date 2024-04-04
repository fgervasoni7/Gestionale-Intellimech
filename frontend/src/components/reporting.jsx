import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { CalendarIcon, MapPinIcon, EllipsisHorizontalIcon, UserCircleIcon, PhotoIcon } from '@heroicons/react/20/solid'

export default function Reporting() {
  const [reportedHours, setReportedHours] = useState([
    {
      date: '2024-04-01',
      hours: '8',
      description: 'Worked on frontend development tasks',
    },
    {
      date: '2024-04-02',
      hours: '6',
      description: 'Attended project meeting and reviewed project requirements',
    },
  ])

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const newReport = {
      date: formData.get('date'),
      hours: formData.get('hours'),
      description: formData.get('description'),
    }
    setReportedHours([...reportedHours, newReport])
    event.target.reset()
  }

  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
          <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-900">Date</label>
                  <input type="time" name="date" id="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50" required />
                  <input type="time" name="date" id="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50" required />
                </div>
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-900">Hours</label>
                  <input type="number" name="hours" id="hours" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description</label>
                  <textarea id="description" name="description" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"></textarea>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
          <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
            {reportedHours.map((report, index) => (
              <li key={index} className="relative flex space-x-6 py-6 xl:static">
                <div className="flex-auto">
                  <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">{report.date}</h3>
                  <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                    <div className="flex items-start space-x-3">
                      <dt className="mt-0.5">
                        <span className="sr-only">Hours</span>
                        <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </dt>
                      <dd>{report.hours} hours</dd>
                    </div>
                    <div className="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                      <dt className="mt-0.5">
                        <span className="sr-only">Description</span>
                        <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </dt>
                      <dd>{report.description}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  )
}
