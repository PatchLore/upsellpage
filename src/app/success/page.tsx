'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const slug = params.get('slug')
  const [copied, setCopied] = useState(false)

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        No page found. <Link href="/" className="text-emerald-400 ml-2 underline">Go back</Link>
      </div>
    )
  }

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/u/${slug}`
    : `/u/${slug}`

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center animate-fade-up">
        {/* Check icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Your page is live!</h1>
        <p className="text-zinc-400 mb-8 text-sm">Share this link with your audience. It&apos;s ready right now.</p>

        {/* URL box */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
          <p className="text-emerald-400 text-sm font-mono break-all">{url}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={copy}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition-all duration-150 active:scale-[0.98] text-sm"
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
          <Link
            href={`/u/${slug}`}
            target="_blank"
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-xl transition-all duration-150 text-sm flex items-center justify-center gap-1.5"
          >
            Preview Page
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <Link href="/" className="block mt-6 text-zinc-500 hover:text-zinc-400 text-xs transition-colors">
          ← Create another page
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
