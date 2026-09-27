import { MONTH_NAMES } from '~/composables/useLocale'

// The site launched in 2025; there is nothing older to offer.
const FIRST_YEAR = 2025

/**
 * The years and months a reader can filter by, shared by the archive and
 * search so both offer the same calendar.
 *
 * Newest first, and never a month that has not happened yet — a future month
 * can only ever be an empty page.
 */
export function useArchiveMonths() {
  const { locale } = useLocale()
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const years: number[] = []
  for (let y = currentYear; y >= FIRST_YEAR; y -= 1) years.push(y)

  function monthsOf(year: number) {
    const names = MONTH_NAMES[locale.value]
    const lastMonth = year === currentYear ? currentMonth : 12
    return Array.from({ length: lastMonth }, (_, i) => {
      const month = lastMonth - i
      return { year, month, name: names[month - 1], label: `${names[month - 1]} ${year}` }
    })
  }

  // All twelve months in calendar order, for a grid picker. Months still to
  // come are flagged rather than dropped so the grid keeps its shape.
  function monthGrid(year: number) {
    return MONTH_NAMES[locale.value].map((name, i) => ({
      month: i + 1,
      name,
      future: year > currentYear || (year === currentYear && i + 1 > currentMonth),
      current: year === currentYear && i + 1 === currentMonth,
    }))
  }

  return { currentYear, years, monthsOf, monthGrid }
}
