import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReadingProgress } from '@/components/journal/ReadingProgress'
import { RichText } from '@/components/ui/RichText'
import { getJournalEntry, JOURNAL, JOURNAL_SLUGS } from '@/data/journal'
import styles from './page.module.css'

export const dynamicParams = false

export function generateStaticParams() {
  return JOURNAL_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/journal/[slug]'>): Promise<Metadata> {
  const entry = getJournalEntry((await params).slug)
  if (!entry) return {}
  return {
    title: entry.title,
    description: entry.preview,
    openGraph: { type: 'article', publishedTime: entry.date },
  }
}

export default async function JournalEntryPage({ params }: PageProps<'/journal/[slug]'>) {
  const entry = getJournalEntry((await params).slug)
  if (!entry) notFound()

  const index = JOURNAL.findIndex((e) => e.slug === entry.slug)
  const next = JOURNAL[(index + 1) % JOURNAL.length]
  const firstParagraph = entry.body.findIndex((block) => block.type === 'paragraph')

  return (
    <article className={styles.entry}>
      <ReadingProgress />
      <Link href="/journal" className={styles.back}>
        &larr; back to the journal
      </Link>
      <header className={styles.header}>
        <p className={styles.date}>
          <time dateTime={entry.date}>{entry.displayDate}</time> · {entry.season}
        </p>
        <h1 className={styles.title}>{entry.title}</h1>
      </header>

      <div className={styles.body}>
        {entry.body.map((block, i) => {
          if (block.type === 'heading') return <h2 key={i}>{block.text}</h2>
          return (
            <p key={i} className={i === firstParagraph ? styles.first : undefined}>
              <RichText text={block.text} />
            </p>
          )
        })}
      </div>

      <p className={`handwriting ${styles.signoff}`}>{entry.signoff}</p>

      {next && next.slug !== entry.slug && (
        <Link href={`/journal/${next.slug}`} className={styles.next}>
          <span className="kicker">next in the journal</span>
          <span className={styles.nextTitle}>{next.title}</span>
        </Link>
      )}
    </article>
  )
}
