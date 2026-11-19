'use client'

import Image from 'next/image'
import { useRef } from 'react'
import type { GalleryImage } from '@/data/types'
import { useCursor } from '@/components/providers/CursorPill'
import { gsap, useGSAP } from '@/lib/gsap'
import { clamp } from '@/lib/math'
import styles from './DragGallery.module.css'

/** A strip of photographs dragged sideways with a little throw. Touch devices scroll it natively. */
export function DragGallery({ images, label }: { images: readonly GalleryImage[]; label: string }) {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const cursor = useCursor()

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track || !window.matchMedia('(pointer: fine)').matches) return

      let current = 0
      let target = 0
      let dragging = false
      let startX = 0
      let startTarget = 0
      let lastX = 0
      let velocity = 0
      const min = () => Math.min(0, root.clientWidth - track.scrollWidth)
      const bound = (v: number) => clamp(v, min(), 0)

      const onDown = (e: PointerEvent) => {
        dragging = true
        startX = lastX = e.clientX
        startTarget = target
        velocity = 0
        root.setPointerCapture(e.pointerId)
        root.dataset.dragging = 'true'
      }
      const onMove = (e: PointerEvent) => {
        if (!dragging) return
        velocity = e.clientX - lastX
        lastX = e.clientX
        target = bound(startTarget + (e.clientX - startX) * 1.15)
      }
      const onUp = () => {
        if (!dragging) return
        dragging = false
        delete root.dataset.dragging
        target = bound(target + velocity * 14)
      }
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
        e.preventDefault()
        target = bound(target - e.deltaX)
      }
      const tick = () => {
        current += (target - current) * 0.09
        gsap.set(track, { x: current })
      }

      root.addEventListener('pointerdown', onDown)
      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerup', onUp)
      root.addEventListener('pointercancel', onUp)
      root.addEventListener('wheel', onWheel, { passive: false })
      gsap.ticker.add(tick)
      return () => {
        root.removeEventListener('pointerdown', onDown)
        root.removeEventListener('pointermove', onMove)
        root.removeEventListener('pointerup', onUp)
        root.removeEventListener('pointercancel', onUp)
        root.removeEventListener('wheel', onWheel)
        gsap.ticker.remove(tick)
      }
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      className={styles.gallery}
      aria-label={label}
      onPointerEnter={(e) => e.pointerType === 'mouse' && cursor.show('drag')}
      onPointerLeave={() => cursor.hide()}
    >
      <ul ref={trackRef} className={styles.track}>
        {images.map((image) => (
          <li key={image.src} className={styles.item}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 760px) 70vw, 40vw"
              draggable={false}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
