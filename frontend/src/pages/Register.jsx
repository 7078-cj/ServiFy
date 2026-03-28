import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../utils/auth';

function Register() {
  const dispatch = useDispatch()
  const nav = useNavigate()

  return (
  <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4'>
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
      
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Account
      </h2>

      <form onSubmit={(e) => registerUser(e, dispatch, nav)} className="flex flex-col space-y-4">

        <label className="flex flex-col text-sm font-medium text-gray-600">
          Username
          <input
            type="text"
            name="username"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          />
        </label>

        <div className='flex gap-3'>
          <label className="flex flex-col text-sm font-medium text-gray-600 w-full">
            First Name
            <input
              type="text"
              name="first_name"
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-600 w-full">
            Last Name
            <input
              type="text"
              name="last_name"
              className="mt-1 px-4 py-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </label>
        </div>

        <label className="flex flex-col text-sm font-medium text-gray-600">
          Email
          <input
            type="email"
            name="email"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-gray-600">
          Password
          <input
            type="password"
            name="password"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg text-white font-semibold transition shadow-md hover:shadow-lg"
        >
          Register
        </button>
      </form>

      <p className="mt-5 text-center text-gray-500 text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          Login
        </a>
      </p>

    </div>
  </div>
  )
}

export default Register