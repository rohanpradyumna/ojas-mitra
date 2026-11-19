'use client'

import type { ReactNode } from 'react'
import { CursorProvider } from './CursorPill'
import { SmoothScroll } from './SmoothScroll'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <CursorProvider>{children}</CursorProvider>
    </SmoothScroll>
  )
}
