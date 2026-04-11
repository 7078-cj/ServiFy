import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../utils/auth';
import { validateRegisterFields } from '../utils/validation';
import AppLogo from '../components/AppLogo';

function Register() {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const fields = {
      username: e.target.username.value,
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    }
    const { valid, errors: next } = validateRegisterFields(fields)
    if (!valid) {
      setErrors(next)
      return
    }
    setErrors({})
    registerUser(e, dispatch, nav)
  }

  return (
  <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10'>
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100/80">
      <div className="flex flex-col items-center mb-6">
        <AppLogo to="/register" size="lg" className="mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Create account
        </h2>
        <p className="text-sm text-gray-500 mt-1 text-center">Join Servify to book and offer services</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

        <label className="flex flex-col text-sm font-medium text-gray-600">
          Username
          <input
            type="text"
            name="username"
            autoComplete="username"
            aria-invalid={!!errors.username}
            className={`mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition ${
              errors.username ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.username && <span className="mt-1 text-xs text-red-600">{errors.username}</span>}
        </label>

        <div className='flex gap-3'>
          <label className="flex flex-col text-sm font-medium text-gray-600 w-full">
            First Name
            <input
              type="text"
              name="first_name"
              autoComplete="given-name"
              aria-invalid={!!errors.first_name}
              className={`mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition ${
                errors.first_name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.first_name && <span className="mt-1 text-xs text-red-600">{errors.first_name}</span>}
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-600 w-full">
            Last Name
            <input
              type="text"
              name="last_name"
              autoComplete="family-name"
              aria-invalid={!!errors.last_name}
              className={`mt-1 px-4 py-2 border w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition ${
                errors.last_name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.last_name && <span className="mt-1 text-xs text-red-600">{errors.last_name}</span>}
          </label>
        </div>

        <label className="flex flex-col text-sm font-medium text-gray-600">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={`mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.email && <span className="mt-1 text-xs text-red-600">{errors.email}</span>}
        </label>

        <label className="flex flex-col text-sm font-medium text-gray-600">
          Password
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            className={`mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition ${
              errors.password ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.password && <span className="mt-1 text-xs text-red-600">{errors.password}</span>}
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
        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
          Log in
        </Link>
      </p>

    </div>
  </div>
  )
}

export default Register
