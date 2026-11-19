import type { Product } from '@/data/types'
import { SITE } from '@/data/site'
import { Diamond } from '@/components/ui/Diamond'
import { RichText } from '@/components/ui/RichText'
import styles from './ProductNotes.module.css'

export function ProductNotes({ product }: { product: Product }) {
  const isBioEnzyme = product.family === 'bio-enzyme'

  return (
    <section className={styles.notes} aria-label={`About the ${product.name.toLowerCase()}`}>
      <Diamond />
      <p className={styles.sub}>{product.sub}</p>
      <div className={styles.description}>
        {product.description.map((paragraph, i) => (
          <p key={i}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>
      {isBioEnzyme && (
        <p className={styles.footnote}>*fermented in clay pots, in a courtyard in Andhra Pradesh</p>
      )}
      <Diamond />

      <dl className={styles.specs}>
        <div>
          <dt>How to use it</dt>
          <dd>
            <ul>
              {product.howTo.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Keeps for</dt>
          <dd>
            <span className={styles.pill}>{product.keeps}</span>
          </dd>
        </div>
        <div>
          <dt>To take it home</dt>
          <dd>
            Write to us on WhatsApp, <a href={SITE.whatsapp.href}>{SITE.whatsapp.display}</a>. We
            reply when the kitchen is quiet.
          </dd>
        </div>
      </dl>

      <div className={styles.inside}>
        <div>
          <h2 className={styles.heading}>What is inside</h2>
          <ul className={styles.ingredients}>
            {product.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={styles.heading}>
            {isBioEnzyme ? 'The bio-enzyme note' : 'A note on the oil'}
          </h2>
          <p className={styles.note}>
            <RichText text={product.note} />
          </p>
        </div>
      </div>
    </section>
  )
}
