'use client'

import { useEffect, useState } from 'react'

/** True while the visitor is scrolling down past `threshold`; false as soon as they scroll up. */
export function useHideOnScroll(threshold = 140): boolean {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - lastY) < 6) return
      setHidden(y > lastY && y > threshold)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return hidden
}
