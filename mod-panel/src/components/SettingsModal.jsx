'use client'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Sun, Moon, Settings, X, LogIn } from 'lucide-react'

export default function SettingsModal({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme()
  
  if (!isOpen) return null

  // Moderator-Name wird jetzt nur simuliert, da die KV-Datenbank keinen Moderator-Namen benötigt
  const [moderatorName, setModeratorName] = useState('Admin') 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md m-4 p-6 border-2 border-futuristic-cyan/50 dark:border-futuristic-emerald/50">
        <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold flex items-center text-gray-900 dark:text-white">
            <Settings className="w-6 h-6 mr-2 text-futuristic-cyan dark:text-futuristic-emerald" />
            Generelle Einstellungen
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
            {theme === 'light' ? <Sun className="w-5 h-5 mr-2 text-yellow-500" /> : <Moon className="w-5 h-5 mr-2 text-blue-300" />}
            Anzeige-Modus
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-3 rounded-lg text-center font-medium transition-colors ${
                theme === 'light' ? 'bg-futuristic-cyan text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              ☀️ Hell
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-3 rounded-lg text-center font-medium transition-colors ${
                theme === 'dark' ? 'bg-futuristic-emerald text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🌙 Dunkel
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex-1 p-3 rounded-lg text-center text-sm font-medium transition-colors ${
                theme === 'system' ? 'bg-gray-500 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🖥️ System
            </button>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
            <LogIn className="w-5 h-5 mr-2 text-indigo-500" />
            Moderator-Konfiguration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Der in den Logs gespeicherte Name:</p>
          <input
            type="text"
            value={moderatorName}
            onChange={(e) => setModeratorName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-futuristic-cyan dark:focus:ring-futuristic-emerald"
          />
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-futuristic-emerald text-white font-semibold rounded-lg shadow-md hover:bg-futuristic-emerald/80 transition-colors"
            >
              Speichern & Schließen
            </button>
        </div>
      </div>
    </div>
  )
}
