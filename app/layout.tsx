import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anime Streaming - Watch Your Favorite Anime',
  description: 'Stream the latest anime series and movies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
