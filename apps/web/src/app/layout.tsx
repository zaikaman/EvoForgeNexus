import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EvoForge Nexus - Self-Genesis Multi-Agent Ecosystem',
  description: 'Revolutionary AI agents that evolve and spawn new intelligence on-the-fly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="crt-screen min-h-screen">
        {children}
      </body>
    </html>
  )
}
