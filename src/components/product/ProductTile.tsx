'use client'

import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import type { Product } from '@/data/types'
import { FruitBurst } from '@/components/fruit/FruitBurst'
import { useCursor } from '@/components/providers/CursorPill'
import { BottleImage } from '@/components/ui/BottleImage'
import { cx } from '@/lib/cx'
import styles from './ProductTile.module.css'

interface Props {
  product: Product
  /** Show the two-note tagline under the name (the shelf page does; the product page doesn't). */
  withTagline?: boolean
  /** Throw out one-colour fruit silhouettes instead of full-colour fruit. */
  silhouetteFruit?: boolean
}

/** A product on the shelf. Hover or focus tints it and throws out the fruit it's made from. */
export function ProductTile({ product, withTagline = false, silhouetteFruit = false }: Props) {
  const [active, setActive] = useState(false)
  const cursor = useCursor()

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cx(styles.tile, active && styles.active)}
      style={{ '--tint': product.tint } as CSSProperties}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        setActive(true)
        cursor.show('discover the product')
      }}
      onPointerLeave={() => {
        setActive(false)
        cursor.hide()
      }}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <span className={styles.frame}>
        <FruitBurst active={active} silhouette={silhouetteFruit} />
        <BottleImage
          bottle={product.bottle}
          sizes="(max-width: 560px) 30vw, 16vw"
          className={styles.bottle}
        />
      </span>
      <span className={styles.name}>{product.name}</span>
      {withTagline && <span className={styles.tagline}>{product.tagline}</span>}
    </Link>
  )
}
