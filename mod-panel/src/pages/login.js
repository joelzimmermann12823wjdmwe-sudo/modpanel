'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Falscher Benutzername oder Passwort')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-accent-gradient rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <span className="text-2xl font-bold text-dark-900">��</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-accent-green to-accent-lime bg-clip-text text-transparent">
            Mod Panel
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            Administrator Login
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-800 border-2 border-accent-green/20 rounded-2xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-accent-green mb-3">
                👤 Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border-2 border-dark-600 bg-dark-700 text-white rounded-xl placeholder-gray-500 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-all duration-200"
                placeholder="Admin Benutzername"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-accent-green mb-3">
                🔒 Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-dark-600 bg-dark-700 text-white rounded-xl placeholder-gray-500 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gradient hover:shadow-lg transform hover:scale-105 text-dark-900 font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Anmeldung...
                </span>
              ) : (
                '🚀 Anmelden'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Moderations Panel von Developer Joel Z.<br />
            Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  )
}
