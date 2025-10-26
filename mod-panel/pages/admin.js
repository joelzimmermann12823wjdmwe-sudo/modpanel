import { useState, useEffect } from 'react'

export default function Admin() {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [dbInfo, setDbInfo] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Aktionen laden
      const response = await fetch('/api/actions')
      if (response.ok) {
        const data = await response.json()
        setActions(data)
        
        // Statistiken berechnen
        const totalActions = data.length
        const today = new Date().toDateString()
        const todayActions = data.filter(action => 
          new Date(action.created_at).toDateString() === today
        ).length
        
        // Action-Type Verteilung
        const actionDistribution = data.reduce((acc, action) => {
          acc[action.action_type] = (acc[action.action_type] || 0) + 1
          return acc
        }, {})
        
        setStats({
          totalActions,
          todayActions,
          actionDistribution
        })
        
        setDbInfo(`📊 ${totalActions} Aktionen gespeichert (${todayActions} heute)`)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
      setDbInfo('❌ Fehler beim Laden der Daten')
    } finally {
      setLoading(false)
    }
  }

  const clearDatabase = async () => {
    if (!confirm('⚠️ ALLE Daten löschen? Dies kann nicht rückgängig gemacht werden!')) {
      return
    }
    
    try {
      const response = await fetch('/api/admin/clear', {
        method: 'POST'
      })
      
      if (response.ok) {
        alert('✅ Datenbank wurde geleert')
        loadData()
      } else {
        alert('❌ Fehler beim Löschen der Daten')
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('❌ Fehler beim Löschen der Daten')
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(actions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `modpanel-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-emerald-500/30 rounded-3xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">🛠️ Datenbank Admin</h1>
          <p className="text-gray-300 text-lg">{dbInfo}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Statistiken */}
          <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">📈 Statistiken</h2>
            {loading ? (
              <p>Lade...</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Gesamt Aktionen:</span>
                  <span className="font-bold text-blue-400">{stats.totalActions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aktionen heute:</span>
                  <span className="font-bold text-green-400">{stats.todayActions}</span>
                </div>
                {Object.entries(stats.actionDistribution || {}).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}:</span>
                    <span className="font-bold text-yellow-400">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Datenbank Aktionen */}
          <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">⚡ Aktionen</h2>
            <div className="space-y-4">
              <button
                onClick={loadData}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-2xl transition-all"
              >
                🔄 Daten neu laden
              </button>
              <button
                onClick={exportData}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-2xl transition-all"
              >
                💾 Backup exportieren
              </button>
              <button
                onClick={clearDatabase}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-2xl transition-all"
              >
                🗑️ Alle Daten löschen
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">ℹ️ Info</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p>📍 <strong>Datenbank:</strong> SQLite</p>
              <p>📁 <strong>Datei:</strong> modpanel.db</p>
              <p>💾 <strong>Backup:</strong> JSON Export</p>
              <p>⚡ <strong>Performance:</strong> Echtzeit</p>
            </div>
          </div>
        </div>

        {/* Aktionen Liste */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-500/30 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📋 Gespeicherte Aktionen</h2>
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
              {actions.length} Einträge
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Lade Aktionen...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {actions.map((action) => (
                <div key={action.id} className="bg-gray-700/30 border-l-4 border-yellow-500 rounded-r-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                          {action.action_type}
                        </span>
                        <span className="text-white font-semibold">{action.username}</span>
                      </div>
                      <p className="text-gray-300 mb-1">{action.reason}</p>
                      {action.notes && (
                        <p className="text-gray-400 text-sm">💡 {action.notes}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <div>von {action.moderator}</div>
                      <div>{new Date(action.created_at).toLocaleDateString('de-DE')}</div>
                      <div>{new Date(action.created_at).toLocaleTimeString('de-DE')}</div>
                    </div>
                  </div>
                </div>
              ))}
              {actions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  📭 Keine Aktionen in der Datenbank
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p>© 2025 Moderations Panel - SQLite Datenbank System</p>
        </div>
      </div>
    </div>
  )
}
