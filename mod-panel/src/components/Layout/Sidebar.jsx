export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 h-screen p-4">
      <nav className="space-y-2">
        <a href="/" className="block py-2 px-4 bg-blue-100 text-blue-700 rounded font-medium">
          Dashboard
        </a>
        <a href="/history" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
          Aktionsverlauf
        </a>
        <a href="/users" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
          Benutzerverwaltung
        </a>
        <a href="/settings" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
          Einstellungen
        </a>
      </nav>
    </aside>
  )
}
