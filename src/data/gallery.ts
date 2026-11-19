import { PRODUCTS } from './products'
import type { GalleryImage, ProductSlug } from './types'

const POSTER_SIZES: Record<ProductSlug, [number, number]> = {
  dishwash: [900, 1200],
  handwash: [800, 1200],
  'toilet-cleaner': [900, 1200],
  'floor-cleaner': [900, 1200],
  'vegetables-fruits': [910, 1200],
  'laundry-liquid': [800, 1200],
  'kumkumadhi-tailam': [669, 1200],
}

/** Photographs from around the house. Replace with real product photography as it arrives. */
const LIFESTYLE: readonly GalleryImage[] = [
  {
    src: '/images/gallery/life-kitchen.webp',
    alt: 'A bottle on the kitchen counter beside a bowl of vegetables',
    width: 975,
    height: 1300,
  },
  {
    src: '/images/gallery/life-outdoor.webp',
    alt: 'The laundry liquid on a weathered wooden table outdoors',
    width: 975,
    height: 1300,
  },
  {
    src: '/images/gallery/life-studio.webp',
    alt: 'The laundry liquid in soft window light',
    width: 866,
    height: 1300,
  },
]

function posterFor(slug: ProductSlug): GalleryImage {
  const product = PRODUCTS.find((p) => p.slug === slug)
  const [width, height] = POSTER_SIZES[slug]
  return {
    src: `/images/gallery/${slug}.webp`,
    alt: `${product?.name ?? slug} poster`,
    width,
    height,
  }
}

/** Gallery for a product page: its own poster first, then the house photographs, then the rest. */
export function galleryFor(slug: ProductSlug): GalleryImage[] {
  const others = PRODUCTS.filter((p) => p.slug !== slug).map((p) => posterFor(p.slug))
  return [posterFor(slug), ...LIFESTYLE, ...others]
}
