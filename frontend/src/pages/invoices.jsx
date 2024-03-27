import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition, Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
  
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const Logo = './assets/intellimech.svg'

import { userNavigation } from '../config/navbar'
import Navbar from '../components/navbar'
import Stats from '../components/stats'
import InvoiceTable from '../components/invoicetable'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function invoices() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [Propic, setPropic] = useState(null);

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
            setLoading(false); // Set loading to false regardless of success or error
            // Set user data to local storage
            localStorage.setItem('user', JSON.stringify(response.data.user));
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

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
        <div role="status" className="text-center">
        <img
            src={Logo}
            alt="Bouncing Image"
            className="animate-bounce w-max text-gray-200 fill-blue-600"
        />
        <span className="sr-only">Loading...</span>
        </div>
    </div>
    )
  }


  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    {<Navbar />}                   
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            {<Navbar />}
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full bg-gray-50"
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
                </div>
              </div>
            </div>
          </div>
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {<InvoiceTable/>}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
