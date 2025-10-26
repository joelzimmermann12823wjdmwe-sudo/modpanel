import { useState, useEffect } from 'react'

export default function DebugDB() {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState('')

  const loadActions = async () => {
    try {
      console.log('🔄 Lade Aktionen...')
      const response = await fetch('/api/actions')
      console.log('📡 Response:', response)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Geladene Aktionen:', data)
        setActions(data)
      } else {
        console.error('❌ Fehler beim Laden:', response.status)
      }
    } catch (error) {
      console.error('💥 Fehler:', error)
    } finally {
      setLoading(false)
    }
  }

  const testAddAction = async () => {
    try {
      console.log('🧪 Teste Aktion hinzufügen...')
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'TestUser',
          actionType: 'verbal',
          reason: 'Test Grund',
          notes: 'Dies ist ein Test',
          moderator: 'Admin'
        }),
      })

      console.log('📡 Test Response:', response)
      const result = await response.json()
      console.log('📝 Test Result:', result)

      if (response.ok) {
        setTestResult('✅ Test erfolgreich! Aktion wurde gespeichert.')
        loadActions() // Neu laden
      } else {
        setTestResult(`❌ Test fehlgeschlagen: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Test Fehler:', error)
      setTestResult(`💥 Test Fehler: ${error.message}`)
    }
  }

  useEffect(() => {
    loadActions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Database Debug</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🧪 Test Aktionen</h2>
          <button
            onClick={testAddAction}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-4"
          >
            Test Aktion hinzufügen
          </button>
          {testResult && (
            <div className={`p-3 rounded ${testResult.includes('✅') ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Actions List */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">📊 Gespeicherte Aktionen ({actions.length})</h2>
          <button
            onClick={loadActions}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
          >
            Aktionen neu laden
          </button>
          
          {loading ? (
            <p>Lade Aktionen...</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {actions.map((action) => (
                <div key={action.id} className="bg-gray-700 p-3 rounded">
                  <p><strong>User:</strong> {action.username}</p>
                  <p><strong>Aktion:</strong> {action.action_type}</p>
                  <p><strong>Grund:</strong> {action.reason}</p>
                  <p><strong>Datum:</strong> {new Date(action.created_at).toLocaleString('de-DE')}</p>
                </div>
              ))}
              {actions.length === 0 && (
                <p className="text-gray-400">Keine Aktionen gefunden</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Console Info */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">📟 Browser Konsole</h2>
        <p className="text-gray-400">
          Öffne die Browser-Konsole (F12) um detaillierte Logs zu sehen.
        </p>
      </div>
    </div>
  )
}
