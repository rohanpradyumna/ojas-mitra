import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <p className="kicker">nothing here</p>
      <h1 className={styles.title}>This shelf is empty.</h1>
      <p className="lead">The page you were looking for has moved, or was never made.</p>
      <Link href="/shelf" className={styles.link}>
        See what is on the shelf
      </Link>
    </main>
  )
}
