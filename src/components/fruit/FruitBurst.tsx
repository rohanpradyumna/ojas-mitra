'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { Fruit, FRUIT_KINDS, type FruitKind } from './Fruit'
import { scatter } from './scatter'
import styles from './FruitBurst.module.css'

/** Three of each fruit; a random handful of these is thrown out on every hover. */
const POOL: readonly FruitKind[] = FRUIT_KINDS.flatMap((kind) => [kind, kind, kind])
const SHOWN = 6

interface Props {
  active: boolean
  /** Tile height ÷ width. */
  aspect?: number
}

/**
 * Lemons, pineapples and apples that pop out around a product when it is hovered —
 * a nod to the fruit the bio-enzymes are fermented from. New positions every time.
 */
export function FruitBurst({ active, aspect = 1.25 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

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
    { scope: ref, dependencies: [active, aspect] },
  )

  return (
    <div ref={ref} className={styles.burst} aria-hidden="true">
      {POOL.map((kind, i) => (
        <span key={i} className={styles.fruit} data-fruit>
          <Fruit kind={kind} />
        </span>
      ))}
    </div>
  )
}
