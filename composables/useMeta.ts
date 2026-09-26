/**
 * Option lists for forms and filters, served by /api/meta.
 *
 * These were hard-coded arrays in each page, which meant adding a content type
 * or a workflow status produced a dropdown that disagreed with what the API
 * would accept. The endpoint derives them from the same Go constants the
 * validation uses, so the two cannot drift.
 *
 * Fetched once and shared: the payload is reference data and does not change
 * between page views.
 */
export interface MetaOption {
  value: string
  labelKh: string
  labelEn: string
  hint?: string
}

export interface ContentTypeOption extends MetaOption {
  requiresDisclosure: boolean
}

export interface StatusMetaOption extends MetaOption {
  isPublic: boolean
  canMoveTo: string[] | null
}

export interface PlatformMeta {
  contentTypes: ContentTypeOption[]
  articleStatuses: StatusMetaOption[]
  videoStatuses: MetaOption[]
  sourceTypes: MetaOption[]
  verificationStatuses: MetaOption[]
  trafficLevels: MetaOption[]
  pushTopics: MetaOption[]
  adPositions: MetaOption[]
  roles: MetaOption[]
}

export function useMeta() {
  // Keyed so every component shares one request per page load.
  const { data, refresh } = useAsyncApi<PlatformMeta>('platform-meta', '/api/meta')

  /** Picks the label for the admin's current interface language. */
  function label(option?: MetaOption | null, locale: 'km' | 'en' = 'en'): string {
    if (!option) return ''
    return locale === 'km' ? option.labelKh : (option.labelEn || option.labelKh)
  }

  /** Converts meta options into the shape SelectField/SearchableSelect want. */
  function toOptions(
    list: MetaOption[] | undefined,
    locale: 'km' | 'en' = 'en',
  ): { value: string; label: string; sub?: string }[] {
    return (list ?? []).map(option => ({
      value: option.value,
      label: label(option, locale),
      // Show the other language as secondary text, so an operator working in
      // English still recognises what an editor sees in Khmer.
      sub: locale === 'km' ? option.labelEn : option.labelKh,
    }))
  }

  function contentType(value: string): ContentTypeOption | undefined {
    return data.value?.contentTypes?.find(o => o.value === value)
  }

  /** Whether a content type must carry a sponsor label (§42). */
  function requiresDisclosure(value: string): boolean {
    return contentType(value)?.requiresDisclosure ?? value !== 'editorial'
  }

  /** Statuses this article may legally move to, from the API's own table. */
  function transitionsFrom(status: string): string[] {
    return data.value?.articleStatuses?.find(o => o.value === status)?.canMoveTo ?? []
  }

  function statusLabel(value: string, locale: 'km' | 'en' = 'en'): string {
    const match = data.value?.articleStatuses?.find(o => o.value === value)
      ?? data.value?.videoStatuses?.find(o => o.value === value)
    return label(match, locale) || value
  }

  return { meta: data, refresh, label, toOptions, contentType, requiresDisclosure, transitionsFrom, statusLabel }
}
