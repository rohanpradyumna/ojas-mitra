/**
 * Bullock-cart wheel geometry, in a 1200 × 1200 viewBox centred on (600, 600).
 * Modelled on a traditional Indian cart wheel: an iron tyre, a broad wooden rim
 * (the felloe) built from bolted segments, fourteen tapered spokes and a heavy hub.
 */
import type { WheelVariant } from '@/data/types'

export const VIEWBOX = 1200
export const CENTRE = VIEWBOX / 2

export const TYRE_OUTER = 580
/** A thin gap between the iron tyre and the wooden rim. */
export const TYRE_GAP = 545

export const SPOKES = 14
export const HUB = 132

export const WHEEL_VARIANTS: readonly WheelVariant[] = ['text', 'warli', 'plain']

/** Inner edge of the wooden rim. The text and Warli wheels carry a broad painted band. */
export function rimInner(variant: WheelVariant): number {
  return variant === 'plain' ? 452 : 388
}

/** The painted band on the broad rim: two border lines and the space between them. */
export const BAND = { inner: 400, outer: 536, baseline: 410, text: 468 } as const

export interface Point {
  x: number
  y: number
}

/** A point at `radius` from the centre, `deg` degrees clockwise from twelve o'clock. */
export function polar(radius: number, deg: number): Point {
  const rad = (deg * Math.PI) / 180
  return { x: CENTRE + radius * Math.sin(rad), y: CENTRE - radius * Math.cos(rad) }
}

/** A spoke as a tapered quadrilateral from the hub to just inside the rim. */
export function spokePoints(
  deg: number,
  from: number,
  to: number,
  wFrom: number,
  wTo: number,
): string {
  const corners = [
    [-wFrom / 2, from],
    [wFrom / 2, from],
    [wTo / 2, to],
    [-wTo / 2, to],
  ] as const
  const rad = (deg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return corners
    .map(([t, r]) => {
      // t runs across the spoke, r along it (outwards from the centre).
      const x = CENTRE + t * cos + r * sin
      const y = CENTRE + t * sin - r * cos
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

/** The SVG transform that stands something on the rim at `deg`, its local "up" pointing outwards. */
export function onRing(radius: number, deg: number): string {
  return `rotate(${deg.toFixed(2)} ${CENTRE} ${CENTRE}) translate(${CENTRE} ${CENTRE - radius})`
}
