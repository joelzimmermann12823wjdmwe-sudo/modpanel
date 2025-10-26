import Head from 'next/head'
import Header from '../src/components/Layout/Header'
import ActionForm from '../src/components/ModActions/ActionForm'
import ActionHistory from '../src/components/ModActions/ActionHistory'
import Footer from '../src/components/Layout/Footer'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentUser] = useState('Admin')
  const [stats, setStats] = useState({
    totalActions: 0,
    todayActions: 0,
    status: 'Aktiv'
  })
  const [isClient, setIsClient] = useState(false)

  // Markiere dass wir auf dem Client sind
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Lade Statistiken
  const loadStats = async () => {
    try {
      const response = await fetch('/api/actions')
      if (response.ok) {
        const actions = await response.json()
        
        // Heutige Aktionen zählen
        const today = new Date().toDateString()
        const todayActions = actions.filter(action => 
          new Date(action.created_at).toDateString() === today
        ).length

        setStats({
          totalActions: actions.length,
          todayActions: todayActions,
          status: isClient ? '🟢 Live' : 'Aktiv'
        })
      }
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error)
    }
  }

  const handleActionAdded = () => {
    setRefreshKey(prev => prev + 1)
    // Statistiken neu laden
    setTimeout(loadStats, 500)
  }

  // Lade initiale Statistiken
  useEffect(() => {
    loadStats()
  }, [isClient])

  // Auto-Refresh alle 30 Sekunden
  useEffect(() => {
    if (!isClient) return
    
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
      loadStats()
    }, 30000)

    return () => clearInterval(interval)
  }, [isClient])

  return (
    <>
      <Head>
        <title>🛡️ Mod Panel - Dashboard</title>
        <meta name="description" content="Modernes Moderations Panel für Community Management" />
      </Head>
      
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-emerald-500/30 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">��</span>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-1">
                        Willkommen im <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Mod Panel</span>!
                      </h1>
                      <p className="text-gray-300 text-lg">
                        🚀 Live Moderations-System
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/20">
                    <p className="text-gray-400 text-sm">👤 Aktiver Benutzer</p>
                    <p className="text-emerald-400 font-bold text-lg">{currentUser}</p>
                    {isClient && (
                      <p className="text-green-400 text-xs mt-1 animate-pulse">🟢 Online</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Live Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/20 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg">📊</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Aktionen</p>
                      <p className="text-white font-bold text-xl">{stats.totalActions}</p>
                      <p className="text-emerald-400 text-xs">Gesamt</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/20 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Heute</p>
                      <p className="text-white font-bold text-xl">{stats.todayActions}</p>
                      <p className="text-cyan-400 text-xs">Letzte 24h</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-white font-bold text-xl">{stats.status}</p>
                      <p className="text-purple-400 text-xs">Echtzeit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Indicator */}
              {isClient && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live Updates aktiv - Auto-Refresh alle 30s</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Action Form Sidebar */}
            <div className="xl:col-span-1">
              <ActionForm onActionAdded={handleActionAdded} />
            </div>
            
            {/* Action History Main */}
            <div className="xl:col-span-3">
              <ActionHistory key={refreshKey} refresh={refreshKey} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
