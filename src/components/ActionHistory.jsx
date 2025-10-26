'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Hash, Clock, User, MessageSquare, AlertTriangle, ChevronRight } from 'lucide-react'
import { formatDateTime, formatRelativeTime } from '../lib/dayjs-config'

const actionStyles = {
  'Mündliche Verwarnung': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-l-4 border-green-500',
  'Warnung': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-l-4 border-yellow-500',
  'Kick': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-l-4 border-orange-500',
  '1-Tages Bann': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-l-4 border-red-500',
  'Permanenter Bann': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-l-4 border-purple-500',
}

export default function ActionHistory({ actions }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredActions = useMemo(() => {
    if (!searchTerm) {
      return actions
    }
    const lowerCaseSearch = searchTerm.toLowerCase()
    return actions.filter(action =>
      action.username.toLowerCase().includes(lowerCaseSearch) ||
      action.actionType.toLowerCase().includes(lowerCaseSearch) ||
      action.reason.toLowerCase().includes(lowerCaseSearch) ||
      formatDateTime(action.timestamp).toLowerCase().includes(lowerCaseSearch)
    )
  }, [actions, searchTerm])

  if (!actions || actions.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
        <p className="text-gray-700 dark:text-gray-300">Es wurden noch keine Moderations-Aktionen protokolliert.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-gray-100 dark:border-gray-700">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
        <Hash className="w-8 h-8 mr-2 text-futuristic-cyan dark:text-futuristic-emerald" />
        Protokoll Historie
      </h2>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Namen, Datum oder Aktion suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-futuristic-cyan dark:focus:ring-futuristic-emerald transition-colors"
        />
      </div>

      <div className="space-y-4">
        {filteredActions.map((action) => (
          <Link 
            key={action.id} 
            href={`/logs/${action.id}`} 
            passHref
            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg ${actionStyles[action.actionType] || 'bg-gray-100 dark:bg-gray-700'}`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg truncate">
                {action.username}
                <span className="ml-3 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600">
                  {action.actionType}
                </span>
              </div>
              
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-3">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" /> {action.moderator}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" /> {action.reason}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end min-w-[150px] ml-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatRelativeTime(action.timestamp)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" /> {formatDateTime(action.timestamp)}
              </span>
            </div>
            <ChevronRight className="w-6 h-6 ml-3 text-gray-400" />
          </Link>
        ))}
        
        {filteredActions.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Keine Einträge für die Suche "{searchTerm}" gefunden.</p>
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xs">
        <p className="text-gray-500 dark:text-gray-400 flex items-center">
          🕒 Alle Zeitangaben in **Berliner Zeit**
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Gefunden: {filteredActions.length} / {actions.length} Einträge
        </p>
      </div>
    </div>
  )
}
