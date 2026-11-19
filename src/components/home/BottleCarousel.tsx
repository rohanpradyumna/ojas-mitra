'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useImperativeHandle, useRef, type MouseEvent, type Ref } from 'react'
import type { Product } from '@/data/types'
import { useCursor } from '@/components/providers/CursorPill'
import { BottleImage } from '@/components/ui/BottleImage'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { noteHandoff } from '@/lib/handoff'
import { Seal } from './Seal'
import { useBottleLoop } from './useBottleLoop'
import styles from './BottleCarousel.module.css'

export interface BottleCarouselHandle {
  enter: () => void
}

interface Props {
  products: readonly Product[]
  ref?: Ref<BottleCarouselHandle>
}

/**
 * The home page: an endless loop of bottles over the turning seal. Scroll, swipe, drag
 * or use the arrow keys to turn it; choose a bottle to carry it into its own page.
 */
export function BottleCarousel({ products, ref }: Props) {
  const stageRef = useRef<HTMLElement>(null)
  const sealRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const router = useRouter()
  const cursor = useCursor()
  const reducedMotion = useReducedMotion()

  const loop = useBottleLoop({ stageRef, itemRefs, sealRef, count: products.length, reducedMotion })
  useImperativeHandle(ref, () => ({ enter: loop.enter }))

  const choose = (e: MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault()
    if (loop.wasDrag()) return
    const product = products[index]
    if (!product) return
    const href = `/products/${product.slug}`
    cursor.hide()
    router.prefetch(href)
    loop.choose(index, () => {
      noteHandoff(product.slug)
      router.push(href, { scroll: false })
    })
  }

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      aria-roledescription="carousel"
      aria-label="The bottles — scroll or use the arrow keys to turn the shelf"
      tabIndex={-1}
    >
      <Seal ref={sealRef} />

      <ul className={styles.track}>
        {products.map((product, i) => (
          <li
            key={product.slug}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className={styles.item}
          >
            <Link
              href={`/products/${product.slug}`}
              className={styles.bottle}
              aria-label={`Discover the ${product.name.toLowerCase()}`}
              draggable={false}
              onClick={(e) => choose(e, i)}
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                loop.setHovered(i)
                cursor.show('discover the product')
              }}
              onPointerLeave={() => {
                loop.setHovered(-1)
                cursor.hide()
              }}
              onFocus={(e) => {
                if (e.currentTarget.matches(':focus-visible')) loop.centre(i)
              }}
            >
              <BottleImage
                bottle={product.bottle}
                priority={i < 3}
                sizes="(max-width: 760px) 30vw, 14vw"
                className={styles.image}
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.foot}>
        <Link href="/shelf" className={styles.shelfLink}>
          See the whole shelf
        </Link>
        <p className={styles.cue}>
          Scroll to discover
          <span aria-hidden="true" />
        </p>
      </div>
    </section>
  )
}
