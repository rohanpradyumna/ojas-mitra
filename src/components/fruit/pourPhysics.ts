/**
 * Fruit poured into a jar, seen from the side: balls under gravity, knocking into each
 * other and the glass, settling into a heap. Verlet integration with position-based
 * collisions — no velocities stored, so it stays stable at any frame rate.
 * Pure data in, data out; the component does the drawing.
 */

export interface Fruit {
  x: number
  y: number
  /** Position one step ago; velocity is implied by x − px. */
  px: number
  py: number
  r: number
  /** Degrees. */
  angle: number
  /** Degrees per step. */
  spin: number
}

export interface Jar {
  width: number
  height: number
  /** With the floor open, fruit falls straight through and out of the bottom. */
  open: boolean
}

/** Fixed simulation step: 120 Hz keeps stacking stable without being costly. */
export const STEP = 1 / 120
const ITERATIONS = 3
const AIR = 0.996
const BOUNCE = 0.28
const FLOOR_GRIP = 0.82
const SPIN_DAMP = 0.97

/** Gravity in px/s², scaled so a fall looks the same in a small tile and a large one. */
export const gravityFor = (jar: Jar): number => 2600 * (jar.height / 450)

/** A fruit entering at the top of the jar, already moving down like a poured stream. */
export function dropIn(jar: Jar, r: number, spread: number): Fruit {
  const x = jar.width * (0.5 + (Math.random() * 2 - 1) * spread)
  const y = -r * (1.2 + Math.random() * 0.8)
  const vx = (Math.random() * 2 - 1) * 60 * STEP
  const vy = 300 * (jar.height / 450) * STEP
  return {
    x,
    y,
    px: x - vx,
    py: y - vy,
    r,
    angle: Math.random() * 360,
    spin: (Math.random() * 2 - 1) * 6,
  }
}

/** Advance the jar by one fixed step. */
export function step(fruits: Fruit[], jar: Jar): void {
  const g = gravityFor(jar) * STEP * STEP
  const floor = jar.height

  for (const f of fruits) {
    const vx = (f.x - f.px) * AIR
    const vy = (f.y - f.py) * AIR
    f.px = f.x
    f.py = f.y
    f.x += vx
    f.y += vy + g
  }

  const touching = new Set<Fruit>()
  for (let it = 0; it < ITERATIONS; it++) {
    for (let i = 0; i < fruits.length; i++) {
      const a = fruits[i]!
      for (let j = i + 1; j < fruits.length; j++) {
        const b = fruits[j]!
        const dx = b.x - a.x
        const dy = b.y - a.y
        const min = a.r + b.r
        const d2 = dx * dx + dy * dy
        if (d2 >= min * min || d2 === 0) continue
        const d = Math.sqrt(d2)
        const push = (min - d) / 2
        const nx = dx / d
        const ny = dy / d
        a.x -= nx * push
        a.y -= ny * push
        b.x += nx * push
        b.y += ny * push
        touching.add(a).add(b)
      }
    }

    for (const f of fruits) {
      // The glass walls.
      if (f.x < f.r) {
        const vx = f.x - f.px
        f.x = f.r
        f.px = f.x + vx * BOUNCE
      } else if (f.x > jar.width - f.r) {
        const vx = f.x - f.px
        f.x = jar.width - f.r
        f.px = f.x + vx * BOUNCE
      }
      // The floor, unless the jar has been emptied.
      if (!jar.open && f.y > floor - f.r) {
        const vy = f.y - f.py
        f.y = floor - f.r
        f.py = f.y + vy * BOUNCE
        f.px = f.x - (f.x - f.px) * FLOOR_GRIP
        touching.add(f)
      }
    }
  }

  // In the air a fruit keeps its tumble; in contact it rolls with its sideways motion.
  for (const f of fruits) {
    const rolling = ((f.x - f.px) / f.r) * (180 / Math.PI)
    f.spin = touching.has(f)
      ? f.spin + (rolling - f.spin) * 0.35
      : f.spin * SPIN_DAMP + rolling * 0.02
    f.angle += f.spin
  }
}

/** True when nothing in the jar is visibly moving any more. */
export function isSettled(fruits: Fruit[]): boolean {
  return fruits.every(
    (f) => Math.abs(f.x - f.px) < 0.02 && Math.abs(f.y - f.py) < 0.02 && Math.abs(f.spin) < 0.05,
  )
}

/** How many fruit of radius `r` fill the jar to `fill` of its height, packed loosely. */
export function fruitToFill(jar: Jar, r: number, fill: number): number {
  const packing = 0.78
  return Math.round((jar.width * jar.height * fill * packing) / (Math.PI * r * r))
}
