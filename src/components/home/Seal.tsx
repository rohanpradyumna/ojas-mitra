import { useId, type Ref } from 'react'
import styles from './Seal.module.css'

const RING_TEXT = 'MADE BY HAND · KEPT AT HOME · '

/** The rotating terracotta octagon the bottles travel across. Rotation is set by the carousel. */
export function Seal({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const ringId = useId()
  return (
    <div ref={ref} className={styles.seal} aria-hidden="true">
      <svg viewBox="0 0 1200 1200" className={styles.svg}>
        <polygon
          points="1061.9,408.7 1061.9,791.3 791.3,1061.9 408.7,1061.9 138.1,791.3 138.1,408.7 408.7,138.1 791.3,138.1"
          className={styles.octagon}
        />
        <path
          id={ringId}
          fill="none"
          d="M 600,600 m -372,0 a 372,372 0 1,1 744,0 a 372,372 0 1,1 -744,0"
        />
        <text className={styles.ring} textLength="2320" lengthAdjust="spacingAndGlyphs">
          <textPath href={`#${ringId}`}>{RING_TEXT}</textPath>
        </text>
      </svg>
    </div>
  )
}
