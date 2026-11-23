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

/** A product's own photographs. When a product has these, its gallery shows only them. */
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

/** Photographs from around the house, for products that don't have their own yet. */
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
 * Gallery for a product page. A product with its own photographs shows only those;
 * until it has some, it shows its poster, the house photographs and the other posters.
 */
export function galleryFor(slug: ProductSlug): GalleryImage[] {
  const photos = PRODUCT_PHOTOS[slug]
  if (photos?.length) return [...photos]
  const others = PRODUCTS.filter((p) => p.slug !== slug).map((p) => posterFor(p.slug))
  return [posterFor(slug), ...LIFESTYLE, ...others]
}
