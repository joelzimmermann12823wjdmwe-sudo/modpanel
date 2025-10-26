'use client'

import { useState } from 'react'
import { ACTION_TYPES } from '@/data/actionTypes'

export default function ActionForm({ onActionAdded }) {
  const [formData, setFormData] = useState({
    username: '',
    actionType: '',
    reason: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [lastAction, setLastAction] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validierung
    if (!formData.username.trim()) {
      setError('❌ Bitte gib einen Benutzernamen ein')
      return
    }
    if (!formData.actionType) {
      setError('❌ Bitte wähle einen Aktionstyp')
      return
    }
    if (!formData.reason) {
      setError('❌ Bitte wähle einen Grund')
      return
    }
    
    setLoading(true)
    
    try {
      console.log('🚀 Sende Aktion an API...', formData)
      
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          moderator: 'Admin'
        }),
      })

      console.log('📡 API Response:', response)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Aktion gespeichert:', result)
        
        // Erfolgs-Notification
        const actionEmoji = ACTION_TYPES.find(a => a.value === formData.actionType)?.emoji || '✅'
        const actionText = `${actionEmoji} Aktion "${formData.actionType}" für ${formData.username} wurde gespeichert!`
        
        // Setze letzte Aktion für Live-Feedback
        setLastAction({
          username: formData.username,
          actionType: formData.actionType,
          timestamp: new Date()
        })
        
        // Formular zurücksetzen
        setFormData({
          username: '',
          actionType: '',
          reason: '',
          notes: ''
        })

        // Refresh the action history
        if (onActionAdded) {
          console.log('🔄 Aktualisiere History...')
          onActionAdded()
        }

        // Auto-remove success message after 5 seconds
        setTimeout(() => {
          setLastAction(null)
        }, 5000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || '❌ Fehler beim Speichern der Aktion')
      }
    } catch (error) {
      console.error('💥 Fehler:', error)
      setError('🚨 Fehler: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-emerald-500/20 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold">⚡</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Neue Aktion
          </h2>
          <p className="text-gray-400 text-sm">Erstelle eine neue Moderations-Aktion</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">❌</span>
            <div>
              <p className="text-red-400 font-semibold">Fehler!</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Last Action Feedback */}
      {lastAction && (
        <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-emerald-400 font-semibold">Aktion erfolgreich!</p>
              <p className="text-emerald-300 text-sm">
                {ACTION_TYPES.find(a => a.value === lastAction.actionType)?.emoji} 
                {' '}{lastAction.actionType} für {lastAction.username}
              </p>
              <p className="text-emerald-200 text-xs">
                Wird live im Verlauf angezeigt
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <label className="block text-sm font-bold text-emerald-400 mb-3 flex items-center space-x-2">
            <span>👤</span>
            <span>Benutzername</span>
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full p-4 border-2 border-gray-600 bg-gray-700/50 text-white rounded-2xl placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 backdrop-blur-sm"
            placeholder="Gib den Benutzernamen ein..."
            required
          />
        </div>
        
        {/* Action Type Select */}
        <div>
          <label className="block text-sm font-bold text-emerald-400 mb-3 flex items-center space-x-2">
            <span>🎯</span>
            <span>Aktionstyp</span>
          </label>
          <select
            value={formData.actionType}
            onChange={(e) => setFormData({...formData, actionType: e.target.value})}
            className="w-full p-4 border-2 border-gray-600 bg-gray-700/50 text-white rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 backdrop-blur-sm"
            required
          >
            <option value="" className="text-gray-500">📋 Wähle eine Aktion...</option>
            {ACTION_TYPES.map(action => (
              <option key={action.value} value={action.value} className="text-white">
                {action.emoji} {action.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Reason Select */}
        <div>
          <label className="block text-sm font-bold text-emerald-400 mb-3 flex items-center space-x-2">
            <span>📝</span>
            <span>Grund</span>
          </label>
          <select
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full p-4 border-2 border-gray-600 bg-gray-700/50 text-white rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 backdrop-blur-sm"
            required
          >
            <option value="" className="text-gray-500">🎯 Wähle einen Grund...</option>
            <option value="spam">🚯 Spam</option>
            <option value="beleidigung">😠 Beleidigung</option>
            <option value="hassrede">⚡ Hassrede</option>
            <option value="betrug">🎭 Betrug</option>
            <option value="belästigung">🚫 Belästigung</option>
            <option value="sonstiges">📌 Sonstiges</option>
          </select>
        </div>
        
        {/* Notes Textarea */}
        <div>
          <label className="block text-sm font-bold text-emerald-400 mb-3 flex items-center space-x-2">
            <span>📋</span>
            <span>Notizen</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full p-4 border-2 border-gray-600 bg-gray-700/50 text-white rounded-2xl placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 backdrop-blur-sm"
            rows="4"
            placeholder="💡 Zusätzliche Notizen, Beweise oder Kommentare..."
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-2xl transform hover:scale-105 text-white font-bold py-5 px-6 rounded-2xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>🔄 Wird gespeichert...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg">🚀</span>
              <span>Aktion Ausführen</span>
            </span>
          )}
        </button>
      </form>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
        <p className="text-blue-400 text-sm text-center">
          🔍 <strong>Debug Info:</strong> Öffne die Browser-Konsole (F12) für Details
        </p>
      </div>
    </div>
  )
}
