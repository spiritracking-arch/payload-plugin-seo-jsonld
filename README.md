# payload-plugin-seo-jsonld

Schema.org JSON-LD utilities for [Payload CMS v3](https://payloadcms.com) e-commerce. Enables Google rich snippets (product cards, carousels, breadcrumbs) with battle-tested helpers built on real production deployments across 23 European shops.

## Features

- 🛍️ **Product** — `AggregateOffer` with `lowPrice`, stock status, variants support
- ⭐ **AggregateRating** — plug in your review data for star ratings in Google
- 🧭 **BreadcrumbList** — nested category hierarchy (parent → child → product)
- 📋 **ItemList** — shopping carousel for shop/category pages
- 🌐 **WebSite** — SearchAction for Google Sitelinks Searchbox
- 🏢 **Organization** — brand identity in search results
- 🔒 Anti-duplicate protection for ItemList (Google invalidates 2+ per page)
- 💶 Automatic price conversion from cents to euros (or any currency)

## Installation

```bash
npm install payload-plugin-seo-jsonld
```

## Usage

### 1. Add to your Payload config (optional)

```typescript
// payload.config.ts
import { seoJsonLdPlugin } from 'payload-plugin-seo-jsonld'

export default buildConfig({
  plugins: [
    seoJsonLdPlugin({ currency: 'EUR' }),
  ],
})
```

### 2. Product page — Product + BreadcrumbList

```typescript
// src/app/(app)/products/[slug]/page.tsx
import { buildProductJsonLd, buildBreadcrumbJsonLd } from 'payload-plugin-seo-jsonld'

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL!

  const productJsonLd = buildProductJsonLd({
    product,
    siteUrl,
    currency: 'EUR',
    // Optional: plug in review data
    averageRating: 4.8,
    reviewCount: 42,
  })

  const breadcrumbJsonLd = buildBreadcrumbJsonLd({ product, siteUrl })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* your page content */}
    </>
  )
}
```

### 3. Shop/category page — ItemList carousel

```typescript
// src/app/(app)/shop/page.tsx
import { buildItemListJsonLd } from 'payload-plugin-seo-jsonld'

export default async function ShopPage() {
  const products = await fetchProducts()
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL!

  // ⚠️ Only one ItemList per page — Google invalidates duplicates
  const itemListJsonLd = buildItemListJsonLd({
    products: products.docs,
    siteUrl,
    currency: 'EUR',
    listName: 'Our Products',
  })

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      {/* your page content */}
    </>
  )
}
```

### 4. Root layout — WebSite + Organization

```typescript
// src/app/layout.tsx
import { buildWebSiteJsonLd, buildOrganizationJsonLd } from 'payload-plugin-seo-jsonld'

export default function RootLayout({ children }) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL!

  const websiteJsonLd = buildWebSiteJsonLd({
    siteUrl,
    siteName: 'My Shop',
    description: 'Premium jewelry across Europe',
  })

  const orgJsonLd = buildOrganizationJsonLd({
    siteUrl,
    name: 'My Shop',
    logo: `${siteUrl}/logo.png`,
  })

  return (
    <html>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
```

## API Reference

### `buildProductJsonLd(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `product` | `object` | required | Payload product document |
| `siteUrl` | `string` | required | Base URL (e.g. `https://myshop.com`) |
| `currency` | `string` | `'EUR'` | ISO 4217 currency code |
| `averageRating` | `number` | — | Average review rating |
| `reviewCount` | `number` | — | Number of reviews |

### `buildBreadcrumbJsonLd(options)`

| Option | Type | Description |
|---|---|---|
| `product` | `object` | Payload product with populated `categories` |
| `siteUrl` | `string` | Base URL |

> Supports nested categories: `Shop → Parent Category → Sub Category → Product`

### `buildItemListJsonLd(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `products` | `array` | required | Array of Payload product docs |
| `siteUrl` | `string` | required | Base URL |
| `currency` | `string` | `'EUR'` | ISO 4217 currency code |
| `listName` | `string` | `'Products'` | Name of the list |

> Returns `null` if products array is empty — safe to use with conditional rendering.

### `buildWebSiteJsonLd(options)`

| Option | Type | Description |
|---|---|---|
| `siteUrl` | `string` | Base URL |
| `siteName` | `string` | Site name |
| `description` | `string` | Optional description |

### `buildOrganizationJsonLd(options)`

| Option | Type | Description |
|---|---|---|
| `siteUrl` | `string` | Base URL |
| `name` | `string` | Organization name |
| `logo` | `string` | Logo URL |
| `description` | `string` | Optional description |

## Important Notes

- **Prices in cents** — Payload stores prices in cents (`3990` = €39.90). This plugin automatically divides by 100.
- **ItemList deduplication** — Google invalidates pages with 2+ `ItemList` scripts. Always check before adding.
- **`lowPrice` not `price`** — Google requires `lowPrice` for `AggregateOffer` validation. This plugin handles it correctly.
- **Depth 3 required** — Make sure to fetch products with `depth: 3` to populate categories and their parents.

## Verification

```bash
# Check lowPrice on product page
curl -s "https://myshop.com/products/my-product" | grep "lowPrice"

# Check single ItemList on shop page
curl -s "https://myshop.com/shop" | grep -o '"@type":"ItemList"' | wc -l
# → must return 1
```

Test with [Google Rich Results Test](https://search.google.com/test/rich-results).

## License

MIT — Made by [Camille](https://github.com/spiritracking-arch)
