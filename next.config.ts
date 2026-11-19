import type { NextConfig } from 'next'
import { JOURNAL_SLUGS } from './src/data/journal'
import { PRODUCT_SLUGS } from './src/data/products'

// The site used to be flat .html files; keep every old link working.
const legacyRedirects = [
  { source: '/index.html', destination: '/' },
  { source: '/shelf.html', destination: '/shelf' },
  { source: '/our-way.html', destination: '/our-way' },
  { source: '/journal.html', destination: '/journal' },
  ...PRODUCT_SLUGS.map((slug) => ({
    source: `/product-${slug}.html`,
    destination: `/products/${slug}`,
  })),
  ...JOURNAL_SLUGS.map((slug) => ({
    source: `/journal-${slug}.html`,
    destination: `/journal/${slug}`,
  })),
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return legacyRedirects.map((r) => ({ ...r, permanent: true }))
  },
}

export default nextConfig
