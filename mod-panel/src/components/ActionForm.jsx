import { useState } from 'react'
import { Send, User, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

// Optionen für die Moderations-Aktion
const ACTION_TYPES = [
  'Mündliche Verwarnung',
  'Warnung',
  'Kick',
  '1-Tages Bann',
  'Permanenter Bann',
]

// Häufige Gründe
const REASONS = [
  'Spam',
  'Beleidigung',
  'Hassrede',
  'Trolling',
  'Werbung',
  'Regelverstoß (Allgemein)',
]

export default function ActionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    actionType: ACTION_TYPES[0],
    reason: REASONS[0],
    notes: '',
  })
  const [status, setStatus] = useState({ type: null, message: '' })
  const [isLoading, setIsLoading] = useState(false)
  
  // HINWEIS: Hier müsste der Moderator-Name eigentlich aus einem Auth-Context geladen werden.
  // Wir verwenden 'Admin' als Standard, wie im SettingsModal simuliert.
  const moderatorName = 'Admin' 

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: null, message: '' })
    setIsLoading(true)

    // Daten, die an die API gesendet werden
    const payload = {
      ...formData,
      moderator: moderatorName,
    }

    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Fehler beim Speichern der Aktion: ${response.statusText}`)
      }

      const result = await response.json()
      setStatus({ type: 'success', message: `Aktion erfolgreich protokolliert! ID: #${result.id}` })
      setFormData({ username: '', actionType: ACTION_TYPES[0], reason: REASONS[0], notes: '' })
      if (onSuccess) {
        // Ruft die Reload-Funktion des Dashboards auf
        onSuccess() 
      }

    } catch (error) {
      console.error(error)
      setStatus({ type: 'error', message: 'Speichern fehlgeschlagen. Überprüfe die Server-Logs.' })
    } finally {
      setIsLoading(false)
    }
  }

  const statusStyle = status.type === 'success' 
    ? 'bg-green-100 text-green-800 border-green-500' 
    : status.type === 'error' 
    ? 'bg-red-100 text-red-800 border-red-500' 
    : 'hidden'

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border-t-4 border-futuristic-emerald dark:border-futuristic-cyan">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
        <Send className="w-8 h-8 mr-2 text-futuristic-emerald dark:text-futuristic-cyan" />
        Neue Moderations-Aktion protokollieren
      </h2>
      
      {/* Status-Meldung */}
      <div className={`p-4 mb-6 rounded-lg border-l-4 ${statusStyle}`}>
        <div className="flex items-center">
            {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertTriangle className="w-5 h-5 mr-2" />}
            <p className="font-medium text-sm">{status.message}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Moderator Info */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">Aktion als **{moderatorName}** protokollieren</span>
        </div>

        {/* 1. Benutzername */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
            <User className="w-4 h-4 mr-2" />
            Betroffener Benutzername
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-futuristic-cyan focus:border-futuristic-cyan dark:focus:ring-futuristic-emerald dark:focus:border-futuristic-emerald"
            placeholder="z.B. Mustermann77"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. Art der Aktion */}
          <div>
            <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Aktionstyp
            </label>
            <select
              id="actionType"
              name="actionType"
              value={formData.actionType}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-futuristic-cyan focus:border-futuristic-cyan dark:focus:ring-futuristic-emerald dark:focus:border-futuristic-emerald"
            >
              {ACTION_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* 3. Grund */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Hauptgrund
            </label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-futuristic-cyan focus:border-futuristic-cyan dark:focus:ring-futuristic-emerald dark:focus:border-futuristic-emerald"
            >
              {REASONS.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Notizen */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
            <FileText className="w-4 h-4 mr-2" />
            Detaillierte Notizen (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-futuristic-cyan focus:border-futuristic-cyan dark:focus:ring-futuristic-emerald dark:focus:border-futuristic-emerald"
            placeholder="Zusätzliche Infos, z.B. Chat-Verlauf oder vorherige Vergehen."
          />
        </div>

        {/* Senden-Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-futuristic-emerald hover:bg-futuristic-emerald/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-futuristic-cyan dark:focus:ring-futuristic-emerald disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Speichere...
            </span>
          ) : (
            <span className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Aktion protokollieren
            </span>
          )}
        </button>
      </form>
    </div>
  )
}
