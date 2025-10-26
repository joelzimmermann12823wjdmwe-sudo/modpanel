import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'

// Definiere die Schriftart
const inter = Inter({ subsets: ['latin'] })

// Metadaten für die App Router-Architektur
export const metadata = {
  title: 'Mod-Panel 🛡️',
  description: 'Modernes Next.js Moderations-Panel mit Vercel KV und Server Actions.',
}

// Dies ist das Root Layout (ersetzt _app.js und _document.js)
export default function RootLayout({ children }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ThemeProvider umschließt die gesamte Anwendung für den Dark Mode */}
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
