'use client'

import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/data/types'
import { BottleCarousel, type BottleCarouselHandle } from './BottleCarousel'
import { Loader, loaderHasPlayed } from './Loader'

export function HomeExperience({ products }: { products: readonly Product[] }) {
  const carousel = useRef<BottleCarouselHandle>(null)
  const [loading, setLoading] = useState(() => !loaderHasPlayed())
  // Coming back without the loader: bring the bottles straight in.
  // (On a first visit the loader calls enter() as it wipes away.)
  useEffect(() => {
    if (loaderHasPlayed()) carousel.current?.enter()
  }, [])

  return (
    <>
      <h1 className="visually-hidden">
        Ojas Mithra — bio-enzyme cleaning essentials, made by hand
      </h1>
      <BottleCarousel ref={carousel} products={products} />
      {loading && (
        <Loader onReveal={() => carousel.current?.enter()} onDone={() => setLoading(false)} />
      )}
    </>
  )
}
