import { getOtherProducts } from '@/data/products'
import type { ProductSlug } from '@/data/types'
import { ProductTile } from './ProductTile'
import styles from './OtherProducts.module.css'

export function OtherProducts({ current }: { current: ProductSlug }) {
  return (
    <section className={styles.others} aria-labelledby="others-title">
      <h2 id="others-title" className={styles.title}>
        The other
        <br />
        products
      </h2>
      <ul className={styles.grid}>
        {getOtherProducts(current).map((product) => (
          <li key={product.slug}>
            <ProductTile product={product} silhouetteFruit />
          </li>
        ))}
      </ul>
    </section>
  )
}
