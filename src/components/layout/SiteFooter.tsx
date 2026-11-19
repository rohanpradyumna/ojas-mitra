import Link from 'next/link'
import { PRODUCTS } from '@/data/products'
import { NAV_LINKS, SITE } from '@/data/site'
import styles from './SiteFooter.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <p className={styles.signoff}>{SITE.name}</p>
          <p className={styles.about}>
            A small house of bio-enzyme cleaning essentials and Ayurvedic preparations. Made in
            rural south India by Kavita Ajay.
          </p>
        </div>
        <nav aria-labelledby="footer-shelf">
          <h2 id="footer-shelf" className={styles.heading}>
            The shelf
          </h2>
          <ul className={styles.list}>
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-pages">
          <h2 id="footer-pages" className={styles.heading}>
            Pages
          </h2>
          <ul className={styles.list}>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className={styles.heading}>Find us</h2>
          <ul className={styles.list}>
            <li>
              <a href={SITE.whatsapp.href}>{SITE.whatsapp.display}</a>
            </li>
            <li>
              <a href={SITE.instagram.href}>{SITE.instagram.display}</a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
          <p className={styles.place}>{SITE.place}</p>
        </div>
      </div>
      <p className={styles.farewell}>
        <span className="deva">शुभं भवतु</span> — may your home be well kept. © 2026 {SITE.name}
      </p>
    </footer>
  )
}
