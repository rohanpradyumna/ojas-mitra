import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import styles from './PageIntro.module.css'

interface Props {
  kicker: string
  title: ReactNode
  lead?: ReactNode
}

/** The opening of a reading page: a quiet label, a headline, a line of italic lead. */
export function PageIntro({ kicker, title, lead }: Props) {
  return (
    <Reveal as="header" className={styles.intro} stagger={0.08}>
      <p className="kicker">{kicker}</p>
      <h1 className={styles.title}>{title}</h1>
      {lead && <p className={`lead ${styles.lead}`}>{lead}</p>}
    </Reveal>
  )
}
