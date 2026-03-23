import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CTAButton } from './cta-button'

export const dynamic = 'force-dynamic'

interface UpsellPageProps {
  params: Promise<{ slug: string }>
}

async function getUpsell(slug: string) {
  const { data, error } = await supabase
    .from('upsells')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function generateMetadata({ params }: UpsellPageProps): Promise<Metadata> {
  const { slug } = await params
  const upsell = await getUpsell(slug)
  
  if (!upsell) {
    return {
      title: 'Offer Not Found'
    }
  }
  
  return {
    title: upsell.headline,
    description: upsell.description
  }
}

export default async function UpsellPage({ params }: UpsellPageProps) {
  const { slug } = await params
  const upsell = await getUpsell(slug)
  
  // DEBUG: Log what we got from database
  console.log('Upsell data:', upsell)
  console.log('CTA URL:', upsell?.cta_url)
  console.log('CTA Text:', upsell?.cta_text)
  
  if (!upsell) {
    notFound()
  }
  
  const videoId = upsell.video_url ? extractYouTubeId(upsell.video_url) : null
  const checkoutUrl = upsell.cta_url && upsell.cta_url.trim() !== '' 
    ? upsell.cta_url 
    : '#'
  
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            {upsell.headline}
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            {upsell.product_name}
          </p>
          
          <p className="text-3xl font-semibold text-emerald-600 mb-8">
            ${upsell.price}
          </p>
        </div>
        
        {videoId && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Product video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
        
        <div className="prose prose-lg mx-auto text-gray-600 mb-8">
          <p>{upsell.description}</p>
        </div>
        
        <div className="text-center">
          <CTAButton 
            checkoutUrl={checkoutUrl}
            ctaText={upsell.cta_text}
            ctaUrl={upsell.cta_url}
          />
        </div>
      </div>
    </main>
  )
}