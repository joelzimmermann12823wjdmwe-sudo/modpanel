import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, ListChecks } from 'lucide-react'
import ActionHistory from '../src/components/ActionHistory'

// Hier nutzen wir die Next.js API-Route, um die Daten zu laden
export async function getServerSideProps() {
  try {
    // Dynamischer Import, um sicherzustellen, dass getAllActions nur auf dem Server geladen wird
    const { getAllActions } = await import('../src/lib/data');
    const actions = await getAllActions();
    
    return { props: { actions } }
  } catch (error) {
    console.error('FEHLER BEIM LADEN DER LOGS:', error);
    return { props: { actions: [] } };
  }
}

export default function LogsPage({ actions }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <Head>
        <title>Alle Moderations-Logs</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <Link href="/" className="flex items-center text-futuristic-cyan dark:text-futuristic-emerald hover:underline mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück zum Dashboard
        </Link>
        
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
            <ListChecks className="w-10 h-10 mr-3 text-futuristic-cyan dark:text-futuristic-emerald" />
            Kompletter Protokoll-Verlauf
        </h1>

        <ActionHistory actions={actions} />
      </div>
    </div>
  )
}
