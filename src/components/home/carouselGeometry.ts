/**
 * Pure geometry for the home carousel. A bottle's place on the loop is `u` in [0, 1);
 * u = 0.5 is centre stage. Everything about how it looks there — position, tilt, size —
 * is derived from that one number, so the loop can run forever without state drift.
 */

export interface Viewport {
  width: number
  height: number
  compact: boolean
}

export interface Pose {
  /** Centre of the bottle, px. */
  x: number
  y: number
  /** Degrees, clockwise. */
  rotation: number
  scale: number
  /** 0 at centre stage, rising towards the edges — used for focus blur. */
  depth: number
}

/** How many viewport widths one full trip round the loop covers. */
export function loopSpan(vp: Viewport): number {
  return vp.compact ? 2.4 : 1.55
}

const TILT_RIGHT = 45 // degrees, as a bottle enters on the right
const TILT_LEFT = -30 // degrees, as it leaves on the left

export function poseOnLoop(u: number, vp: Viewport): Pose {
  const span = loopSpan(vp)
  const x = (-(span - 1) / 2 + u * span) * vp.width
  const n = (x - vp.width / 2) / (vp.width / 2) // -1 left edge … 0 centre … 1 right edge
  const depth = Math.min(Math.abs(n), 1.25)
  return {
    x,
    y:
      vp.height * (vp.compact ? 0.6 : 0.56) +
      n * vp.height * 0.035 -
      depth * depth * vp.height * 0.03,
    rotation: n >= 0 ? TILT_RIGHT * Math.min(n, 1.2) : TILT_LEFT * Math.min(-n, 1.2),
    scale: (vp.compact ? 1.05 : 1.12) - depth * 0.36,
    depth,
  }
}

/** Loop position of bottle `index` of `count` when the loop has turned by `offset`. */
export function loopPosition(index: number, count: number, offset: number): number {
  const u = index / count - offset + 0.5
  return u - Math.floor(u)
}

/** The loop offset that puts bottle `index` at centre stage, nearest to `from`. */
export function offsetToCentre(index: number, count: number, from: number): number {
  const target = index / count
  const delta = target - from + 0.5
  return from + (delta - Math.floor(delta)) - 0.5
}
