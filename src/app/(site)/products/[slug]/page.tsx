import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DragGallery } from '@/components/product/DragGallery'
import { OtherProducts } from '@/components/product/OtherProducts'
import { ProductNotes } from '@/components/product/ProductNotes'
import { ProductReveal } from '@/components/product/ProductReveal'
import { galleryFor } from '@/data/gallery'
import { getProduct, PRODUCT_SLUGS } from '@/data/products'

export const dynamicParams = false

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const product = getProduct((await params).slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.metaDescription,
    openGraph: { images: [{ url: product.poster }] },
  }
}

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const product = getProduct((await params).slug)
  if (!product) notFound()

  return (
    <>
      <ProductReveal product={product} />
      <ProductNotes product={product} />
      <DragGallery
        images={galleryFor(product.slug)}
        label={`Photographs of the ${product.name.toLowerCase()} and the shelf`}
      />
      <OtherProducts current={product.slug} />
    </>
  )
}
