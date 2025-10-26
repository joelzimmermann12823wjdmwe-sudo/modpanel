'use client'

import { useState, useEffect } from 'react'
import { ACTION_TYPES } from '@/data/actionTypes'

export default function ActionHistory({ refresh }) {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isClient, setIsClient] = useState(false)

  // Markiere dass wir auf dem Client sind
  useEffect(() => {
    setIsClient(true)
    setLastUpdate(new Date())
  }, [])

  const loadActions = async () => {
    try {
      const response = await fetch('/api/actions')
      if (response.ok) {
        const data = await response.json()
        setActions(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Fehler beim Laden der Aktionen:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActions()
  }, [refresh])

  // Auto-Refresh alle 10 Sekunden
  useEffect(() => {
    const interval = setInterval(() => {
      loadActions()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getActionInfo = (actionType) => {
    return ACTION_TYPES.find(a => a.value === actionType) || {}
  }

  const getGermanTime = (dateString) => {
    if (!isClient) return { date: '', time: '' }
    
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('de-DE', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getTimeAgo = (dateString) => {
    if (!isClient) return ''
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Gerade eben'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Vor ${hours} Stunde${hours > 1 ? 'n' : ''}`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `Vor ${days} Tag${days > 1 ? 'en' : ''}`
    }
  }

  const filteredActions = filter === 'all' 
    ? actions 
    : actions.filter(action => action.action_type === filter)

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-emerald-500/20 rounded-3xl shadow-2xl p-8 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl">📜</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Aktionsverlauf
            </h2>
            <p className="text-gray-400 text-sm">Live-Übersicht aller Moderations-Aktionen</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Live Indicator */}
          {isClient && (
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">LIVE</span>
            </div>
          )}
          
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 border-2 border-gray-600 bg-gray-700/50 text-white rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 backdrop-blur-sm"
          >
            <option value="all">📊 Alle Aktionen</option>
            {ACTION_TYPES.map(action => (
              <option key={action.value} value={action.value}>
                {action.emoji} {action.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl animate-spin">🔄</span>
          </div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Lade Aktionen...</h3>
          <p className="text-gray-400">Die Aktionshistorie wird geladen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActions.map((action) => {
            const actionInfo = getActionInfo(action.action_type)
            const { date, time } = getGermanTime(action.created_at)
            const timeAgo = getTimeAgo(action.created_at)
            
            // Neue Aktionen hervorheben (weniger als 1 Minute alt)
            const isNew = isClient && (new Date() - new Date(action.created_at)) < 60000
            
            return (
              <div 
                key={action.id} 
                className={`
                  bg-gray-700/30 backdrop-blur-sm border-l-4 border-cyan-500 rounded-r-2xl p-6 
                  transition-all duration-200 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg
                  ${isNew ? 'animate-pulse bg-cyan-500/10 border-l-4 border-cyan-400' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`text-2xl ${actionInfo.emoji ? '' : 'hidden'}`}>
                        {actionInfo.emoji}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
                        isNew 
                          ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400/50' 
                          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                      }`}>
                        {actionInfo.label || action.action_type}
                        {isNew && <span className="ml-2 text-xs">🆕 NEU</span>}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <span>👤</span>
                        <span>{action.username}</span>
                      </h3>
                      
                      <p className="text-gray-300 flex items-center space-x-2">
                        <span>📝</span>
                        <span>{action.reason}</span>
                      </p>
                      
                      {action.notes && (
                        <div className="bg-gray-600/30 rounded-xl p-4 mt-3">
                          <p className="text-gray-400 text-sm flex items-start space-x-2">
                            <span>💡</span>
                            <span>{action.notes}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="bg-gray-600/30 rounded-2xl p-4 border border-cyan-500/20">
                      <p className="text-cyan-400 font-bold text-sm flex items-center space-x-1 justify-end">
                        <span>👮</span>
                        <span>von {action.moderator}</span>
                      </p>
                      <p className="text-gray-400 text-sm mt-1">{date}</p>
                      <p className="text-gray-500 text-xs">{time} Uhr</p>
                      {isClient && (
                        <p className="text-cyan-400 text-xs mt-1 font-semibold">{timeAgo}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          
          {filteredActions.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📭</span>
              </div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-3">Keine Aktionen gefunden</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                {filter === 'all' 
                  ? '🎉 Noch keine Moderationsaktionen durchgeführt. Starte jetzt deine erste Aktion!'
                  : `🔍 Keine Aktionen vom Typ "${ACTION_TYPES.find(a => a.value === filter)?.label}" gefunden.`
                }
              </p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl transition-all duration-200"
                >
                  📊 Alle Aktionen anzeigen
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-gray-600/30">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>📈 Gesamt: {filteredActions.length} Aktionen</span>
          <span className="flex items-center space-x-2">
            {isClient && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Zuletzt aktualisiert: {lastUpdate?.toLocaleTimeString('de-DE') || 'Lade...'}</span>
              </>
            )}
          </span>
        </div>
        {isClient && (
          <div className="text-center mt-2">
            <p className="text-cyan-400 text-xs">
              🔄 Auto-Refresh alle 10 Sekunden aktiv
            </p>
            <p className="text-gray-500 text-xs mt-1">
              🕒 Alle Zeiten in Berliner Zeit (CET/CEST)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
