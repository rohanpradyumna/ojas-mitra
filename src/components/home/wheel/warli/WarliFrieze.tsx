import type { ReactNode } from 'react'
import { BAND, onRing } from '../geometry'
import {
  Basket,
  Bird,
  Bottle,
  Bullock,
  Cart,
  Cloth,
  Hut,
  Moon,
  Peels,
  Person,
  Pot,
  Stick,
  Sun,
  Tree,
} from './figures'

/**
 * The making of a bottle, painted round the rim in twelve scenes. Each element sits at
 * an x offset (along the rim) and an optional lift (above the ground line); it is placed
 * on the circle individually, so every figure stands on the curved band.
 */
interface Element {
  x: number
  lift?: number
  /** Overrides FIGURE_SCALE — trees stay smaller so they clear the border. */
  scale?: number
  node: ReactNode
}

/** Figures are drawn about 85 units tall; this sizes them to the painted band. */
const FIGURE_SCALE = 1.15

interface Scene {
  name: string
  elements: Element[]
}

const STORY: Scene[] = [
  {
    name: 'Picking the fruit',
    elements: [
      { x: -58, scale: 1, node: <Tree /> },
      { x: 4, node: <Person pose="reach" woman flip /> },
      { x: 56, node: <Basket full /> },
    ],
  },
  {
    name: 'Bringing it home',
    elements: [
      { x: -34, node: <Person pose="carry" woman /> },
      { x: -34, lift: 86, node: <Basket full /> },
      { x: 34, node: <Person pose="walk" /> },
    ],
  },
  {
    name: 'Peeling',
    elements: [
      { x: -38, node: <Person pose="crouch" woman /> },
      { x: 8, node: <Peels /> },
      { x: 52, node: <Basket /> },
    ],
  },
  {
    name: 'Jaggery into the matka',
    elements: [
      { x: -30, node: <Person pose="pour" /> },
      {
        x: 4,
        lift: 60,
        node: (
          <g transform="rotate(70)">
            <Pot scale={0.45} />
          </g>
        ),
      },
      { x: 42, node: <Pot /> },
    ],
  },
  {
    name: 'Water from the well',
    elements: [
      { x: -32, node: <Person pose="carry" woman /> },
      { x: -32, lift: 90, node: <Pot scale={0.5} /> },
      { x: 38, node: <Pot /> },
    ],
  },
  {
    name: 'Ninety days in the shade',
    elements: [
      { x: -64, node: <Pot scale={0.9} /> },
      { x: 0, node: <Pot scale={0.9} /> },
      { x: 64, node: <Pot scale={0.9} /> },
      { x: -40, lift: 86, node: <Sun /> },
      { x: 40, lift: 86, node: <Moon /> },
    ],
  },
  {
    name: 'Stirring once a week',
    elements: [
      { x: -28, node: <Person pose="stir" /> },
      { x: -28, node: <Stick /> },
      { x: 30, node: <Pot /> },
    ],
  },
  {
    name: 'Straining',
    elements: [
      { x: -46, node: <Person pose="hold" woman /> },
      { x: 46, node: <Person pose="hold" woman flip /> },
      { x: 0, node: <Cloth /> },
      { x: 0, node: <Pot scale={0.7} /> },
    ],
  },
  {
    name: 'Filling the bottles',
    elements: [
      { x: -48, node: <Person pose="crouch" woman /> },
      { x: 2, node: <Bottle /> },
      { x: 24, node: <Bottle /> },
      { x: 46, node: <Bottle /> },
    ],
  },
  {
    name: 'On the cart',
    elements: [
      { x: -54, node: <Cart /> },
      { x: 30, node: <Bullock /> },
    ],
  },
  {
    name: 'To your door',
    elements: [
      { x: -44, node: <Person pose="walk" /> },
      {
        x: -44,
        lift: 0,
        node: (
          <g transform="translate(26 -66) scale(0.8)">
            <Bottle />
          </g>
        ),
      },
      { x: 40, node: <Hut /> },
    ],
  },
  {
    name: 'A clean home',
    elements: [
      { x: -56, scale: 1, node: <Tree fruit={false} /> },
      { x: -4, node: <Person pose="dance" woman /> },
      { x: 52, node: <Person pose="dance" /> },
    ],
  },
]

const SCENE_SPAN = 360 / STORY.length

/**
 * Scenes run anticlockwise from twelve o'clock: the wheel turns clockwise as you
 * scroll, so each next chapter of the story rises into view from the left.
 */
export function WarliFrieze() {
  return (
    <g className="warli">
      {STORY.map((scene, i) => {
        const centre = -i * SCENE_SPAN
        return (
          <g key={scene.name} aria-label={scene.name}>
            {scene.elements.map((el, j) => {
              const scale = el.scale ?? FIGURE_SCALE
              const radius = BAND.baseline + (el.lift ?? 0) * scale
              const deg = centre + ((el.x * scale) / BAND.baseline) * (180 / Math.PI)
              return (
                <g key={j} transform={`${onRing(radius, deg)} scale(${scale})`}>
                  {el.node}
                </g>
              )
            })}
          </g>
        )
      })}
      {/* Birds in the sky between scenes. */}
      {STORY.map((_, i) => {
        const deg = -(i + 0.5) * SCENE_SPAN
        const lift = i % 2 ? 98 : 84
        return (
          <g key={`bird${i}`} transform={onRing(BAND.baseline + lift, deg)}>
            <Bird flip={i % 3 === 0} />
          </g>
        )
      })}
    </g>
  )
}
