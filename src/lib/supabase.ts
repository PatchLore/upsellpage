import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Upsell = {
  id: string
  slug: string
  product_name: string
  price: string
  headline: string
  description: string
  video_url: string | null
  cta_text: string
  cta_url: string | null
  created_at: string
}
