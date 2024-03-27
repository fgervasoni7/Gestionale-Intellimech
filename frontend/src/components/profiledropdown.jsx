import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition, Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  TagIcon,
  CheckBadgeIcon,
  UserIcon,
  XMarkIcon,
  CakeIcon
  
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { userNavigation } from '../config/navbar'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function navbar() { 
    const [Propic, setPropic] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
          window.location.href = '/';
        } else {
            axios.get(`${process.env.REACT_APP_API_URL}/auth/verify`, { headers: { authorization: `Bearer ${token}` } })
                .then((response) => {
                console.log('response', response);
                setUser(response.data.user);
                setPropic('https://api.dicebear.com/7.x/notionists/svg?seed=' + response.data.user.id_user + '&background=%23fff&radius=50');
                })
                .catch((error) => {
                console.error('Error:', error);
                // set a timer and after 5 seconds redirect to login page
                setInterval(() => {
                    Cookies.remove('token');
                    window.location.href = '/';
                }, 5000);
                })
        }
      }, []);
  return (
    <>
                        <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                        <span className="sr-only">Open user menu</span>
                        <img
                            className="h-8 w-8 rounded-full"
                            src={Propic}
                            alt=""
                        />                        
                        <span className="hidden lg:flex lg:items-center">
                            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                            {user?.name + ' ' + user?.surname}
                        </span>
                        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                onClick={item.onClick} // Added onClick event
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block w-full text-left px-4 py-2 text-sm leading-6 text-gray-900'
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
    </>
  )
}