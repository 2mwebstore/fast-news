// Shared API types. These mirror the Go DTOs in internal/controllers/dto.go —
// when one changes, change both.

export type ArticleStatus =
  | 'draft' | 'review' | 'approved' | 'scheduled'
  | 'published' | 'archived' | 'rejected'

export type ContentType = 'editorial' | 'sponsored' | 'advertisement' | 'paid'

export interface CategoryRef {
  id: number
  slug: string
  nameKh: string
  nameEn: string
  color?: string
  icon?: string
}

export interface AuthorRef {
  id: number
  slug: string
  nameKh: string
  nameEn?: string
  title?: string
  photoUrl?: string
}

export interface ArticleCard {
  id: number
  slug: string
  titleKh: string
  titleEn?: string
  summaryKh?: string
  imageUrl?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  imageIsAiGenerated?: boolean
  category?: CategoryRef
  author?: AuthorRef
  isBreaking: boolean
  isFeatured: boolean
  publishedAt: string | null
  readingMinutes: number
  viewCount: number
  contentType: ContentType
  sponsorName?: string
}

export interface CorrectionRef {
  noteKh: string
  noteEn?: string
  correctedAt: string
  editorName?: string
}

export interface SEORef {
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  robots?: string
}

export interface ArticleDetail extends ArticleCard {
  summaryEn?: string
  contentKh: string
  contentEn?: string
  imageCaption?: string
  tags?: { slug: string; nameKh: string; nameEn?: string }[]
  updatedAt: string
  updatedContentAt?: string
  wordCount: number
  sponsorUrl?: string
  hasEnglish: boolean
  aiSummary?: string[]
  aiSummaryAt?: string
  aiAssisted: boolean
  corrections?: CorrectionRef[]
  seo?: SEORef
}

export interface CategoryDetail extends CategoryRef {
  descKh?: string
  descEn?: string
  seoTitleKh?: string
  seoDescKh?: string
  seoTitleEn?: string
  seoDescEn?: string
  parent?: CategoryRef
  children?: CategoryRef[]
  articleCount: number
}

export interface VideoCard {
  id: number
  slug: string
  titleKh: string
  titleEn?: string
  descKh?: string
  thumbnailUrl?: string
  thumbnailAlt?: string
  // YouTube fields: the API returns the stored id plus URLs it builds itself,
  // so a page never reassembles an embed URL from an editor's paste.
  youtubeId?: string
  embedUrl?: string
  watchUrl?: string
  /** SEO overrides, present on the detail endpoint only. */
  seo?: SEORef
  sourceUrl?: string
  hlsUrl?: string
  durationSec: number
  width?: number
  height?: number
  isLive: boolean
  viewCount: number
  publishedAt: string | null
  category?: CategoryRef
}

export interface PulseEntry {
  categorySlug: string
  categoryKh: string
  categoryEn: string
  color: string
  score: number
  percent: number
}

export interface PulseResult {
  entries: PulseEntry[]
  window: string
  computedAt: string
  disclaimer: string
  disclaimerKh: string
}

export interface ServedAd {
  id: number
  position: string
  imageUrl: string
  htmlSnippet?: string
  targetUrl: string
  altText: string
  width: number
  height: number
  /** @deprecated Khmer-only; use labelKh/labelEn so the label follows the reader. */
  label: string
  labelKh: string
  labelEn: string
}

export interface AdSlotResponse {
  ad: ServedAd | null
  position: string
  enabled: boolean
  reservedWidth: number
  reservedHeight: number
}

export interface TrafficRoute {
  id: number
  routeKh: string
  routeEn: string
  level: 'normal' | 'moderate' | 'heavy'
  noteKh?: string
  sourceLabel: string
  observedAt: string
}

/**
 * The site's identity and footer details, from GET /api/site. An administrator
 * edits them in Admin → Settings; the runtime config supplies the defaults.
 */
export interface SiteInfo {
  nameEn: string
  nameKh: string
  /** Uploaded logo, or a path on the site. Empty means the built-in mark. */
  logoUrl: string
  /** Write the site name beside an uploaded logo (for icon-only logos). */
  logoShowName: boolean
  taglineKh: string
  taglineEn: string
  contactEmail: string
  contactPhone: string
  addressKh: string
  addressEn: string
  social: { key: string; label: string; url: string }[]
}

export interface ApiMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: ApiMeta
}

export interface ApiError {
  success: false
  message: string
  code: string
  fields?: Record<string, string>
}

// Breaking-news events pushed over the WebSocket (§7).
export type WsEventType =
  | 'breaking' | 'breaking_ended' | 'article' | 'trending' | 'traffic' | 'ping'

export interface WsEvent<T = unknown> {
  type: WsEventType
  payload?: T
  timestamp: string
}

export interface BreakingPayload {
  id: number
  slug: string
  titleKh: string
  titleEn?: string
  summaryKh?: string
  imageUrl?: string
  category?: string
  url: string
  publishedAt: string | null
  isBreaking: boolean
}
