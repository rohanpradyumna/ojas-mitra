import Image from 'next/image'
import type { BottleImage as Bottle } from '@/data/types'

interface Props {
  bottle: Bottle
  alt?: string
  className?: string
  priority?: boolean
  /** Rendered height in CSS; width follows the bottle's aspect ratio. */
  sizes?: string
}

export function BottleImage({ bottle, alt = '', className, priority, sizes = '30vw' }: Props) {
  return (
    <Image
      src={bottle.src}
      alt={alt}
      width={bottle.width}
      height={bottle.height}
      className={className}
      priority={priority}
      sizes={sizes}
      draggable={false}
      // SVG illustrations are already resolution-independent.
      unoptimized={bottle.kind === 'illustration'}
    />
  )
}
