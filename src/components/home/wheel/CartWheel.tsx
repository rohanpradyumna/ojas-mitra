import { useId, type Ref } from 'react'
import {
  BAND,
  CENTRE,
  HUB,
  polar,
  rimInner,
  SPOKES,
  spokePoints,
  TYRE_GAP,
  TYRE_OUTER,
  VIEWBOX,
} from './geometry'
import type { WheelVariant } from '@/data/types'
import { WarliFrieze } from './warli/WarliFrieze'
import styles from './CartWheel.module.css'

const RIM_TEXT = 'MADE BY HAND · KEPT AT HOME · SLOWLY · ON PURPOSE · '
const SPOKE_ANGLES = Array.from({ length: SPOKES }, (_, i) => (i * 360) / SPOKES)
/** Rim segments join between every second pair of spokes. */
const JOINT_ANGLES = SPOKE_ANGLES.filter((_, i) => i % 2 === 0).map((a) => a + 180 / SPOKES)
const TYRE_BOLTS = Array.from({ length: 28 }, (_, i) => (i * 360) / 28)

interface Props {
  variant: WheelVariant
  ref?: Ref<HTMLDivElement>
}

/**
 * The bullock-cart wheel the bottles travel across. Its rotation is driven by the
 * carousel; this component only draws it. Three rims: painted text, a Warli frieze
 * of how the bottles are made, or plain wood.
 */
export function CartWheel({ variant, ref }: Props) {
  const ringId = useId()
  const inner = rimInner(variant)
  const broad = variant !== 'plain'

  return (
    <div ref={ref} className={styles.wheel} data-variant={variant} aria-hidden="true">
      <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className={styles.svg}>
        {/* Iron tyre and wooden rim, as one ring with the gap between them cut in. */}
        <path className={styles.wood} fillRule="evenodd" d={ring(TYRE_OUTER, inner)} />
        <circle className={styles.cut} cx={CENTRE} cy={CENTRE} r={TYRE_GAP} strokeWidth={5} />
        {TYRE_BOLTS.map((deg) => {
          const p = polar((TYRE_OUTER + TYRE_GAP) / 2 + 2, deg)
          return <circle key={deg} className={styles.cutFill} cx={p.x} cy={p.y} r={4.2} />
        })}

        {/* Spokes, bolted into the rim. */}
        {SPOKE_ANGLES.map((deg) => (
          <polygon
            key={deg}
            className={styles.wood}
            points={spokePoints(deg, HUB - 8, inner + 14, 46, 30)}
          />
        ))}
        {SPOKE_ANGLES.map((deg) => {
          const p = polar(inner - 26, deg)
          return <circle key={`b${deg}`} className={styles.cutFill} cx={p.x} cy={p.y} r={5.5} />
        })}

        {/* Hub: a heavy nave with turned rings round the axle. */}
        <circle className={styles.wood} cx={CENTRE} cy={CENTRE} r={HUB} />
        <circle className={styles.cut} cx={CENTRE} cy={CENTRE} r={HUB - 20} strokeWidth={5} />
        <circle className={styles.cut} cx={CENTRE} cy={CENTRE} r={HUB - 58} strokeWidth={4} />
        <circle className={styles.cutFill} cx={CENTRE} cy={CENTRE} r={32} />

        {!broad &&
          JOINT_ANGLES.map((deg) => {
            const a = polar(inner, deg)
            const b = polar(TYRE_GAP, deg)
            return (
              <line
                key={deg}
                className={styles.cut}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={4}
              />
            )
          })}

        {broad && (
          <>
            <circle className={styles.cut} cx={CENTRE} cy={CENTRE} r={BAND.inner} strokeWidth={3} />
            <circle className={styles.cut} cx={CENTRE} cy={CENTRE} r={BAND.outer} strokeWidth={3} />
          </>
        )}

        {variant === 'text' && (
          <>
            <path
              id={ringId}
              fill="none"
              d={`M ${CENTRE},${CENTRE} m 0,-${BAND.text} a ${BAND.text},${BAND.text} 0 1,1 0,${2 * BAND.text} a ${BAND.text},${BAND.text} 0 1,1 0,-${2 * BAND.text}`}
            />
            <text
              className={styles.text}
              textLength={2 * Math.PI * BAND.text - 12}
              lengthAdjust="spacingAndGlyphs"
              dominantBaseline="central"
            >
              <textPath href={`#${ringId}`}>{RIM_TEXT}</textPath>
            </text>
          </>
        )}

        {variant === 'warli' && <WarliFrieze />}
      </svg>
    </div>
  )
}

/** An annulus between two radii, as one path (use fill-rule evenodd). */
function ring(outer: number, inner: number): string {
  const circle = (r: number) =>
    `M ${CENTRE - r},${CENTRE} a ${r},${r} 0 1,0 ${2 * r},0 a ${r},${r} 0 1,0 ${-2 * r},0 Z`
  return `${circle(outer)} ${circle(inner)}`
}
