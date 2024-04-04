import { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Dialog, Menu, Transition, Disclosure } from '@headlessui/react'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import axios from 'axios'

function isToday(date) {
  const today = new Date();
  const daten = new Date(date);
  console.log(daten.getDate() === today.getDate() &&
  daten.getMonth() === today.getMonth())
  return daten.getDate() === today.getDate() &&
    daten.getMonth() === today.getMonth();
}

export default function userinfo() {
  //get user info
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userdata = localStorage.getItem('user');

  let id_user = JSON.parse(localStorage.getItem('user'))?.id_user;

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
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/user/read/` + id_user)
      .then((response) => {
        setUser(response.data.user);
        setLoading(false); // Set loading to false regardless of success or error
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div role="status" className="text-center">
          <div className="animate-bounce">Loading...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Profilo</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Informazioni personali sull'utente</p>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Full name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.name} {user.surname}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"><a href={"mailto:" + user.email}>{user.email}</a></dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Birthdate</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.birthdate ? (
                <>
                  {new Date(user.birthdate).toLocaleDateString()}{' '}
                  {isToday(user.birthdate) && <span>🎂</span>}
                </>
              ) : ''}
            </dd>

          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Ruolo</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.Role.name}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
