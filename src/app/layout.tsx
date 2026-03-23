import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Upsell Page Builder',
  description: 'Create high-converting upsell pages in seconds',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white antialiased">{children}</body>
    </html>
  )
}
