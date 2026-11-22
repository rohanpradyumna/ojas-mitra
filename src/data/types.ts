export type ProductSlug =
  | 'dishwash'
  | 'handwash'
  | 'toilet-cleaner'
  | 'floor-cleaner'
  | 'vegetables-fruits'
  | 'laundry-liquid'
  | 'kumkumadhi-tailam'

export type ProductFamily = 'bio-enzyme' | 'ayurvedic'

/** Fruit drawn as silhouettes (the peels the bio-enzymes are fermented from). */
export type FruitKind = 'lemon' | 'pineapple' | 'apple' | 'orange'

export interface BottleImage {
  src: string
  width: number
  height: number
  /** Photographs are cut-outs; illustrations are the Warli-labelled SVGs. */
  kind: 'photo' | 'illustration'
}

export interface Product {
  slug: ProductSlug
  name: string
  /** The product title as set on the reveal page, one or two lines. */
  titleLines: readonly [string] | readonly [string, string]
  family: ProductFamily
  kicker: string
  deva: string
  /** Two short notes, used on tiles (e.g. "neem · lemon"). */
  tagline: string
  sub: string
  metaDescription: string
  description: readonly string[]
  ingredients: readonly string[]
  note: string
  howTo: readonly string[]
  keeps: string
  bottle: BottleImage
  poster: string
  /** Background a tile takes on hover. */
  tint: string
  /** The fruit that pours into its tile on hover. */
  fruit: FruitKind
  /** The bottle's identity colour. */
  accent: string
}

export interface JournalBlock {
  type: 'paragraph' | 'heading'
  text: string
}

export interface JournalEntry {
  slug: string
  title: string
  /** ISO date, for <time dateTime>. */
  date: string
  displayDate: string
  season: string
  preview: string
  body: readonly JournalBlock[]
  signoff: string
}

export interface GalleryImage {
  src: string
  alt: string
  width: number
  height: number
}

/** The rim of the home-page cart wheel: painted text, a Warli frieze, or plain wood. */
export type WheelVariant = 'text' | 'warli' | 'plain'
