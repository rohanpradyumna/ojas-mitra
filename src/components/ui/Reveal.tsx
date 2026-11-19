'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

interface Props {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Seconds between direct children, to stagger them in. 0 animates the block as one. */
  stagger?: number
}

/** Rises content into place once, as it first scrolls into view. */
export function Reveal({ children, as: Tag = 'div', className, stagger = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = stagger ? Array.from(el.children) : el
        gsap.from(targets, {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
