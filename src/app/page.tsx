'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DEFAULT_HEADLINE = 'Wait! Before you go…'
const DEFAULT_CTA = 'Yes, Add This Now'

function isValidYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return (u.hostname.includes('youtube.com') && u.searchParams.has('v')) ||
           (u.hostname === 'youtu.be' && u.pathname.length > 1)
  } catch {
    return false
  }
}

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    product_name: '',
    price: '',
    headline: DEFAULT_HEADLINE,
    description: '',
    video_url: '',
    cta_text: DEFAULT_CTA,
    cta_url: '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.product_name.trim()) e.product_name = 'Required'
    if (!form.price.trim()) e.price = 'Required'
    if (!form.headline.trim()) e.headline = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    if (!form.cta_text.trim()) e.cta_text = 'Required'
    if (form.video_url && !isValidYouTubeUrl(form.video_url)) {
      e.video_url = 'Must be a valid YouTube URL'
    }
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res = await fetch('/api/upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      router.push(`/success?slug=${data.slug}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setErrors({ _global: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9.5 5.5H13L9.5 8.5L11 13L7 10.5L3 13L4.5 8.5L1 5.5H4.5L7 1Z" fill="white"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Upsell Builder</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10 animate-fade-up">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Create your upsell page
          </h1>
          <p className="text-zinc-400 text-base">
            Fill in the details below and get a shareable link in seconds.
          </p>
        </div>

        {errors._global && (
          <div className="mb-6 bg-red-950 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
            {errors._global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Row: Product + Price */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name" error={errors.product_name} required>
              <input
                type="text"
                placeholder="e.g. Premium Course Access"
                value={form.product_name}
                onChange={e => set('product_name', e.target.value)}
                className={inputClass(!!errors.product_name)}
              />
            </Field>
            <Field label="Price" error={errors.price} required>
              <input
                type="text"
                placeholder="e.g. £29 or $9/mo"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                className={inputClass(!!errors.price)}
              />
            </Field>
          </div>

          {/* Headline */}
          <Field label="Headline" error={errors.headline} required hint="Shown at the top of your upsell page">
            <input
              type="text"
              value={form.headline}
              onChange={e => set('headline', e.target.value)}
              className={inputClass(!!errors.headline)}
            />
          </Field>

          {/* Description */}
          <Field label="Description" error={errors.description} required hint="What does the buyer get? Be specific.">
            <textarea
              rows={4}
              placeholder="Describe the value they'll get — features, outcomes, bonuses..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className={inputClass(!!errors.description) + ' resize-none'}
            />
          </Field>

          {/* Video URL */}
          <Field label="YouTube Video URL" error={errors.video_url} hint="Optional — embed a demo or pitch video">
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={form.video_url}
              onChange={e => set('video_url', e.target.value)}
              className={inputClass(!!errors.video_url)}
            />
          </Field>

          {/* Divider */}
          <div className="border-t border-zinc-800 pt-2">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Call to Action</p>
          </div>

          {/* CTA Row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Button Text" error={errors.cta_text} required>
              <input
                type="text"
                value={form.cta_text}
                onChange={e => set('cta_text', e.target.value)}
                className={inputClass(!!errors.cta_text)}
              />
            </Field>
            <Field label="Button URL" hint="Where should the button go?">
              <input
                type="url"
                placeholder="https://your-checkout-link.com"
                value={form.cta_url}
                onChange={e => set('cta_url', e.target.value)}
                className={inputClass(false)}
              />
            </Field>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base py-3.5 rounded-xl transition-all duration-150 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Generating your page…
                </span>
              ) : (
                'Generate Upsell Page →'
              )}
            </button>
            <p className="text-center text-zinc-500 text-xs mt-3">
              No account needed. Your link is ready instantly.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

function inputClass(hasError: boolean) {
  return [
    'w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600',
    'focus:outline-none focus:ring-2 transition-all duration-150',
    hasError
      ? 'border-red-700 focus:ring-red-800'
      : 'border-zinc-800 focus:border-zinc-700 focus:ring-zinc-800',
  ].join(' ')
}

function Field({
  label, children, error, hint, required,
}: {
  label: string
  children: React.ReactNode
  error?: string
  hint?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">
        {label}
        {required && <span className="text-emerald-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}
