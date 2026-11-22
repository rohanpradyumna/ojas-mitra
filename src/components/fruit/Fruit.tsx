import type { JSX } from 'react'
import type { FruitKind } from '@/data/types'

export type { FruitKind }

/**
 * Flat fruit silhouettes — the peels and pulp the bio-enzymes are fermented from.
 * Drawn on a 100×100 box so they scale cleanly to any size.
 */
export const FRUIT_KINDS: readonly FruitKind[] = ['lemon', 'pineapple', 'apple', 'orange']

const LEAF = '#5f8a4a'

function Lemon() {
  return (
    <>
      <path
        d="M50 22c-21 0-38 12-41 30 3 17 20 29 41 29s38-12 41-29c-3-18-20-30-41-30z"
        fill="#f0cb45"
      />
      <path d="M8 52l-6-3v6zM92 52l6-3v6z" fill="#dfb22c" />
      <ellipse
        cx="38"
        cy="40"
        rx="12"
        ry="5"
        fill="#fff"
        opacity=".35"
        transform="rotate(-14 38 40)"
      />
      <path d="M50 22c2-9 10-14 20-13-3 9-11 14-20 13z" fill={LEAF} />
    </>
  )
}

function Pineapple() {
  return (
    <>
      <path d="M50 36L38 6l10 14L50 2l3 18L62 6z" fill={LEAF} />
      <path d="M50 36L30 14l18 16zM50 36l20-22-18 16z" fill="#4c7a3b" />
      <ellipse cx="50" cy="66" rx="24" ry="30" fill="#e2a53c" />
      <g stroke="#b9791f" strokeWidth="2.2" fill="none" opacity=".75">
        <path d="M32 46l36 36M28 60l26 26M40 38l32 32M28 74l12 12M58 38l14 14" />
        <path d="M68 46L32 82M72 60L46 86M60 38L28 70M72 74L60 86M42 38L28 52" />
      </g>
    </>
  )
}

function Apple() {
  return (
    <>
      <path
        d="M50 30c-6-5-16-7-24-3-12 7-15 23-9 39 5 14 15 27 26 26 4 0 5-2 7-2s3 2 7 2c11 1 21-12 26-26 6-16 3-32-9-39-8-4-18-2-24 3z"
        fill="#c9473a"
      />
      <path
        d="M50 30c0-9 2-17 7-23"
        stroke="#6b4a2c"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M54 18c6-9 17-11 26-7-5 9-16 12-26 7z" fill={LEAF} />
      <ellipse
        cx="33"
        cy="48"
        rx="6"
        ry="11"
        fill="#fff"
        opacity=".28"
        transform="rotate(18 33 48)"
      />
    </>
  )
}

function Orange() {
  return (
    <>
      <circle cx="50" cy="56" r="34" fill="#ec8a2c" />
      <circle cx="50" cy="56" r="34" fill="none" stroke="#d0701a" strokeWidth="1.5" />
      <path d="M50 24c-1-5 0-9 2-12" stroke="#6b4a2c" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 22c7-8 18-9 26-4-7 8-17 9-26 4z" fill={LEAF} />
      <ellipse
        cx="37"
        cy="44"
        rx="9"
        ry="6"
        fill="#fff"
        opacity=".3"
        transform="rotate(-30 37 44)"
      />
    </>
  )
}

/**
 * The round body of each drawing, in its 100×100 box: centre and radius. Used to
 * treat a fruit as a ball when it falls (the pineapple's crown sits outside it).
 */
export const FRUIT_BODY: Record<FruitKind, { cx: number; cy: number; r: number }> = {
  lemon: { cx: 50, cy: 52, r: 34 },
  pineapple: { cx: 50, cy: 66, r: 27 },
  apple: { cx: 50, cy: 60, r: 33 },
  orange: { cx: 50, cy: 56, r: 34 },
}

const SHAPES: Record<FruitKind, () => JSX.Element> = {
  lemon: Lemon,
  pineapple: Pineapple,
  apple: Apple,
  orange: Orange,
}

/**
 * One-colour outlines of the same fruit, filled with `currentColor`, for when a fruit should
 * sit quietly in the background rather than shout in full colour.
 */
const SILHOUETTES: Record<FruitKind, () => JSX.Element> = {
  lemon: () => (
    <>
      <path d="M50 22c-21 0-38 12-41 30 3 17 20 29 41 29s38-12 41-29c-3-18-20-30-41-30z" />
      <path d="M10 52l-8-4v8zM90 52l8-4v8z" />
      <path d="M50 22c2-9 10-14 20-13-3 9-11 14-20 13z" />
    </>
  ),
  pineapple: () => (
    <>
      <path d="M50 38L38 6l10 14L50 2l3 18L62 6z" />
      <path d="M50 38L28 14l20 18zM50 38l22-24-20 18z" />
      <ellipse cx="50" cy="66" rx="24" ry="30" />
    </>
  ),
  apple: () => (
    <>
      <path d="M50 30c-6-5-16-7-24-3-12 7-15 23-9 39 5 14 15 27 26 26 4 0 5-2 7-2s3 2 7 2c11 1 21-12 26-26 6-16 3-32-9-39-8-4-18-2-24 3z" />
      <path d="M48 31c0-9 2-17 7-24l4 2c-4 6-6 14-6 22z" />
      <path d="M54 18c6-9 17-11 26-7-5 9-16 12-26 7z" />
    </>
  ),
  orange: () => (
    <>
      <circle cx="50" cy="56" r="34" />
      <path d="M48 24c-1-5 0-10 3-14l3 2c-2 4-3 8-2 12z" />
      <path d="M52 22c7-8 18-9 26-4-7 8-17 9-26 4z" />
    </>
  ),
}

interface FruitProps {
  kind: FruitKind
  /** Draw a flat, single-colour shape (in `currentColor`) instead of the full-colour fruit. */
  silhouette?: boolean
  className?: string
}

export function Fruit({ kind, silhouette = false, className }: FruitProps) {
  const Shape = (silhouette ? SILHOUETTES : SHAPES)[kind]
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill={silhouette ? 'currentColor' : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <Shape />
    </svg>
  )
}
