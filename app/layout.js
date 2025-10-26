import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mod-Panel 🛡️',
  description: 'Modernes Next.js Moderations-Panel mit Vercel KV und Server Actions.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
