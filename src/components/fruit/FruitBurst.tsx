'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { Fruit, type FruitKind } from './Fruit'
import { scatter } from './scatter'
import { cx } from '@/lib/cx'
import styles from './FruitBurst.module.css'

const SHOWN = 6

/** The full-colour burst keeps its original three fruit. */
const COLOUR_KINDS: readonly FruitKind[] = ['lemon', 'pineapple', 'apple']
/** The silhouette burst swaps the apple for an orange — all citrus-and-pineapple peels. */
const SILHOUETTE_KINDS: readonly FruitKind[] = ['lemon', 'pineapple', 'orange']

interface Props {
  active: boolean
  /** Tile height ÷ width. */
  aspect?: number
  /** Flat, one-colour shapes behind the bottle instead of full-colour fruit. */
  silhouette?: boolean
}

/**
 * Lemons, pineapples and apples (or, as silhouettes, lemons, pineapples and oranges) that pop out around a product when it is hovered —
 * a nod to the fruit the bio-enzymes are fermented from. New positions every time.
 */
export function FruitBurst({ active, aspect = 1.25, silhouette = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // Three of each fruit; a random handful of these is thrown out on every hover.
  const pool = (silhouette ? SILHOUETTE_KINDS : COLOUR_KINDS).flatMap((kind) => [kind, kind, kind])

  useGSAP(
    () => {
      const fruits = gsap.utils.toArray<HTMLElement>('[data-fruit]', ref.current)
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.killTweensOf(fruits)

      if (!active) {
        gsap.to(fruits, {
          scale: 0,
          autoAlpha: 0,
          rotation: '+=40',
          duration: calm ? 0.15 : 0.35,
          ease: 'power2.in',
          stagger: 0.015,
        })
        return
      }

      const picks = gsap.utils.shuffle([...fruits]).slice(0, SHOWN)
      const spots = scatter({ count: picks.length, aspect })
      picks.forEach((el, i) => {
        const spot = spots[i]
        if (!spot) return
        gsap.set(el, { left: `${spot.left}%`, top: `${spot.top}%`, width: `${spot.size}%` })
        if (calm) {
          gsap.fromTo(
            el,
            { autoAlpha: 0, scale: 1, rotation: spot.rotation },
            { autoAlpha: 1, duration: 0.3 },
          )
          return
        }
        gsap.fromTo(
          el,
          { autoAlpha: 1, scale: 0, rotation: spot.rotation - 70, yPercent: 35 },
          {
            scale: 1,
            rotation: spot.rotation,
            yPercent: 0,
            duration: 0.75,
            ease: 'back.out(2.2)',
            delay: i * 0.045,
          },
        )
        gsap.to(el, {
          yPercent: -9,
          rotation: spot.rotation + gsap.utils.random(-8, 8),
          duration: gsap.utils.random(1.4, 2.2),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.8 + i * 0.045,
        })
      })
    },
    { scope: ref, dependencies: [active, aspect, silhouette] },
  )

  return (
    <div ref={ref} className={cx(styles.burst, silhouette && styles.silhouette)} aria-hidden="true">
      {pool.map((kind, i) => (
        <span key={i} className={styles.fruit} data-fruit>
          <Fruit kind={kind} silhouette={silhouette} />
        </span>
      ))}
    </div>
  )
}
