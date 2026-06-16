import type { BreadcrumbJsonLdOptions } from '../types'

/**
 * Generates Schema.org BreadcrumbList JSON-LD.
 * Supports nested category hierarchy (parent → child → product).
 *
 * @example
 * const jsonLd = buildBreadcrumbJsonLd({ product, siteUrl })
 */
export function buildBreadcrumbJsonLd({
  product,
  siteUrl,
}: BreadcrumbJsonLdOptions): Record<string, unknown> {
  const rawCategories = (product.categories || []).filter(
    (c) => typeof c === 'object',
  ) as any[]

  const items: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Shop',
      item: `${siteUrl}/shop`,
    },
  ]

  if (rawCategories.length > 0) {
    const cat = rawCategories[0]
    const parents: any[] = []

    // Collect parent hierarchy recursively
    const collectParents = (c: any) => {
      if (c.parent && typeof c.parent === 'object') collectParents(c.parent)
      parents.push(c)
    }
    collectParents(cat)

    parents.forEach((c, i) => {
      items.push({
        '@type': 'ListItem',
        position: i + 2,
        name: c.title,
        item: `${siteUrl}/shop?category=${c.slug}`,
      })
    })
  }

  // Product is always the last item
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: product.title,
    item: `${siteUrl}/products/${product.slug}`,
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}
