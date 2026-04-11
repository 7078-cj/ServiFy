import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { loginUser } from '../utils/auth';
import { validateLoginFields } from '../utils/validation';
import AppLogo from '../components/AppLogo';

function Login() {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const password = e.target.password.value
    const { valid, errors: next } = validateLoginFields(username, password)
    if (!valid) {
      setErrors(next)
      return
    }
    setErrors({})
    loginUser(e, dispatch, nav)
  }

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">

    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100/80">
      <div className="flex flex-col items-center mb-6">
        <AppLogo to="/login" size="lg" className="mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 mt-1 text-center">Sign in to continue to Servify</p>
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
          {errors.username && (
            <span className="mt-1 text-xs text-red-600">{errors.username}</span>
          )}
        </label>

        <label className="flex flex-col text-sm font-medium text-gray-600">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            className={`mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition ${
              errors.password ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <span className="mt-1 text-xs text-red-600">{errors.password}</span>
          )}
        </label>

        <div className="flex justify-end text-sm">
          <Link to="/forgot_password" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg text-white font-semibold transition shadow-md hover:shadow-lg"
        >
          Login
        </button>

      </form>

      <p className="mt-6 text-center text-gray-500 text-sm">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
          Register
        </Link>
      </p>

    </div>
  </div>
  )
}

export default Login
