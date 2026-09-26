/**
 * Date and number formatting.
 *
 * Khmer readers expect Khmer numerals in dates, so the Khmer formatter uses
 * the km-KH locale. Everything is formatted in Phnom Penh time regardless of
 * where the server or reader is, because a newsroom timestamp is local news
 * time — showing "15:30" to a reader in Phnom Penh when we mean 15:30 ICT is
 * the only correct behaviour.
 */
const TIMEZONE = 'Asia/Phnom_Penh'

export function useFormat() {
  function parse(value: string | null | undefined): Date | null {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  /** 15:30 — the timestamp shown on feed rows. */
  function time(value: string | null | undefined): string {
    const date = parse(value)
    if (!date) return ''
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TIMEZONE,
    }).format(date)
  }

  /** 25 កញ្ញា 2026 */
  function dateKh(value: string | null | undefined): string {
    const date = parse(value)
    if (!date) return ''
    return new Intl.DateTimeFormat('km-KH', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: TIMEZONE,
    }).format(date)
  }

  /** 25 Sep 2026 • 15:30 */
  function dateTime(value: string | null | undefined): string {
    const date = parse(value)
    if (!date) return ''
    const d = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: TIMEZONE,
    }).format(date)
    return `${d} • ${time(value)}`
  }

  /** "៥ នាទីមុន" for recent items, an absolute date beyond a day. */
  function relativeKh(value: string | null | undefined): string {
    const date = parse(value)
    if (!date) return ''

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'ឥឡូវនេះ'
    if (seconds < 3600) return `${khNumber(Math.floor(seconds / 60))} នាទីមុន`
    if (seconds < 86400) return `${khNumber(Math.floor(seconds / 3600))} ម៉ោងមុន`
    if (seconds < 172800) return 'ម្សិលមិញ'
    return dateKh(value)
  }

  /** Renders Western digits as Khmer numerals. */
  function khNumber(n: number): string {
    const digits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
    return String(n).replace(/\d/g, d => digits[Number(d)])
  }

  /** 12.4K / 1.2M for view counts. */
  function compact(n: number): string {
    if (n < 1000) return String(n)
    if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`
    return `${(n / 1_000_000).toFixed(1)}M`
  }

  /** mm:ss for a video duration. */
  function duration(seconds: number): string {
    if (!seconds || seconds < 0) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    if (m < 60) return `${m}:${String(s).padStart(2, '0')}`
    const h = Math.floor(m / 60)
    return `${h}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  /** The machine-readable datetime for a <time> element. */
  function iso(value: string | null | undefined): string {
    return parse(value)?.toISOString() ?? ''
  }

  return { time, dateKh, dateTime, relativeKh, khNumber, compact, duration, iso }
}
