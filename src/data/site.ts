import type { WheelVariant } from './types'

export const SITE = {
  name: 'Ojas Mithra',
  deva: 'ओजस मित्र',
  url: 'https://ojas-mitra.vercel.app',
  description:
    'A small house of bio-enzyme cleaning essentials and Ayurvedic preparations, made by hand in rural south India by Kavita Ajay.',
  place: 'Andhra Pradesh, India',
  whatsapp: { display: '+91 90599 00349', href: 'https://wa.me/919059900349' },
  instagram: { display: '@ojasmithra_ayurveda', href: 'https://instagram.com/ojasmithra_ayurveda' },
  email: 'hello@ojasmithra.com',
} as const

/**
 * Which cart wheel turns behind the bottles on the home page.
 * Any variant can be previewed with ?wheel=text | warli | plain.
 */
export const HOME_WHEEL: WheelVariant = 'warli'

export const NAV_LINKS = [
  { href: '/shelf', label: 'The shelf' },
  { href: '/our-way', label: 'Our way' },
  { href: '/journal', label: 'Journal' },
] as const

export const TESTIMONIALS = [
  {
    quote:
      'I opened the dishwash and the kitchen smelled of lemon and something older. My grandmother would have approved — she was a difficult woman to impress.',
    who: 'Lakshmi Reddy',
    where: 'a kitchen in Bengaluru',
  },
  {
    quote:
      'I switched from the chemical brand my mother had used for forty years. My hands stopped hurting after a month. I had been ignoring it for a long time.',
    who: 'Priya Anand',
    where: 'a flat in Hyderabad',
  },
  {
    quote:
      'The Kumkumadhi tailam arrived wrapped in a piece of cotton, with a handwritten note. It felt like a gift my aunt would have sent, not a delivery.',
    who: 'Rohit Mehta',
    where: 'a balcony in Pune',
  },
] as const
