import { randomBetween } from '@/lib/math'

export interface Spot {
  /** Left / top of the fruit as a percentage of the tile. */
  left: number
  top: number
  /** Width as a percentage of the tile width. */
  size: number
  rotation: number
}

interface Options {
  count: number
  /** Tile height ÷ width, so sizes in % of width can be compared with % of height. */
  aspect: number
  /** The middle band, in % of the tile, kept clear for the bottle. */
  keepClear?: { left: number; right: number; top: number; bottom: number }
}

const DEFAULT_CLEAR = { left: 30, right: 70, top: 6, bottom: 84 }

/** Random, non-overlapping spots around the edges of a tile, leaving the bottle visible. */
export function scatter({ count, aspect, keepClear = DEFAULT_CLEAR }: Options): Spot[] {
  const spots: Spot[] = []
  for (let attempt = 0; spots.length < count && attempt < count * 40; attempt++) {
    const size = randomBetween(17, 25)
    const heightPct = size / aspect
    const left = randomBetween(-3, 100 - size + 3)
    const top = randomBetween(-2, 90 - heightPct)
    const cx = left + size / 2
    const cy = top + heightPct / 2

    const overBottle =
      cx > keepClear.left && cx < keepClear.right && cy > keepClear.top && cy < keepClear.bottom
    const crowded = spots.some((s) => {
      const dx = s.left + s.size / 2 - cx
      const dy = (s.top + s.size / aspect / 2 - cy) * aspect
      return Math.hypot(dx, dy) < (s.size + size) * 0.55
    })
    if (overBottle || crowded) continue
    spots.push({ left, top, size, rotation: randomBetween(-35, 35) })
  }
  return spots
}
