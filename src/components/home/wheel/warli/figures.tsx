/**
 * Warli figures for the wheel frieze, drawn in local coordinates: origin at the
 * figure's feet, "up" is −y. They follow the house rules in CLAUDE.md — people are
 * two solid triangles tip-to-tip with a plain round head (women carry a bun), trees
 * are two stacked cones with an apex dot, animals an outlined oval with a solid head
 * and four stick legs, pots the matka shape with a belly stripe.
 * Colours come from the parent: `currentColor` paints, `var(--wheel-wood)` cuts.
 */

const LIMB = {
  stroke: 'currentColor',
  strokeWidth: 3.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const

export type Pose =
  'stand' | 'walk' | 'reach' | 'carry' | 'pour' | 'stir' | 'crouch' | 'dance' | 'hold'

interface PoseShape {
  arms: [string, string]
  legs: [string, string]
  /** Lowers the whole body, for crouching. */
  drop?: number
}

// Shoulders at (±12, −61); hips at (±6, −24).
const POSES: Record<Pose, PoseShape> = {
  stand: {
    arms: ['-12,-61 -19,-46 -14,-33', '12,-61 19,-46 14,-33'],
    legs: ['-6,-24 -10,0', '6,-24 10,0'],
  },
  walk: {
    arms: ['-12,-61 -22,-49 -27,-38', '12,-61 21,-51 28,-57'],
    legs: ['-6,-24 -13,-11 -19,0', '6,-24 9,-12 15,0'],
  },
  reach: {
    arms: ['-12,-61 -20,-48 -11,-40', '12,-61 22,-80 30,-97'],
    legs: ['-6,-24 -13,0', '6,-24 13,0'],
  },
  carry: {
    arms: ['-12,-61 -19,-76 -10,-90', '12,-61 19,-76 10,-90'],
    legs: ['-6,-24 -13,-11 -17,0', '6,-24 9,-12 14,0'],
  },
  pour: {
    arms: ['-12,-61 6,-52 30,-60', '12,-61 25,-62 34,-70'],
    legs: ['-6,-24 -12,0', '6,-24 12,0'],
  },
  stir: {
    arms: ['-12,-61 8,-50 24,-50', '12,-61 22,-55 28,-60'],
    legs: ['-6,-24 -13,0', '6,-24 11,0'],
  },
  // Drawn in the lowered frame: feet land on y = −drop, i.e. the ground.
  crouch: {
    arms: ['-12,-61 4,-46 22,-38', '12,-61 24,-50 30,-40'],
    legs: ['-6,-24 -22,-22 -14,-14', '6,-24 18,-32 24,-14'],
    drop: 14,
  },
  dance: {
    arms: ['-12,-61 -24,-55 -36,-60', '12,-61 24,-55 36,-60'],
    legs: ['-6,-24 -16,-10 -12,0', '6,-24 15,-12 20,-2'],
  },
  hold: {
    arms: ['-12,-61 4,-58 22,-64', '12,-61 22,-66 30,-72'],
    legs: ['-6,-24 -11,0', '6,-24 11,0'],
  },
}

interface PersonProps {
  pose?: Pose
  woman?: boolean
  /** Face left instead of right. */
  flip?: boolean
}

export function Person({ pose = 'stand', woman = false, flip = false }: PersonProps) {
  const shape = POSES[pose]
  const drop = shape.drop ?? 0
  return (
    <g transform={`${flip ? 'scale(-1 1) ' : ''}translate(0 ${drop})`}>
      <circle cx="0" cy="-73" r="8" fill="currentColor" />
      {woman && (
        <>
          <line x1="0" y1="-81" x2="0" y2="-85" {...LIMB} strokeWidth={2.4} />
          <circle cx="0" cy="-88" r="3.4" fill="currentColor" />
        </>
      )}
      <polygon points="-13,-63 13,-63 0,-41" fill="currentColor" />
      <polygon points="0,-41 -11,-23 11,-23" fill="currentColor" />
      {shape.arms.map((points) => (
        <polyline key={points} points={points} {...LIMB} />
      ))}
      {shape.legs.map((points) => (
        <polyline key={points} points={points} {...LIMB} />
      ))}
    </g>
  )
}

/** Two stacked cones with an apex dot and bud dots at the corners, hung with fruit. */
export function Tree({ fruit = true }: { fruit?: boolean }) {
  return (
    <g>
      <line x1="0" y1="-20" x2="0" y2="0" {...LIMB} strokeWidth={4} />
      <polygon points="0,-80 -36,-20 36,-20" {...LIMB} strokeWidth={3} />
      <polygon points="0,-108 -24,-62 24,-62" {...LIMB} strokeWidth={3} />
      <circle cx="0" cy="-108" r="3.4" fill="currentColor" />
      {[
        [-36, -20],
        [36, -20],
        [-24, -62],
        [24, -62],
      ].map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="3.4" fill="currentColor" />
      ))}
      {fruit &&
        [
          [-12, -34],
          [10, -40],
          [-2, -52],
          [16, -28],
          [-6, -76],
          [7, -86],
        ].map(([x, y]) => <circle key={`f${x},${y}`} cx={x} cy={y} r="4.2" fill="currentColor" />)}
    </g>
  )
}

/** The matka: a wide belly, narrow neck, an ellipse rim and a stripe round the belly. */
export function Pot({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <path
        d="M -12,-44 Q -31,-40 -27,-20 Q -22,0 0,0 Q 22,0 27,-20 Q 31,-40 12,-44 Z"
        fill="currentColor"
      />
      <rect x="-9" y="-51" width="18" height="8" fill="currentColor" />
      <ellipse cx="0" cy="-52" rx="13" ry="3.6" fill="currentColor" />
      <path d="M -26,-24 Q 0,-17 26,-24" stroke="var(--wheel-wood)" strokeWidth="3" fill="none" />
    </g>
  )
}

/** A woven basket; `full` heaps fruit on top. */
export function Basket({ full = false }: { full?: boolean }) {
  return (
    <g>
      <path d="M -17,-24 L 17,-24 L 11,0 L -11,0 Z" {...LIMB} strokeWidth={2.8} />
      <path
        d="M -14,-16 L 14,-16 M -12,-8 L 12,-8 M -6,-24 L -4,0 M 6,-24 L 4,0"
        {...LIMB}
        strokeWidth={1.8}
      />
      {full &&
        [-10, 0, 10, -5, 5].map((x, i) => (
          <circle key={i} cx={x} cy={i < 3 ? -29 : -36} r="4.2" fill="currentColor" />
        ))}
    </g>
  )
}

/** A heap of peel and pulp, drawn as Warli grain-dots. */
export function Peels() {
  const dots = [
    [-16, -3],
    [-8, -3],
    [0, -3],
    [8, -3],
    [16, -3],
    [-12, -10],
    [-4, -10],
    [4, -10],
    [12, -10],
    [-8, -17],
    [0, -17],
    [8, -17],
    [-3, -24],
    [4, -24],
  ]
  return (
    <g>
      {dots.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="3" fill="currentColor" />
      ))}
    </g>
  )
}

export function Bottle() {
  return (
    <g>
      <path
        d="M -7,0 L -7,-22 Q -7,-28 -3,-30 L -3,-36 L 3,-36 L 3,-30 Q 7,-28 7,-22 L 7,0 Z"
        fill="currentColor"
      />
      <rect x="-4" y="-41" width="8" height="5" fill="currentColor" />
      <rect x="-5" y="-17" width="10" height="7" fill="var(--wheel-wood)" />
    </g>
  )
}

/** The sun, a disc with short rays — one of the time markers over the fermenting pots. */
export function Sun() {
  return (
    <g>
      <circle cx="0" cy="0" r="12" fill="currentColor" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="0"
          y1="-16"
          x2="0"
          y2="-23"
          {...LIMB}
          strokeWidth={2.4}
          transform={`rotate(${i * 30})`}
        />
      ))}
    </g>
  )
}

/** A crescent moon: two offset discs, the inner one in the wood colour (no masks). */
export function Moon() {
  return (
    <g>
      <circle cx="0" cy="0" r="13" fill="currentColor" />
      <circle cx="8" cy="-3" r="12" fill="var(--wheel-wood)" />
    </g>
  )
}

/** A bullock: outlined oval body, solid head, four stick legs, horns and a hump. */
export function Bullock() {
  return (
    <g>
      <ellipse cx="0" cy="-38" rx="32" ry="13" {...LIMB} strokeWidth={3} />
      <path d="M 10,-50 Q 16,-60 22,-50" fill="currentColor" />
      <circle cx="40" cy="-48" r="8.5" fill="currentColor" />
      <line x1="34" y1="-44" x2="30" y2="-40" {...LIMB} />
      <polyline points="38,-56 34,-66 40,-70" {...LIMB} strokeWidth={2.6} />
      <polyline points="44,-55 48,-65 54,-66" {...LIMB} strokeWidth={2.6} />
      {[-22, -12, 14, 24].map((x) => (
        <line key={x} x1={x} y1="-27" x2={x + (x < 0 ? -2 : 2)} y2="0" {...LIMB} />
      ))}
      <polyline points="-32,-40 -42,-30 -40,-18" {...LIMB} strokeWidth={2.4} />
    </g>
  )
}

/** A cart loaded with bottles; the yoke reaches forward (to the right) towards the bullock. */
export function Cart() {
  return (
    <g>
      <line x1="-34" y1="-30" x2="48" y2="-38" {...LIMB} />
      <rect x="-34" y="-46" width="52" height="16" {...LIMB} strokeWidth={2.8} />
      <path
        d="M -26,-46 L -26,-30 M -16,-46 L -16,-30 M -6,-46 L -6,-30 M 4,-46 L 4,-30"
        {...LIMB}
        strokeWidth={1.8}
      />
      {[-24, -12, 0, 12].map((x) => (
        <g key={x} transform={`translate(${x} -46) scale(0.55)`}>
          <Bottle />
        </g>
      ))}
      <circle cx="-8" cy="-17" r="16" {...LIMB} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1="-8"
          y1="-17"
          x2="-8"
          y2="-31"
          {...LIMB}
          strokeWidth={2}
          transform={`rotate(${i * 60} -8 -17)`}
        />
      ))}
      <circle cx="-8" cy="-17" r="3.5" fill="currentColor" />
    </g>
  )
}

/** A thatched hut, roof and walls hatched the way the paintings do it. */
export function Hut() {
  return (
    <g>
      <polygon points="0,-92 -40,-52 40,-52" {...LIMB} strokeWidth={3} />
      <path
        d="M -30,-52 L 0,-82 M -18,-52 L 0,-72 M 30,-52 L 0,-82 M 18,-52 L 0,-72 M -6,-52 L 6,-52"
        {...LIMB}
        strokeWidth={1.8}
      />
      <rect x="-30" y="-52" width="60" height="52" {...LIMB} strokeWidth={3} />
      <path
        d="M -24,-44 L -24,-6 M -16,-44 L -16,-6 M 16,-44 L 16,-6 M 24,-44 L 24,-6"
        {...LIMB}
        strokeWidth={1.8}
      />
      <rect x="-8" y="-30" width="16" height="30" fill="currentColor" />
    </g>
  )
}

/** A straining cloth stretched between two people, with drops falling through it. */
export function Cloth() {
  return (
    <g>
      <path d="M -26,-64 Q 0,-52 26,-64" {...LIMB} strokeWidth={3} />
      {[
        [-6, -50],
        [3, -44],
        [-2, -38],
        [5, -32],
      ].map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="2.4" fill="currentColor" />
      ))}
    </g>
  )
}

/** A long stirring stick, dipped into the pot in front of the stirrer. */
export function Stick() {
  return <line x1="28" y1="-62" x2="42" y2="-26" {...LIMB} strokeWidth={3} />
}

/** A bird in flight: a solid body and head, wings raised in a shallow V. */
export function Bird({ flip = false }: { flip?: boolean }) {
  return (
    <g transform={flip ? 'scale(-1 1)' : undefined}>
      <ellipse cx="0" cy="0" rx="9" ry="4.2" fill="currentColor" />
      <circle cx="10" cy="-3" r="3.2" fill="currentColor" />
      <polygon points="-8,0 -16,-5 -15,4" fill="currentColor" />
      <polyline points="-2,-2 -8,-13 -14,-15" {...LIMB} strokeWidth={2.6} />
      <polyline points="2,-2 4,-14 10,-18" {...LIMB} strokeWidth={2.6} />
    </g>
  )
}
