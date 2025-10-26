export default function Header() {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm border-b border-emerald-500/30 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Mod Panel
              </h1>
              <p className="text-emerald-400 text-sm font-medium">
                Community Management Tool
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a href="/dashboard" className="text-emerald-400 hover:text-cyan-400 font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                <span>📊</span>
                <span>Dashboard</span>
              </a>
            </nav>
            
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-emerald-400 font-medium flex items-center space-x-2">
                  <span>👤</span>
                  <span>Admin</span>
                </p>
                <p className="text-xs text-gray-400">
                  Moderator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
