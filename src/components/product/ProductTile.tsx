'use client'

import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import type { Product } from '@/data/types'
import { FruitPour } from '@/components/fruit/FruitPour'
import { useCursor } from '@/components/providers/CursorPill'
import { BottleImage } from '@/components/ui/BottleImage'
import { cx } from '@/lib/cx'
import styles from './ProductTile.module.css'

interface Props {
  product: Product
  /** Show the two-note tagline under the name (the shelf page does; the product page doesn't). */
  withTagline?: boolean
}

/** A product on the shelf. Hover or focus tints it and pours in silhouettes of its fruit. */
export function ProductTile({ product, withTagline = false }: Props) {
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
        <FruitPour active={active} kind={product.fruit} />
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
