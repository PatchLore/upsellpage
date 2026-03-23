import { supabase, Upsell } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
  } catch {}
  return null
}

export default async function UpsellPage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('upsells')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !data) notFound()

  const upsell = data as Upsell
  const videoId = upsell.video_url ? getYouTubeId(upsell.video_url) : null
  const ctaHref = upsell.cta_url || '#'

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg">

        {/* Headline */}
        <div className="text-center mb-8 animate-fade-up">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">
            Special One-Time Offer
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight mb-2">
            {upsell.headline}
          </h1>
        </div>

        {/* Video */}
        {videoId && (
          <div className="mb-8 animate-fade-up rounded-2xl overflow-hidden shadow-lg" style={{ animationDelay: '0.1s' }}>
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Offer Card */}
        <div
          className="bg-white border-2 border-zinc-100 rounded-2xl p-7 shadow-sm mb-6 animate-fade-up"
          style={{ animationDelay: '0.15s' }}
        >
          {/* Product + Price */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">You&apos;re getting</p>
              <h2 className="text-xl font-bold text-zinc-900">{upsell.product_name}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Just</p>
              <p className="text-2xl font-bold text-emerald-600">{upsell.price}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100 my-5" />

          {/* Description */}
          <p className="text-zinc-600 text-base leading-relaxed whitespace-pre-wrap">
            {upsell.description}
          </p>
        </div>

        {/* CTA */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <a
            href={ctaHref}
            className="block w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white text-center font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-150"
          >
            {upsell.cta_text} →
          </a>

          <div className="text-center mt-4">
            <button
              className="text-zinc-400 hover:text-zinc-600 text-sm transition-colors underline-offset-2 hover:underline"
            >
              No thanks, I&apos;ll pass on this offer
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-10 animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <TrustBadge icon="🔒" label="Secure checkout" />
          <TrustBadge icon="⚡" label="Instant access" />
          <TrustBadge icon="✓" label="One-time offer" />
        </div>
      </div>

      {/* Powered by footer */}
      <div className="mt-16 text-center">
        <Link href="/" className="text-xs text-zinc-300 hover:text-zinc-500 transition-colors">
          Powered by Upsell Builder
        </Link>
      </div>
    </div>
  )
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-base">{icon}</span>
      <span className="text-xs text-zinc-400">{label}</span>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data } = await supabase
    .from('upsells')
    .select('product_name, headline')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Upsell Page' }
  return {
    title: `${data.product_name} — Special Offer`,
    description: data.headline,
  }
}
