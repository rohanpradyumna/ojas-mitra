'use client'

import { useEffect, useRef } from 'react'
import type { FruitKind } from '@/data/types'
import { gsap, useGSAP } from '@/lib/gsap'
import { Fruit, FRUIT_BODY } from './Fruit'
import {
  dropIn,
  fruitToFill,
  isSettled,
  step,
  STEP,
  type Fruit as Ball,
  type Jar,
} from './pourPhysics'
import styles from './FruitPour.module.css'

/** Most fruit drawn at once (the pool of silhouettes). */
const POOL = 28
/** Fruit radius as a share of the jar's width — medium-sized fruit. */
const RADIUS = 0.085
/** How far up the jar the heap should reach. */
const FILL = 0.42
/** Seconds between fruit, so they arrive as a stream rather than all at once. */
const POUR_GAP = 0.05
/** How wide the stream is, as a share of the jar's width either side of centre. */
const SPREAD = 0.2

interface Props {
  active: boolean
  kind: FruitKind
}

interface Controls {
  pour: () => void
  empty: () => void
}

/**
 * Silhouettes of one fruit poured into the tile as if into a glass jar seen from the
 * side: they fall, knock together, roll and settle into a heap behind the bottle. On
 * leaving, the jar's floor opens and they drop out of the bottom.
 */
export function FruitPour({ active, kind }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useRef<Controls | null>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const nodes = Array.from(root.children) as HTMLElement[]
      const body = FRUIT_BODY[kind]
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const jar: Jar = { width: 0, height: 0, open: false }
      let balls: Ball[] = []
      let toPour = 0
      let sinceDrop = 0
      let carry = 0
      let baseR = 0
      let size = 0
      let running = false

      const measure = () => {
        jar.width = root.clientWidth
        jar.height = root.clientHeight
        baseR = jar.width * RADIUS
        size = (baseR * 100) / body.r
        for (const el of nodes) {
          el.style.width = `${size}px`
          el.style.height = `${size}px`
          el.style.transformOrigin = `${body.cx}% ${body.cy}%`
        }
      }

      const draw = () => {
        nodes.forEach((el, i) => {
          const b = balls[i]
          if (!b) {
            el.style.opacity = '0'
            return
          }
          const x = b.x - (size * body.cx) / 100
          const y = b.y - (size * body.cy) / 100
          el.style.opacity = '1'
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${b.angle.toFixed(1)}deg) scale(${(b.r / baseR).toFixed(3)})`
        })
      }

      const newFruit = () => dropIn(jar, baseR * (0.92 + Math.random() * 0.16), SPREAD)

      const tick = (_time: number, deltaMs: number) => {
        carry += Math.min(deltaMs, 50) / 1000
        while (carry >= STEP) {
          carry -= STEP
          if (toPour > 0 && !jar.open) {
            sinceDrop += STEP
            if (sinceDrop >= POUR_GAP) {
              sinceDrop = 0
              toPour--
              balls.push(newFruit())
            }
          }
          step(balls, jar)
        }
        // Fruit that has dropped out of the bottom (crowns included) is done with.
        if (jar.open) balls = balls.filter((b) => b.y - b.r * 1.8 < jar.height)
        draw()
        if ((toPour === 0 && isSettled(balls)) || balls.length === 0) stop()
      }

      const start = () => {
        if (running) return
        running = true
        carry = 0
        gsap.ticker.add(tick)
      }
      const stop = () => {
        if (!running) return
        running = false
        gsap.ticker.remove(tick)
      }

      controls.current = {
        pour() {
          measure()
          jar.open = false
          balls = balls.filter((b) => b.y - b.r < jar.height)
          toPour = Math.max(0, Math.min(POOL, fruitToFill(jar, baseR, FILL)) - balls.length)
          sinceDrop = POUR_GAP
          if (reduced) {
            // No falling: settle the heap out of sight and show it as it lies.
            while (toPour > 0) {
              toPour--
              balls.push(newFruit())
            }
            for (let i = 0; i < 2400 && !(i > 240 && isSettled(balls)); i++) step(balls, jar)
            draw()
            return
          }
          start()
        },
        empty() {
          toPour = 0
          if (balls.length === 0) return
          if (reduced) {
            balls = []
            draw()
            return
          }
          jar.open = true
          start()
        },
      }

      return () => {
        stop()
        controls.current = null
      }
    },
    { scope: ref, dependencies: [kind] },
  )

  useEffect(() => {
    if (active) controls.current?.pour()
    else controls.current?.empty()
  }, [active])

  return (
    <div ref={ref} className={styles.pour} aria-hidden="true">
      {Array.from({ length: POOL }, (_, i) => (
        <span key={i} className={styles.fruit}>
          <Fruit kind={kind} silhouette />
        </span>
      ))}
    </div>
  )
}
