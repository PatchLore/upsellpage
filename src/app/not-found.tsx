import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-zinc-600 text-sm mb-3">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-zinc-400 text-sm mb-8">This upsell page doesn&apos;t exist or has been removed.</p>
      <Link
        href="/"
        className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
      >
        Create your own page
      </Link>
    </div>
  )
}
