export interface SeoJsonLdPluginOptions {
  /**
   * Enable or disable the plugin.
   * @default true
   */
  enabled?: boolean

  /**
   * Currency code for prices.
   * @default 'EUR'
   */
  currency?: string

  /**
   * The slug of the products collection.
   * @default 'products'
   */
  productsCollection?: string

  /**
   * Base URL of the site (e.g. https://myshop.com).
   * Falls back to process.env.NEXT_PUBLIC_SERVER_URL
   */
  siteUrl?: string
}

export interface ProductJsonLdOptions {
  product: {
    title: string
    description?: string | null
    slug: string
    priceInUSD?: number | null
    inventory?: number | null
    gallery?: Array<{ image?: { url?: string | null } | null } | null> | null
    meta?: {
      title?: string | null
      image?: { url?: string | null } | null
    } | null
    categories?: any[]
    variants?: { docs?: any[] }
    enableVariants?: boolean
  }
  siteUrl: string
  currency?: string
  averageRating?: number
  reviewCount?: number
}

export interface BreadcrumbJsonLdOptions {
  product: {
    title: string
    slug: string
    categories?: any[]
  }
  siteUrl: string
}

export interface ItemListJsonLdOptions {
  products: Array<{
    title: string
    slug: string
    priceInUSD?: number | null
    gallery?: Array<{ image?: { url?: string | null } | null } | null> | null
  }>
  siteUrl: string
  currency?: string
  listName?: string
}

export interface WebSiteJsonLdOptions {
  siteUrl: string
  siteName: string
  description?: string
}

export interface OrganizationJsonLdOptions {
  siteUrl: string
  name: string
  logo?: string
  description?: string
}
