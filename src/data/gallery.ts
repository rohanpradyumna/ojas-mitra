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

/** A product's own photographs, shown first in its gallery. Add more products here as photos arrive. */
const PRODUCT_PHOTOS: Partial<Record<ProductSlug, readonly GalleryImage[]>> = {
  'laundry-liquid': [
    {
      src: '/images/gallery/laundry-liquid/bench.webp',
      alt: 'The laundry liquid on a wooden bench beside a basket of folded cotton, lemons and a cut pineapple',
      width: 1047,
      height: 1300,
    },
    {
      src: '/images/gallery/laundry-liquid/line.webp',
      alt: 'The laundry liquid on a stone under white sheets drying on the line, with lemons and pineapple',
      width: 1047,
      height: 1300,
    },
    {
      src: '/images/gallery/laundry-liquid/terrace.webp',
      alt: 'The laundry liquid on a terracotta parapet beside lemons and a pineapple, washing drying behind',
      width: 1047,
      height: 1300,
    },
    {
      src: '/images/gallery/laundry-liquid/window.webp',
      alt: 'The laundry liquid by a window with folded towels, a steel cup, a lemon and cut pineapple',
      width: 1047,
      height: 1300,
    },
    {
      src: '/images/gallery/laundry-liquid/towel.webp',
      alt: 'The laundry liquid standing on a folded white towel with lemon and pineapple slices',
      width: 1047,
      height: 1300,
    },
  ],
}

/** Photographs from around the house, shown for every product after its own. */
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

/**
 * Gallery for a product page: its own photographs, then its poster, then the house
 * photographs, then the other products' posters.
 */
export function galleryFor(slug: ProductSlug): GalleryImage[] {
  const others = PRODUCTS.filter((p) => p.slug !== slug).map((p) => posterFor(p.slug))
  return [...(PRODUCT_PHOTOS[slug] ?? []), posterFor(slug), ...LIFESTYLE, ...others]
}
