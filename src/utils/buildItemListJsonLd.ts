import type { ItemListJsonLdOptions } from '../types'

/**
 * Generates Schema.org ItemList JSON-LD for shop/category pages.
 * Enables Google Shopping carousel in search results.
 *
 * ⚠️ Only inject ONE ItemList per page — Google invalidates duplicates.
 *
 * @example
 * const jsonLd = buildItemListJsonLd({ products: products.docs, siteUrl, currency: 'EUR' })
 */
export function buildItemListJsonLd({
  products,
  siteUrl,
  currency = 'EUR',
  listName = 'Products',
}: ItemListJsonLdOptions): Record<string, unknown> | null {
  if (!products.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        url: `${siteUrl}/products/${product.slug}`,
        image: product.gallery?.[0]?.image?.url || '',
        offers: {
          '@type': 'Offer',
          price: product.priceInUSD
            ? (product.priceInUSD / 100).toFixed(2)
            : '0',
          priceCurrency: currency,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  }
}
