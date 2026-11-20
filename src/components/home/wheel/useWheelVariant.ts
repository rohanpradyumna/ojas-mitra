'use client'

import { useSyncExternalStore } from 'react'
import type { WheelVariant } from '@/data/types'
import { WHEEL_VARIANTS } from './geometry'

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

function fromUrl(): WheelVariant | null {
  const value = new URLSearchParams(window.location.search).get('wheel')
  return WHEEL_VARIANTS.find((v) => v === value) ?? null
}

/**
 * The wheel to draw: `?wheel=` in the address wins, so variants can be compared
 * on the live page; otherwise the site default. Read client-side so the page stays static.
 */
export function useWheelVariant(fallback: WheelVariant): WheelVariant {
  return useSyncExternalStore(
    subscribe,
    () => fromUrl() ?? fallback,
    () => fallback,
  )
}
