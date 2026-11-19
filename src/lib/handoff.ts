'use client'

/**
 * The carousel → product page hand-off. The carousel parks the chosen bottle at the
 * pose described by the --handoff-* CSS variables, notes the slug here, then navigates.
 * The product page starts its bottle in that same pose and skips its own entrance
 * when it finds the note, so the bottle appears not to move across the page change.
 */
const KEY = 'om:handoff'

export function noteHandoff(slug: string): void {
  try {
    sessionStorage.setItem(KEY, slug)
  } catch {
    /* storage unavailable — the product page will simply play its own entrance */
  }
}

// Effects can run twice for one arrival (React StrictMode in development), so the
// answer is remembered briefly rather than being lost on the first read.
let recent: { slug: string; arrived: boolean; at: number } | null = null

/** True if the visitor arrived at `slug` by choosing its bottle in the carousel. */
export function takeHandoff(slug: string): boolean {
  if (recent && recent.slug === slug && performance.now() - recent.at < 2000) return recent.arrived
  let arrived = false
  try {
    arrived = sessionStorage.getItem(KEY) === slug
    sessionStorage.removeItem(KEY)
  } catch {
    /* storage unavailable */
  }
  recent = { slug, arrived, at: performance.now() }
  return arrived
}

export interface HandoffPose {
  /** Top edge of the bottle, in px from the top of the viewport. */
  top: number
  scale: number
}

/** Reads the --handoff-* variables, resolved for the current viewport. */
export function readHandoffPose(): HandoffPose {
  const styles = getComputedStyle(document.documentElement)
  const topVh = parseFloat(styles.getPropertyValue('--handoff-top')) || 74
  const scale = parseFloat(styles.getPropertyValue('--handoff-scale')) || 1
  return { top: (topVh / 100) * window.innerHeight, scale }
}
