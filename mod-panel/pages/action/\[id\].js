import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, User, Hash, Clock, FileText, Settings, XCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { getActionById } from '../../src/lib/data' 
import { formatDateTime } from '../../src/lib/dayjs-config'

// Lade die Daten für den spezifischen Bericht aus der Datenbank (data.json)
export async function getServerSideProps(context) {
  const { id } = context.params
  try {
    const action = await getActionById(id)
    
    if (!action) {
      return { notFound: true }
    }
    return { props: { action } }
  } catch (error) {
    console.error('Fehler beim Laden der Aktion:', error)
    return { notFound: true }
  }
}

const actionColors = {
  'Mündliche Verwarnung': 'text-green-500 bg-green-50 dark:bg-green-900/50',
  'Warnung': 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/50',
  'Kick': 'text-orange-500 bg-orange-50 dark:bg-orange-900/50',
  '1-Tages Bann': 'text-red-500 bg-red-50 dark:bg-red-900/50',
  'Permanenter Bann': 'text-purple-500 bg-purple-50 dark:bg-purple-900/50',
}

const ActionDetail = ({ action }) => {
  const colorClass = actionColors[action.actionType] || 'text-gray-500 bg-gray-50 dark:bg-gray-700/50'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Head>
        <title>Bericht #{action.id} - {action.username}</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <Link href="/logs" className="flex items-center text-futuristic-cyan dark:text-futuristic-emerald hover:underline mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück zur Protokoll-Historie
        </Link>

        {action ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border-t-4 border-futuristic-cyan dark:border-futuristic-emerald">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
              <Hash className="w-8 h-8 mr-2" />
              Moderationsbericht #{action.id}
            </h1>

            {/* Aktions-Badge */}
            <div className={`inline-flex items-center px-4 py-2 text-lg font-bold rounded-full mb-6 ${colorClass} border border-current`}>
              {action.actionType}
            </div>

            <div className="space-y-6">
              <DetailItem icon={User} label="Betroffener Benutzer" value={action.username} />
              <DetailItem icon={Settings} label="Moderator" value={action.moderator} />
              <DetailItem icon={Clock} label="Zeitpunkt der Aktion" value={formatDateTime(action.timestamp)} />
              <DetailItem icon={XCircle} label="Grund der Aktion" value={action.reason} />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <DetailItem icon={FileText} label="Detaillierte Notizen" value={action.notes || 'Keine Notizen hinterlegt.'} isLongText />
            </div>
            
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Dieser Bericht wurde am {formatDateTime(action.timestamp)} erfolgreich protokolliert.
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
             <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
             <h2 className="text-2xl font-bold dark:text-white">Aktion nicht gefunden</h2>
             <p className="text-gray-500 dark:text-gray-400">Der gesuchte Moderationsbericht mit der ID **{context.query.id}** existiert nicht.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const DetailItem = ({ icon: Icon, label, value, isLongText = false }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </h3>
    <p className={`mt-1 text-gray-900 dark:text-white ${isLongText ? 'whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md' : 'text-lg font-semibold'}`}>
      {value}
    </p>
  </div>
)

export default ActionDetail
