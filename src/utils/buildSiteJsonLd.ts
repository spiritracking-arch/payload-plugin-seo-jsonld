import type { WebSiteJsonLdOptions, OrganizationJsonLdOptions } from '../types'

/**
 * Generates Schema.org WebSite JSON-LD.
 * Place in your root layout for sitelinks searchbox eligibility.
 *
 * @example
 * const jsonLd = buildWebSiteJsonLd({ siteUrl, siteName: 'My Shop' })
 */
export function buildWebSiteJsonLd({
  siteUrl,
  siteName,
  description,
}: WebSiteJsonLdOptions): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: siteName,
    ...(description ? { description } : {}),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generates Schema.org Organization JSON-LD.
 * Place in your root layout.
 *
 * @example
 * const jsonLd = buildOrganizationJsonLd({ siteUrl, name: 'My Shop', logo: 'https://...' })
 */
export function buildOrganizationJsonLd({
  siteUrl,
  name,
  logo,
  description,
}: OrganizationJsonLdOptions): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: siteUrl,
    name,
    ...(description ? { description } : {}),
    ...(logo
      ? {
          logo: {
            '@type': 'ImageObject',
            url: logo,
          },
        }
      : {}),
  }
}
