import Link from 'next/link'
import { ArrowLeft, ListChecks } from 'lucide-react'
import ActionHistory from '../../src/components/ActionHistory'
import { getAllActions } from '../../src/lib/data' 

export default async function LogsPage() {
  const actions = await getAllActions();

  return (
    <div className="min-h-screen p-4 sm:p-8">
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
