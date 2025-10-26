import Head from 'next/head'
import Header from '@/components/Layout/Header'

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Mod Panel</title>
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Statistik Karten werden hier hinzugefügt */}
        </div>
      </main>
    </>
  )
}
