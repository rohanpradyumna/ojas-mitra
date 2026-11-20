'use client'

import { useRef, type RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { readHandoffPose, type HandoffPose } from '@/lib/handoff'
import { clamp, lerp } from '@/lib/math'
import {
  loopPosition,
  loopSpan,
  offsetToCentre,
  poseOnLoop,
  type Pose,
  type Viewport,
} from './carouselGeometry'

/** Loops per second the carousel drifts on its own, so it never sits still. */
const DRIFT = 0.016
/** How quickly the drawn position catches up with where input has pushed it (per 60fps frame). */
const FOLLOW = 0.085
/** Pixels of pointer travel before a press becomes a drag rather than a click. */
const DRAG_SLOP = 6

interface LoopState {
  offset: number
  target: number
  /** 1 → 0 as the bottles slide in after the loader. */
  intro: number
  /** 0 → 1 as the chosen bottle settles into the hand-off pose. */
  handoff: number
  chosen: number
  /** Where the chosen bottle parks, resolved when it is chosen. */
  park: HandoffPose | null
  hovered: number
  hover: number[]
  dragging: boolean
  dragMoved: boolean
}

interface Options {
  stageRef: RefObject<HTMLElement | null>
  itemRefs: RefObject<Array<HTMLElement | null>>
  wheelRef: RefObject<HTMLElement | null>
  count: number
  reducedMotion: boolean
}

export interface BottleLoop {
  /** Slide the bottles in. Call once the loader has gone. */
  enter: () => void
  /** Bring bottle `index` to centre stage and park it for the product page. */
  choose: (index: number, onParked: () => void) => void
  setHovered: (index: number) => void
  /** Rotate bottle `index` to centre stage without choosing it (keyboard focus). */
  centre: (index: number) => void
  /** True if the last press turned into a drag — its click should be ignored. */
  wasDrag: () => boolean
}

/**
 * The infinite carousel engine. Wheel, drag, swipe and arrow keys push `target`;
 * every frame `offset` eases towards it and each bottle is posed from its loop position.
 */
export function useBottleLoop({
  stageRef,
  itemRefs,
  wheelRef,
  count,
  reducedMotion,
}: Options): BottleLoop {
  const state = useRef<LoopState>({
    offset: 0,
    target: 0,
    intro: reducedMotion ? 0 : 1,
    handoff: 0,
    chosen: -1,
    park: null,
    hovered: -1,
    hover: Array.from({ length: count }, () => 0),
    dragging: false,
    dragMoved: false,
  })

  // Actions are built inside the GSAP context (so their tweens are cleaned up with it)
  // and reached through this ref from event handlers.
  const actions = useRef<Pick<BottleLoop, 'enter' | 'choose' | 'centre'> | null>(null)

  useGSAP(
    (_context, contextSafe) => {
      const stage = stageRef.current
      if (!stage) return
      const s = state.current

      let vp: Viewport = { width: 0, height: 0, compact: false }
      let sizes: Array<{ w: number; h: number }> = []
      const measure = () => {
        vp = {
          width: window.innerWidth,
          height: window.innerHeight,
          compact: window.innerWidth < 760,
        }
        sizes = itemRefs.current.map((el) => ({
          w: el?.offsetWidth ?? 0,
          h: el?.offsetHeight ?? 0,
        }))
      }
      measure()

      const pixelsPerLoop = () => loopSpan(vp) * vp.width

      // ── Frame ────────────────────────────────────────────────────────
      const render = (_time: number, deltaMs: number) => {
        const dt = Math.min(deltaMs, 64) / 1000
        const idle = s.hovered < 0 && !s.dragging && s.chosen < 0
        if (idle && !reducedMotion) s.target += DRIFT * dt
        s.offset += (s.target - s.offset) * Math.min(1, FOLLOW * dt * 60)

        const park = s.handoff > 0 ? s.park : null
        const h = s.handoff

        itemRefs.current.forEach((el, i) => {
          if (!el) return
          const size = sizes[i] ?? { w: 0, h: 0 }
          s.hover[i] = lerp(s.hover[i] ?? 0, i === s.hovered ? 1 : 0, 0.12)
          let pose: Pose = poseOnLoop(loopPosition(i, count, s.offset), vp)
          pose.x += s.intro * vp.width * 0.9
          pose.scale *= 1 + (s.hover[i] ?? 0) * 0.06
          pose.rotation -= (s.hover[i] ?? 0) * 6
          let opacity = 1

          if (park && i === s.chosen) {
            const parked: Pose = {
              x: vp.width / 2,
              y: park.top + (size.h * park.scale) / 2,
              rotation: 0,
              scale: park.scale,
              depth: 0,
            }
            pose = {
              x: lerp(pose.x, parked.x, h),
              y: lerp(pose.y, parked.y, h),
              rotation: lerp(pose.rotation, 0, h) - Math.sin(h * Math.PI) * 10,
              scale: lerp(pose.scale, parked.scale, h),
              depth: 0,
            }
          } else if (h > 0) {
            pose.y += h * vp.height * 0.1
            pose.scale *= 1 - 0.2 * h
            opacity = clamp(1 - h * 1.7, 0, 1)
          }

          el.style.transform =
            `translate3d(${(pose.x - size.w / 2).toFixed(1)}px, ${(pose.y - size.h / 2).toFixed(1)}px, 0) ` +
            `rotate(${pose.rotation.toFixed(2)}deg) scale(${pose.scale.toFixed(4)})`
          el.style.opacity = String(opacity)
          el.dataset.far = String(pose.depth > 0.78 && h === 0)
        })

        const wheel = wheelRef.current
        if (wheel) {
          const eased = h * h * (3 - 2 * h)
          wheel.style.transform =
            `translate3d(-50%, ${(eased * 46 + s.intro * 30).toFixed(2)}vh, 0) ` +
            `rotate(${(22 + s.offset * 110 - h * 24).toFixed(2)}deg) scale(${(1 + s.intro * 0.12).toFixed(3)})`
          wheel.style.opacity = String(clamp(1 - h * 1.8, 0, 1))
        }
      }
      gsap.ticker.add(render)

      // ── Input ────────────────────────────────────────────────────────
      const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        if (s.chosen >= 0) return
        const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        const px = e.deltaMode === 1 ? raw * 16 : raw
        s.target += px / pixelsPerLoop()
      }

      let startX = 0
      let startY = 0
      let startTarget = 0
      let lastX = 0
      let lastT = 0
      let velocity = 0
      const onDown = (e: PointerEvent) => {
        if (s.chosen >= 0 || e.button !== 0) return
        s.dragging = true
        s.dragMoved = false
        startX = lastX = e.clientX
        startY = e.clientY
        startTarget = s.target
        lastT = performance.now()
        velocity = 0
      }
      const onMove = (e: PointerEvent) => {
        if (!s.dragging) return
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        if (!s.dragMoved && Math.hypot(dx, dy) > DRAG_SLOP) {
          s.dragMoved = true
          stage.setPointerCapture(e.pointerId)
          stage.dataset.dragging = 'true'
        }
        if (!s.dragMoved) return
        const d = Math.abs(dx) >= Math.abs(dy) ? dx : dy
        s.target = startTarget - d / pixelsPerLoop()
        const now = performance.now()
        velocity = (e.clientX - lastX) / Math.max(1, now - lastT)
        lastX = e.clientX
        lastT = now
      }
      const onUp = () => {
        if (!s.dragging) return
        s.dragging = false
        delete stage.dataset.dragging
        if (s.dragMoved) s.target -= (velocity * 220) / pixelsPerLoop() // a little throw
      }
      const onKey = (e: KeyboardEvent) => {
        if (s.chosen >= 0) return
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
        if (!step) return
        e.preventDefault()
        s.target = (Math.round(s.target * count) + step) / count
      }

      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('resize', measure)
      stage.addEventListener('pointerdown', onDown)
      stage.addEventListener('pointermove', onMove)
      stage.addEventListener('pointerup', onUp)
      stage.addEventListener('pointercancel', onUp)
      stage.addEventListener('keydown', onKey)

      const safe = contextSafe ?? (<T>(fn: T) => fn)
      actions.current = {
        enter: safe(() => {
          gsap.to(s, { intro: 0, duration: reducedMotion ? 0 : 1.8, ease: 'expo.out' })
        }),
        choose: safe((index: number, onParked: () => void) => {
          if (s.chosen >= 0) return
          s.chosen = index
          s.park = readHandoffPose()
          s.hovered = -1
          const to = offsetToCentre(index, count, s.offset)
          gsap
            .timeline({ onComplete: onParked })
            .to(s, {
              offset: to,
              target: to,
              duration: reducedMotion ? 0 : 0.75,
              ease: 'power3.inOut',
            })
            .to(s, { handoff: 1, duration: reducedMotion ? 0 : 1.05, ease: 'power2.inOut' })
        }),
        centre: safe((index: number) => {
          if (s.chosen >= 0) return
          s.target = offsetToCentre(index, count, s.target)
        }),
      }

      return () => {
        actions.current = null
        gsap.ticker.remove(render)
        window.removeEventListener('wheel', onWheel)
        window.removeEventListener('resize', measure)
        stage.removeEventListener('pointerdown', onDown)
        stage.removeEventListener('pointermove', onMove)
        stage.removeEventListener('pointerup', onUp)
        stage.removeEventListener('pointercancel', onUp)
        stage.removeEventListener('keydown', onKey)
      }
    },
    { scope: stageRef, dependencies: [count, reducedMotion] },
  )

  return {
    enter: () => actions.current?.enter(),
    choose: (index, onParked) => actions.current?.choose(index, onParked),
    centre: (index) => actions.current?.centre(index),
    setHovered: (index) => {
      state.current.hovered = index
    },
    wasDrag: () => state.current.dragMoved,
  }
}
