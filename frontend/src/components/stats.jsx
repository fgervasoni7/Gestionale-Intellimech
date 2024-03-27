import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

import { stats } from '../config/stats'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Stats() {
    //ask to every link of stats the data and console it and every 30 seconds refresh the data
    // useEffect(() => {
    //     stats.map((item) => {
    //         axios.get('http://192.168.3.251:3000/' + item.getData, { headers: { authorization: `Bearer ${Cookies.get('token')}` } })
    //         .then((response) => {
    //             console.log(response.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         })
    //     })
    //     const interval = setInterval(() => {
    //         stats.map((item) => {
    //             axios.get('http://192.168.3.251:3000/' + item.getData, { headers: { authorization: `Bearer ${Cookies.get('token')}` } })
    //             .then((response) => {
    //                 console.log(response.data);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             })
    //         }
    //     )}
    //     , 30000);
    //     return () => clearInterval(interval);
    // }, []);

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-red-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={classNames(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-red-600 hover:text-red-500">
                    {item.link}
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
