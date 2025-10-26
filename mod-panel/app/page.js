import Link from 'next/link'
import ActionForm from '../src/components/ActionForm' 
import SettingsModal from '../src/components/SettingsModal' 
import { Settings, ListChecks, Shield, Zap } from 'lucide-react'
import { getAllActions } from '../src/lib/data'

// Dies ist eine Server Komponente und holt die Daten direkt von Vercel KV
export default async function Dashboard() {
  // Lade alle Aktionen
  const actions = await getAllActions();
  
  // Da SettingsModal 'use client' ist, müssen wir den State für das Modal in einer Client-Komponente halten.
  // Wir erstellen dafür eine Wrapper-Komponente.
  return (
    <ClientDashboardWrapper initialActions={actions} />
  )
}

// Client-Wrapper für das Modal, muss in einer eigenen Datei liegen oder so eingebettet werden
function ClientDashboardWrapper({ initialActions }) {
  // Wir verwenden hier einen Client-Side State, obwohl die Daten per Server Component geladen werden
  // Eine bessere Lösung wäre, nur die Logs in einem separaten Client Component zu rendern,
  // aber für das Modal ist dieser Wrapper die schnellste Lösung im App Router
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  return (
    <div className="min-h-screen p-4 sm:p-8">
      
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center">
          <Shield className="w-10 h-10 mr-3 text-futuristic-emerald dark:text-futuristic-cyan" />
          Mod-Panel Dashboard
        </h1>
        <div className="flex space-x-4">
          <Link href="/logs" className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors flex items-center font-medium">
            <ListChecks className="w-5 h-5 mr-2" />
            Logs ansehen
          </Link>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg shadow-md transition-colors flex items-center font-medium"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActionForm /> {/* Die Server Action in ActionForm löst die Aktualisierung aus */}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-futuristic-cyan/50 dark:border-futuristic-emerald/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                  Status-Übersicht
              </h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                      <span>Aktueller Moderator:</span> 
                      <span className="font-semibold text-futuristic-emerald">Admin</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                      <span>Gesamteinträge:</span> 
                      <span className="font-semibold text-futuristic-cyan">{initialActions.length}</span>
                  </li>
                  <li className="flex justify-between">
                      <span>Panel-Version:</span> 
                      <span className="font-semibold text-sm text-gray-500">3.0 (App Router)</span>
                  </li>
              </ul>
              <Link href="/logs" className="mt-6 block w-full text-center py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                  Gesamte Historie (Logs)
              </Link>
          </div>
        </div>
      </div>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  )
}

// Füge den 'use client'-Import für den Wrapper hinzu
import { useState } from 'react'
import 'client-only'
