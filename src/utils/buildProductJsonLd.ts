import type { ProductJsonLdOptions } from '../types'

/**
 * Generates Schema.org Product JSON-LD with AggregateOffer.
 * Handles variants pricing, stock, and optional AggregateRating.
 *
 * @example
 * const jsonLd = buildProductJsonLd({ product, siteUrl, currency: 'EUR' })
 */
export function buildProductJsonLd({
  product,
  siteUrl,
  currency = 'EUR',
  averageRating,
  reviewCount,
}: ProductJsonLdOptions): Record<string, unknown> {
  const metaImage =
    typeof product.meta?.image === 'object' ? product.meta?.image : undefined

  const gallery = product.gallery?.filter((item) => item?.image) || []
  const image = metaImage?.url || gallery[0]?.image?.url || undefined

  // Determine stock
  const hasStock = product.enableVariants
    ? product.variants?.docs?.some((v: any) => v?.inventory > 0)
    : (product.inventory ?? 0) > 0

  // Determine price (in cents → euros)
  let price = product.priceInUSD ?? 0
  if (product.enableVariants && product.variants?.docs?.length) {
    price = product.variants.docs.reduce((acc: number, v: any) => {
      if (v?.priceInUSD && v.priceInUSD > acc) return v.priceInUSD
      return acc
    }, price)
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? undefined,
    image,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: price ? (price / 100).toFixed(2) : '0',
      priceCurrency: currency,
      availability: hasStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }

  // AggregateRating — only if reviews exist
  if (averageRating && reviewCount && reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return jsonLd
}
