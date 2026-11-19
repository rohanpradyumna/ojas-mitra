'use client'

import { useRef } from 'react'
import type { Product } from '@/data/types'
import { BottleImage } from '@/components/ui/BottleImage'
import { gsap, useGSAP } from '@/lib/gsap'
import { readHandoffPose, takeHandoff } from '@/lib/handoff'
import styles from './ProductReveal.module.css'

/**
 * The product's arrival: a giant title, the bottle waiting at the bottom of the screen
 * (exactly where the carousel parked it), then — on scroll — the bottle rising through
 * the title, tilting, and leaving faster than the page.
 */
export function ProductReveal({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const riseRef = useRef<HTMLDivElement>(null)
  const exitRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const arrivedFromCarousel = takeHandoff(product.slug)
      const mm = gsap.matchMedia()

      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', compact: '(max-width: 760px)' },
        (ctx) => {
          const { motion, compact } = ctx.conditions as { motion: boolean; compact: boolean }

          // Entrance
          gsap.from('[data-title-line] > span', {
            yPercent: 108,
            duration: motion ? 1.1 : 0,
            ease: 'expo.out',
            stagger: 0.1,
            delay: 0.1,
          })
          gsap.from('[data-caption]', {
            autoAlpha: 0,
            y: 16,
            duration: motion ? 0.8 : 0,
            ease: 'power2.out',
            stagger: 0.1,
            delay: 0.45,
          })
          if (!arrivedFromCarousel) {
            gsap.from(enterRef.current, {
              yPercent: 45,
              autoAlpha: 0,
              duration: motion ? 1.4 : 0,
              ease: 'expo.out',
              delay: 0.15,
            })
          }

          // Scroll: rise through the title…
          const riseBy = () => {
            const pose = readHandoffPose()
            const height = riseRef.current?.offsetHeight ?? 0
            const startCentre = pose.top + height / 2
            return window.innerHeight * (compact ? 0.42 : 0.4) - startCentre
          }
          gsap.to(riseRef.current, {
            y: riseBy,
            rotation: 28,
            scale: 0.9,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=120%',
              pin: stageRef.current,
              scrub: motion ? 0.8 : true,
              invalidateOnRefresh: true,
            },
          })
          // …then leave faster than the page once the stage lets go.
          gsap.to(exitRef.current, {
            y: () => -window.innerHeight * 0.55,
            rotation: 14,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'bottom bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        },
      )
    },
    { scope: sectionRef, dependencies: [product.slug] },
  )

  const [first, second] = product.titleLines
  const familyLine =
    product.family === 'bio-enzyme' ? ['Bio-enzyme', 'essentials'] : ['Ayurvedic', 'preparation']

  return (
    <section ref={sectionRef} className={styles.reveal} aria-labelledby="product-title">
      <div ref={stageRef} className={styles.stage}>
        <h1 id="product-title" className={styles.title}>
          <span className={styles.line} data-title-line>
            <span>{first}</span>
          </span>
          {second && (
            <span className={styles.line} data-title-line>
              <span>{second}</span>
            </span>
          )}
        </h1>

        <p className={styles.captionLeft} data-caption>
          {familyLine[0]}
          <br />
          {familyLine[1]}
          <span className="deva">{product.deva}</span>
        </p>
        <p className={styles.captionRight} data-caption>
          Made in
          <br />
          Andhra Pradesh
        </p>

        <div ref={riseRef} className={styles.bottle}>
          <div ref={exitRef} className={styles.layer}>
            <div ref={enterRef} className={styles.layer}>
              <BottleImage
                bottle={product.bottle}
                alt={`${product.name} bottle`}
                priority
                sizes="(max-width: 760px) 40vw, 20vw"
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
