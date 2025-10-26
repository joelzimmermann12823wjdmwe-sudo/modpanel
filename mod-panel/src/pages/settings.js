'use client'

import { useState } from 'react'
import Head from 'next/head'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { useTheme } from '@/context/ThemeContext'

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <>
      <Head>
        <title>Einstellungen - Mod Panel</title>
      </Head>
      
      <Header />
      <main className="min-h-screen bg-gradient-light dark:bg-gradient-dark transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Card */}
            <div className="bg-white dark:bg-dark-800 border-2 border-primary-200 dark:border-accent-green/20 rounded-2xl shadow-2xl p-8 mb-8 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-dark-900 font-bold text-xl">⚙️</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-accent-green dark:to-accent-lime bg-clip-text text-transparent">
                    Einstellungen
                  </h1>
                  <p className="text-primary-600 dark:text-accent-green font-medium">
                    Passe das Mod-Panel nach deinen Vorlieben an
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Erscheinungsbild */}
              <div className="bg-white dark:bg-dark-800 border-2 border-primary-200 dark:border-accent-green/20 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl font-bold text-primary-700 dark:text-accent-green mb-6 flex items-center space-x-3">
                  <span className="text-2xl">🎨</span>
                  <span>Erscheinungsbild</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-dark-700 rounded-xl border border-primary-200 dark:border-dark-600">
                    <div>
                      <h3 className="font-bold text-primary-800 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-primary-600 dark:text-gray-400 mt-1">
                        Wechsle zwischen Hell- und Dunkelmodus
                      </p>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                        darkMode ? 'bg-accent-green' : 'bg-primary-400'
                      } shadow-lg hover:scale-105`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                          darkMode ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-dark-700 rounded-xl border border-primary-200 dark:border-dark-600">
                    <div>
                      <h3 className="font-bold text-primary-800 dark:text-white">Animations</h3>
                      <p className="text-sm text-primary-600 dark:text-gray-400 mt-1">
                        Übergänge und Animationen
                      </p>
                    </div>
                    <button className="relative inline-flex h-7 w-14 items-center rounded-full bg-primary-300 shadow-lg">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Benachrichtigungen */}
              <div className="bg-white dark:bg-dark-800 border-2 border-primary-200 dark:border-accent-green/20 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl font-bold text-primary-700 dark:text-accent-green mb-6 flex items-center space-x-3">
                  <span className="text-2xl">🔔</span>
                  <span>Benachrichtigungen</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-dark-700 rounded-xl border border-primary-200 dark:border-dark-600">
                    <div>
                      <h3 className="font-bold text-primary-800 dark:text-white">Push Benachrichtigungen</h3>
                      <p className="text-sm text-primary-600 dark:text-gray-400 mt-1">
                        Erhalte Benachrichtigungen für neue Aktionen
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                        notifications ? 'bg-accent-green' : 'bg-primary-400'
                      } shadow-lg hover:scale-105`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                          notifications ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-dark-700 rounded-xl border border-primary-200 dark:border-dark-600">
                    <div>
                      <h3 className="font-bold text-primary-800 dark:text-white">E-Mail Reports</h3>
                      <p className="text-sm text-primary-600 dark:text-gray-400 mt-1">
                        Tägliche Zusammenfassung per E-Mail
                      </p>
                    </div>
                    <button className="relative inline-flex h-7 w-14 items-center rounded-full bg-primary-300 shadow-lg">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Allgemein */}
              <div className="bg-white dark:bg-dark-800 border-2 border-primary-200 dark:border-accent-green/20 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl font-bold text-primary-700 dark:text-accent-green mb-6 flex items-center space-x-3">
                  <span className="text-2xl">⚙️</span>
                  <span>Allgemein</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-dark-700 rounded-xl border border-primary-200 dark:border-dark-600">
                    <div>
                      <h3 className="font-bold text-primary-800 dark:text-white">Auto-Save</h3>
                      <p className="text-sm text-primary-600 dark:text-gray-400 mt-1">
                        Änderungen automatisch speichern
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoSave(!autoSave)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                        autoSave ? 'bg-accent-green' : 'bg-primary-400'
                      } shadow-lg hover:scale-105`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                          autoSave ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 bg-primary-50 dark:bg-dark-700 rounded-xl border border-primary-200 dark:border-dark-600">
                    <label className="block text-sm font-bold text-primary-800 dark:text-white mb-3">
                      Sprache
                    </label>
                    <select className="w-full p-3 border-2 border-primary-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-600 text-primary-900 dark:text-white focus:border-primary-400 dark:focus:border-accent-green transition-all duration-200">
                      <option>Deutsch</option>
                      <option>English</option>
                      <option>Français</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Statistiken */}
              <div className="bg-white dark:bg-dark-800 border-2 border-primary-200 dark:border-accent-green/20 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl font-bold text-primary-700 dark:text-accent-green mb-6 flex items-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <span>Statistiken</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-dark-700 rounded-lg border border-primary-200 dark:border-dark-600">
                    <span className="text-primary-700 dark:text-gray-300 font-medium">Aktionen diesen Monat</span>
                    <span className="font-bold text-accent-green text-lg">47</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-dark-700 rounded-lg border border-primary-200 dark:border-dark-600">
                    <span className="text-primary-700 dark:text-gray-300 font-medium">Aktive Moderatoren</span>
                    <span className="font-bold text-accent-lime text-lg">8</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-dark-700 rounded-lg border border-primary-200 dark:border-dark-600">
                    <span className="text-primary-700 dark:text-gray-300 font-medium">Gelöste Fälle</span>
                    <span className="font-bold text-accent-emerald text-lg">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
