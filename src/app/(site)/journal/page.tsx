import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/ui/PageIntro'
import { Reveal } from '@/components/ui/Reveal'
import { JOURNAL } from '@/data/journal'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Occasional writing on cleaning rituals, Ayurveda, household care, and the seasons.',
}

export default function JournalPage() {
  return (
    <>
      <PageIntro
        kicker="journal"
        title="Notes from the kitchen."
        lead="Occasional writing on cleaning rituals, the small inheritances of Ayurveda, household care, and the seasons. Written by us. Read at your own pace."
      />
      <Reveal as="ol" className={styles.list} stagger={0.08}>
        {JOURNAL.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/journal/${entry.slug}`} className={styles.entry}>
              <span className={styles.date}>
                <time dateTime={entry.date}>{entry.displayDate}</time>
                <span className={styles.season}>{entry.season}</span>
              </span>
              <span>
                <span className={styles.title}>{entry.title}</span>
                <span className={styles.preview}>{entry.preview}</span>
              </span>
            </Link>
          </li>
        ))}
      </Reveal>
      <p className={styles.after}>
        We write when there is something worth writing about. Subscribe to nothing — just come back,
        when you remember.
      </p>
    </>
  )
}
