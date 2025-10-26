export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-accent-green/20 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-accent-green font-semibold">
            © 2025 Moderations Panel von Developer Joel Z.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Alle Rechte vorbehalten. | Version 2.0.0
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="text-gray-500 text-sm">🔒 Sichere Plattform</span>
            <span className="text-gray-500 text-sm">⚡ Schnelle Performance</span>
            <span className="text-gray-500 text-sm">🎨 Modernes Design</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
