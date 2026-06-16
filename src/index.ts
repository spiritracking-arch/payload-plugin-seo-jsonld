import type { Config, Plugin } from 'payload'
import type { SeoJsonLdPluginOptions } from './types'

export const seoJsonLdPlugin =
  (options: SeoJsonLdPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const { enabled = true } = options
    if (!enabled) return incomingConfig
    // Plugin is utility-only — no config changes needed
    return incomingConfig
  }

// Export all utilities
export { buildProductJsonLd } from './utils/buildProductJsonLd'
export { buildBreadcrumbJsonLd } from './utils/buildBreadcrumbJsonLd'
export { buildItemListJsonLd } from './utils/buildItemListJsonLd'
export { buildWebSiteJsonLd, buildOrganizationJsonLd } from './utils/buildSiteJsonLd'

// Export types
export type {
  SeoJsonLdPluginOptions,
  ProductJsonLdOptions,
  BreadcrumbJsonLdOptions,
  ItemListJsonLdOptions,
  WebSiteJsonLdOptions,
  OrganizationJsonLdOptions,
} from './types'
