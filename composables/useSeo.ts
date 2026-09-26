import type { ArticleDetail, CategoryDetail } from '~/types'

/**
 * SEO helpers. Everything indexable goes through one of these so no page can
 * ship without a title, description, canonical and Open Graph set (§45).
 */

interface BaseSeoInput {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  robots?: string
  lang?: 'km' | 'en'
  publishedAt?: string | null
  modifiedAt?: string | null

  // ── Editor overrides from the SEO panel (§58) ──────────────────────────
  // These exist because the admin offers them. Without them the fields would
  // be stored, editable, and silently ignored — worse than not offering them.

  /** Points elsewhere when this page is a duplicate of another URL. */
  canonical?: string
  keywords?: string[]
  /** Social titles default to the page title; an override lets a share read
   *  differently from the headline, which is a normal editorial choice. */
  ogTitle?: string
  ogDescription?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}

/**
 * Resolves the canonical URL, preferring a validated editor override.
 *
 * Silently ignoring a malformed override is the safe failure: emitting a broken
 * canonical tells crawlers to drop the page entirely, while falling back to the
 * derived URL is always correct, just not what was asked for.
 */
function resolveCanonical(siteUrl: string, path: string, override?: string): string {
  const derived = `${siteUrl}${path}`
  const value = override?.trim()
  if (!value) return derived

  if (value.startsWith('/')) return `${siteUrl}${value}`
  if (/^https?:\/\//i.test(value)) {
    try {
      return new URL(value).toString()
    } catch {
      return derived
    }
  }
  return derived
}

const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 675

export function useSiteSeo(input: BaseSeoInput) {
  const config = useRuntimeConfig()
  const { locale } = useLocale()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  // The canonical is the clean path by default. Tracking parameters are dropped
  // deliberately, so a link shared with ?utm_source= does not fragment the
  // page's indexing (§53).
  //
  // An editor override wins, because pointing at the original is the entire
  // purpose of the field on a syndicated or duplicated page. It is validated
  // first: a typo here deindexes the page, so anything that is not an absolute
  // URL or a site-relative path is ignored rather than emitted.
  const canonical = resolveCanonical(siteUrl, input.path, input.canonical)
  const image = input.image || `${siteUrl}/og-default.png`
  // A page can pin its language; otherwise it follows the reader's choice.
  // This has to stay reactive: switching language re-renders the chrome
  // instantly, and a `<html lang>` captured once would then describe the page
  // as Khmer while it displays English — wrong for screen readers and for
  // anything reading the document language.
  const lang = computed<'km' | 'en'>(() => input.lang || locale.value)

  useHead({
    htmlAttrs: { lang },
    title: input.title,
    link: [{ rel: 'canonical', href: canonical }],
  })

  useSeoMeta({
    title: input.title,
    description: input.description,
    robots: input.robots || 'index, follow, max-image-preview:large, max-snippet:-1',
    // Google ignores this, but Bing and several regional crawlers still read it,
    // and it costs one tag.
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,

    ogTitle: input.ogTitle || input.title,
    ogDescription: input.ogDescription || input.description,
    ogUrl: canonical,
    ogType: input.type || 'website',
    ogImage: image,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
    ogImageAlt: input.imageAlt || input.title,
    ogSiteName: config.public.siteName,
    ogLocale: () => (lang.value === 'km' ? 'km_KH' : 'en_US'),

    twitterCard: 'summary_large_image',
    twitterTitle: input.twitterTitle || input.ogTitle || input.title,
    twitterDescription: input.twitterDescription || input.ogDescription || input.description,
    twitterImage: input.twitterImage || image,

    articlePublishedTime: input.publishedAt || undefined,
    articleModifiedTime: input.modifiedAt || undefined,
  })

  return { canonical, siteUrl }
}

/** Injects one JSON-LD block. */
export function useJsonLd(schema: Record<string, unknown> | Record<string, unknown>[]) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        // JSON.stringify escapes the payload; Nuxt does not re-escape script
        // contents, so this is where injection would happen if we interpolated.
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}

/** Organization + WebSite, emitted once on the homepage (§47, §48). */
export function useOrganizationSchema(socialProfiles: string[] = []) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: config.public.siteName,
    alternateName: config.public.siteNameKh,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 600,
      height: 60,
    },
  }
  // sameAs is only emitted for profiles that actually exist (§47). An invented
  // profile URL is a factual error in structured data.
  if (socialProfiles.length > 0) organization.sameAs = socialProfiles

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.public.siteName,
    url: siteUrl,
    inLanguage: 'km',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  useJsonLd([organization, website])
}

/**
 * NewsArticle schema (§46). Every field is read from the article record —
 * nothing is invented, and a missing value is omitted rather than filled in.
 */
export function useArticleSchema(article: ArticleDetail) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const url = `${siteUrl}/news/${article.slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.titleKh,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: 'km',
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: config.public.siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png`, width: 600, height: 60 },
    },
  }

  if (article.summaryKh) schema.description = article.summaryKh
  if (article.publishedAt) schema.datePublished = article.publishedAt
  // dateModified only differs from datePublished when the body actually
  // changed — reporting a modification that did not happen is a false signal.
  schema.dateModified = article.updatedContentAt || article.publishedAt || article.updatedAt

  if (article.imageUrl) {
    schema.image = [
      {
        '@type': 'ImageObject',
        url: article.imageUrl,
        width: article.imageWidth || undefined,
        height: article.imageHeight || undefined,
      },
    ]
  }
  if (article.author) {
    schema.author = {
      '@type': 'Person',
      name: article.author.nameKh,
      url: `${siteUrl}/author/${article.author.slug}`,
    }
  }
  if (article.category) schema.articleSection = article.category.nameEn
  if (article.wordCount) schema.wordCount = article.wordCount
  if (article.tags?.length) schema.keywords = article.tags.map(t => t.nameEn || t.nameKh).join(', ')

  // Paid content is declared in the schema too, not only in the visible label.
  if (article.contentType !== 'editorial') {
    schema['@type'] = 'Article'
    schema.isAccessibleForFree = true
    if (article.sponsorName) {
      schema.sponsor = { '@type': 'Organization', name: article.sponsorName }
    }
  }

  useJsonLd(schema)
}

/** BreadcrumbList (§49). */
export function useBreadcrumbSchema(trail: { name: string; path: string }[]) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  })
}

/**
 * hreflang alternates. Only called when a translation genuinely exists —
 * advertising an alternate that 404s is worse than having none (§54).
 */
export function useHreflang(path: string, hasEnglish: boolean) {
  if (!hasEnglish) return
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  useHead({
    link: [
      { rel: 'alternate', hreflang: 'km', href: `${siteUrl}${path}` },
      { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en${path}` },
      { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}${path}` },
    ],
  })
}

/** Category page metadata, falling back to a derived description. */
export function useCategorySeo(category: CategoryDetail, page: number) {
  const title = category.seoTitleKh || `${category.nameKh} | ព័ត៌មានលឿនរហ័សកម្ពុជា`
  const description =
    category.seoDescKh ||
    category.descKh ||
    `ព័ត៌មាន${category.nameKh}ថ្មីៗ និងរហ័សបំផុតពី Cambodia Fast News`

  return useSiteSeo({
    title: page > 1 ? `${title} — ទំព័រ ${page}` : title,
    description,
    path: `/category/${category.slug}`,
    // Paginated pages beyond the first are followed but not indexed, so page 2
    // does not compete with page 1 for the same section.
    robots: page > 1 ? 'noindex, follow' : undefined,
  })
}
