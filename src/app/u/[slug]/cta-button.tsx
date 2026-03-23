'use client'

interface CTAButtonProps {
  checkoutUrl: string
  ctaText: string | null
  ctaUrl: string | null
}

export function CTAButton({ checkoutUrl, ctaText, ctaUrl }: CTAButtonProps) {
  return (
    <a
      href={checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!ctaUrl || ctaUrl.trim() === '') {
          e.preventDefault()
          alert('Checkout link not configured')
        }
        console.log('Clicking URL:', ctaUrl)
      }}
      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors cursor-pointer"
    >
      {ctaText || "Yes, Add This Now"}
    </a>
  )
}
