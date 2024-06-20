import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/20/solid';
import Select from "react-tailwindcss-select";

const initialStats = [
  { label: 'Commesse di cui fai parte', value: 12, link: '/job/' },
  { label: 'Commesse di cui sei project manager', value: 4, link: '/job/' },
];

export default function ProductionHomepage({ userdata }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(initialStats);
  const [Propic, setPropic] = useState(null);

  useEffect(() => {
    setUser(userdata);
    setPropic('https://api.dicebear.com/7.x/notionists/svg?seed=' + userdata.id_user + '&background=%23fff&radius=50');
  }, [userdata]);

  return (
    <>
      {/* Welcome panel */}
      <section aria-labelledby="profile-overview-title">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <h2 className="sr-only" id="profile-overview-title">
            Profile Overview
          </h2>
          <div className="bg-white p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  <img className="mx-auto h-20 w-20 rounded-full" src={Propic} alt="" />
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <p className="text-sm font-medium text-gray-600">Bentornato,</p>
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {user?.name + " " + user?.surname}
                  </p>
                  <p className="text-sm font-medium text-gray-600">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <a key={stat.label} href={stat.link}>
                <div className="px-6 py-5 text-center text-sm font-medium">
                  <span className="text-gray-900">{stat.value}</span>{' '}
                  <span className="text-gray-600">{stat.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
