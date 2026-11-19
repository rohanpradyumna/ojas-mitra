import type { MetadataRoute } from 'next'
import { JOURNAL } from '@/data/journal'
import { PRODUCTS } from '@/data/products'
import { SITE } from '@/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/shelf', '/our-way', '/journal'].map((path) => ({
    url: `${SITE.url}${path}`,
  }))
  const products = PRODUCTS.map((p) => ({ url: `${SITE.url}/products/${p.slug}` }))
  const entries = JOURNAL.map((e) => ({
    url: `${SITE.url}/journal/${e.slug}`,
    lastModified: e.date,
  }))
  return [...pages, ...products, ...entries]
}
