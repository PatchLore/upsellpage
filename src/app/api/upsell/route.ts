import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_name, price, headline, description, video_url, cta_text, cta_url } = body

    if (!product_name || !price || !headline || !description || !cta_text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = nanoid()

    const { data, error } = await supabase
      .from('upsells')
      .insert({
        slug,
        product_name: product_name.trim(),
        price: price.trim(),
        headline: headline.trim(),
        description: description.trim(),
        video_url: video_url?.trim() || null,
        cta_text: cta_text.trim(),
        cta_url: cta_url?.trim() || null,
      })
      .select('slug')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create upsell page' }, { status: 500 })
    }

    return NextResponse.json({ slug: data.slug }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
