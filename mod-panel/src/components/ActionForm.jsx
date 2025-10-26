'use client'
import { useState, useTransition } from 'react'
import { Send, User, MessageSquare, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react'
import { saveAction } from '../lib/data' 
import { revalidatePath } from 'next/cache' // Muss hier importiert werden, da es in der Server Action verwendet wird

// Optionen
const ACTION_TYPES = [
  'Mündliche Verwarnung',
  'Warnung',
  'Kick',
  '1-Tages Bann',
  'Permanenter Bann',
]

const REASONS = [
  'Spam',
  'Beleidigung',
  'Hassrede',
  'Trolling',
  'Werbung',
  'Regelverstoß (Allgemein)',
]

// SERVER ACTION: Definiert die Funktion, die auf dem Server ausgeführt wird
async function createAction(formData) {
  'use server'
  
  const username = formData.get('username')
  const actionType = formData.get('actionType')
  const reason = formData.get('reason')
  const notes = formData.get('notes')
  const moderator = formData.get('moderator')

  const payload = { username, actionType, reason, notes, moderator }

  const result = await saveAction(payload)

  if (result.success) {
    // Wichtig: Revalidiert alle Pfade, die die Aktionen anzeigen (Dashboard und Logs)
    revalidatePath('/') 
    revalidatePath('/logs')
  }

  return result
}

export default function ActionForm() {
  // useTransition ist das moderne Äquivalent zu isLoading beim Formular-Submit
  const [isPending, startTransition] = useTransition() 
  const [status, setStatus] = useState({ type: null, message: '' })
  
  // Der Moderator-Name ist jetzt fester Bestandteil des Formulars (könnte später über Auth geladen werden)
  const moderatorName = 'Admin' 

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus({ type: null, message: '' })
    
    // Startet die Server Action im Hintergrund
    startTransition(async () => {
      const formData = new FormData(e.target)
      const result = await createAction(formData)

      if (result.success) {
        setStatus({ type: 'success', message: `Aktion erfolgreich protokolliert! ID: #${result.action.id}` })
        e.target.reset() // Formular zurücksetzen
      } else {
        setStatus({ type: 'error', message: result.error || 'Speichern fehlgeschlagen.' })
      }
    })
  }

  const statusStyle = status.type === 'success' 
    ? 'bg-green-100 text-green-800 border-green-500 dark:bg-green-900/50 dark:text-green-300' 
    : status.type === 'error' 
    ? 'bg-red-100 text-red-800 border-red-500 dark:bg-red-900/50 dark:text-red-300' 
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

      {/* Die Form sendet die Daten über die Server Action */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Hidden Field für Moderator-Namen */}
        <input type="hidden" name="moderator" value={moderatorName} />

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
              defaultValue={ACTION_TYPES[0]}
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
              defaultValue={REASONS[0]}
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
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-futuristic-cyan focus:border-futuristic-cyan dark:focus:ring-futuristic-emerald dark:focus:border-futuristic-emerald"
            placeholder="Zusätzliche Infos, z.B. Chat-Verlauf oder vorherige Vergehen."
          />
        </div>

        {/* Senden-Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-futuristic-emerald hover:bg-futuristic-emerald/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-futuristic-cyan dark:focus:ring-futuristic-emerald disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          {isPending ? (
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
