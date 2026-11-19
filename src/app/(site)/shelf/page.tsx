import type { Metadata } from 'next'
import { ProductTile } from '@/components/product/ProductTile'
import { PageIntro } from '@/components/ui/PageIntro'
import { PRODUCTS } from '@/data/products'
import { SITE } from '@/data/site'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'The shelf',
  description:
    'The full Ojas Mithra catalogue — bio-enzyme cleaning essentials and Ayurvedic preparations.',
}

export default function ShelfPage() {
  return (
    <>
      <PageIntro
        kicker="the shelf"
        title="Seven things, kept the way we’d keep them at home."
        lead="Nothing here is in a range. There are no bestsellers. Each bottle exists because we use it in our own kitchen, on our own floors, on our own faces — and we wanted to make it well enough to share."
      />
      <ul className={styles.grid}>
        {PRODUCTS.map((product) => (
          <li key={product.slug}>
            <ProductTile product={product} withTagline />
          </li>
        ))}
      </ul>
      <section className={styles.order} aria-label="How to order">
        <p className="lead">To take any of these home, write to us on WhatsApp.</p>
        <a href={SITE.whatsapp.href} className={styles.number}>
          {SITE.whatsapp.display}
        </a>
        <p className={`handwriting ${styles.sign}`}>we will reply when the kitchen is quiet.</p>
      </section>
    </>
  )
}
