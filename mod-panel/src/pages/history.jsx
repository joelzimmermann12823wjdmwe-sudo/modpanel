import Head from 'next/head'
import Header from '@/components/Layout/Header'

export default function History() {
  return (
    <>
      <Head>
        <title>Verlauf - Mod Panel</title>
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Aktionsverlauf</h1>
        {/* History Komponente wird hier eingefügt */}
      </main>
    </>
  )
}
