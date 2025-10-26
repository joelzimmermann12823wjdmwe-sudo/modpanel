import Head from 'next/head'
import Header from '@/components/Layout/Header'

export default function Settings() {
  return (
    <>
      <Head>
        <title>Einstellungen - Mod Panel</title>
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Einstellungen</h1>
        {/* Einstellungen werden hier hinzugefügt */}
      </main>
    </>
  )
}
