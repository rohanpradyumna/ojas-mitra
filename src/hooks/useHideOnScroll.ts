'use client'

import { useEffect, useState } from 'react'

interface HeaderScroll {
  /** True while the visitor is scrolling down past `threshold`; false as soon as they scroll up. */
  hidden: boolean
  /** True once the page has left the top, so a returning header needs its own backdrop. */
  scrolled: boolean
}

export function useHideOnScroll(threshold = 140): HeaderScroll {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    // A page restored mid-scroll should start with the backdrop on.
    const first = requestAnimationFrame(() => setScrolled(window.scrollY > 8))
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (Math.abs(y - lastY) < 6) return
      setHidden(y > lastY && y > threshold)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(first)
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return { hidden, scrolled }
}
