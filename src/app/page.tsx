import { HomeExperience } from '@/components/home/HomeExperience'
import { CAROUSEL_PRODUCTS } from '@/data/products'

export default function HomePage() {
  return (
    <main id="main">
      <HomeExperience products={CAROUSEL_PRODUCTS} />
    </main>
  )
}
