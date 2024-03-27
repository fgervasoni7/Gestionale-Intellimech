import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import {
  XCircleIcon,
  CheckBadgeIcon,  
} from '@heroicons/react/24/outline'

const Logo = './assets/intellimech.svg';

const Login = () => {
  // Check if the user is already logged in
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      window.location.href = '/homepage';
    }
    else {
      // remove token from cookies and clear local storage
      Cookies.remove('token');
      localStorage.clear();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password, rememberMe: event.target['remember-me'].checked});

      // Save the token in cookies and set the duration to 7 days or at 15 days if the user checks the remember me checkbox
      const token = response.data.token;

      if (event.target['remember-me'].checked) {
        Cookies.set('token', token, { expires: 15 });
      } else {
        Cookies.set('token', token, { expires: 7 });
      }

      // Set login success state
      setLoginSuccess(true);


      // after 3 seconds redirect to homepage
      setTimeout(() => {
        window.location.href = '/homepage';
      }, 3000);
    } catch (error) {
      console.error('Error:', error);

      // Set login failure state and capture error messages
      setLoginSuccess(false);
      setErrorMessages(error.response?.data?.message || ['An unexpected error occurred']);
    }
  };

  //  return (
  //   <>
  //     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
  //       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
  //         <img
  //           className="mx-auto h-15 w-auto"
  //           src={"./assets/logo.svg"}
  //           alt="Your Company"
  //         />
  //         <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
  //           Sign in to your account
  //         </h2>
  //       </div>

  //       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
  //         <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
  //           <div>
  //             <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
  //               Email address
  //             </label>
  //             <div className="mt-2">
  //               <input
  //                 id="email"
  //                 name="email"
  //                 type="email"
  //                 autoComplete="email"
  //                 required
  //                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
  //               />
  //             </div>
  //           </div>

  //           <div>
  //             <div className="flex items-center justify-between">
  //               <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
  //                 Password
  //               </label>
  //               <div className="text-sm">
  //                 <a href="#" className="font-semibold text-sky-600 hover:text-sky-500">
  //                   Forgot password?
  //                 </a>
  //               </div>
  //             </div>
  //             <div className="mt-2">
  //               <input
  //                 id="password"
  //                 name="password"
  //                 type="password"
  //                 autoComplete="current-password"
  //                 required
  //                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
  //               />
  //             </div>
  //           </div>

  //           <div>
  //             <button
  //               type="submit"
  //               className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
  //             >
  //               Sign in
  //             </button>
  //           </div>
            
  //           {loginSuccess === true && (
  //             <div className="rounded-md bg-green-50 p-4">
  //               <div className="flex">
  //                 <div className="flex-shrink-0">
  //                   <XCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
  //                 </div>
  //                 <div className="ml-3">
  //                   <h3 className="text-sm font-medium text-green-800">Login Successfully</h3>
  //                 </div>
  //               </div>
  //             </div>
  //           )}

  //           {loginSuccess === false && (
  //             <div className="rounded-md bg-red-50 p-4">
  //               <div className="flex">
  //                 <div className="flex-shrink-0">
  //                   <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
  //                 </div>
  //                 <div className="ml-3">
  //                   <h3 className="text-sm font-medium text-red-800">{errorMessages}</h3>
  //                 </div>
  //               </div>
  //             </div>
  //           )}

  //         </form>
  //       </div>
  //     </div>
  //   </>
  // );

  return (
    <>
<div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
        <img className="mx-auto h-10 w-auto mb-6" src={Logo} alt="Your Company" />
        <h2 className="text-center text-xl font-bold leading-9 text-gray-900 mb-6">
          Sign in to your account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm leading-5 text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm leading-5">
              <a href="#" className="font-semibold text-sky-600 hover:text-sky-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Sign in
            </button>
          </div>
        </form>

        {loginSuccess === true && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckBadgeIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Login Successfully</h3>
              </div>
            </div>
          </div>
        )}

        {loginSuccess === false && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errorMessages}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Login;