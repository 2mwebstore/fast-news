<script setup lang="ts">
import type { CategoryDetail } from '~/types'

/**
 * Site footer (§91).
 *
 * Everything variable here comes from the API rather than the bundle: the
 * section list from /api/categories, and the tagline, contact details and
 * social profiles from /api/site, which an administrator edits in
 * Admin → Settings. Adding a Facebook page used to need a deploy.
 *
 * Social links render only when a URL is configured. An empty profile must not
 * become a dead link, and these feed Organization sameAs (§47) — claiming a
 * profile the newsroom does not own would be a false statement about identity.
 */
const { t, locale } = useLocale()
// Loaded once for the whole app by plugins/site.ts; the header and page
// titles read the same record.
const { info: site, name: siteName, nameEn } = useSite()

const { data: categories } = await useAsyncApi<CategoryDetail[]>('nav-categories', '/api/categories')

// Policy links come from the pages table, so adding or retiring one is an edit
// in the admin rather than a deploy. Only published pages flagged for the footer
// are returned.
interface PageLink { slug: string; titleKh: string; titleEn?: string }
const { data: pages } = await useAsyncApi<PageLink[]>('footer-pages', '/api/pages')

const year = new Date().getFullYear()

const tagline = computed(() =>
  locale.value === 'en'
    ? site.value?.taglineEn || site.value?.taglineKh || ''
    : site.value?.taglineKh || '',
)

const address = computed(() =>
  locale.value === 'en'
    ? site.value?.addressEn || site.value?.addressKh || ''
    : site.value?.addressKh || '',
)

function categoryName(category: CategoryDetail) {
  return locale.value === 'en' && category.nameEn ? category.nameEn : category.nameKh
}

// These are route-bound, so they stay in code — a link to /archive only makes
// sense while that page exists. Their labels come from the locale file.
const moreLinks = computed(() => [
  { path: '/live', label: t('live') },
  { path: '/video', label: t('videoNews') },
  { path: '/archive', label: t('archive') },
  { path: '/traffic', label: t('trafficStatus') },
  { path: '/tip', label: t('sendUsNews') },
])

const policyLinks = computed(() =>
  (pages.value ?? []).map(p => ({
    path: `/${p.slug}`,
    label: locale.value === 'en' && p.titleEn ? p.titleEn : p.titleKh,
  })),
)
</script>

<template>
  <footer class="mt-12 border-t border-line bg-surface-muted">
    <div class="container-content py-10">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div class="lg:col-span-1">
          <TheLogo class="[--logo-h:2.25rem]" />
          <p v-if="tagline" class="mt-3 text-kh-sm text-ink-muted khmer-wrap">{{ tagline }}</p>

          <ul v-if="site?.social?.length" class="mt-4 flex flex-wrap gap-3">
            <li v-for="link in site.social" :key="link.key">
              <a
                :href="link.url" target="_blank" rel="noopener me"
                class="text-sm font-medium text-brand hover:underline"
              >{{ link.label }}</a>
            </li>
          </ul>

          <address v-if="site?.contactEmail || site?.contactPhone || address" class="mt-4 space-y-1 text-xs not-italic text-ink-muted">
            <p v-if="address" class="khmer-wrap">{{ address }}</p>
            <p v-if="site?.contactEmail">
              <a :href="`mailto:${site.contactEmail}`" class="hover:text-brand">{{ site.contactEmail }}</a>
            </p>
            <p v-if="site?.contactPhone">
              <a :href="`tel:${site.contactPhone.replace(/\s/g, '')}`" class="hover:text-brand">{{ site.contactPhone }}</a>
            </p>
          </address>
        </div>

        <nav aria-labelledby="footer-sections">
          <h2 id="footer-sections" class="mb-3 text-kh-sm font-bold uppercase tracking-wide">
            {{ t('sections') }}
          </h2>
          <ul class="space-y-2">
            <li v-for="c in (categories ?? []).slice(0, 7)" :key="c.slug">
              <NuxtLink :to="`/category/${c.slug}`" class="text-kh-sm text-ink-muted hover:text-brand">
                {{ categoryName(c) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-more">
          <h2 id="footer-more" class="mb-3 text-kh-sm font-bold uppercase tracking-wide">
            {{ t('footerMore') }}
          </h2>
          <ul class="space-y-2">
            <li v-for="link in moreLinks" :key="link.path">
              <NuxtLink :to="link.path" class="text-kh-sm text-ink-muted hover:text-brand">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav v-if="policyLinks.length" aria-labelledby="footer-policy">
          <h2 id="footer-policy" class="mb-3 text-kh-sm font-bold uppercase tracking-wide">
            {{ t('footerPolicies') }}
          </h2>
          <ul class="space-y-2">
            <li v-for="link in policyLinks" :key="link.path">
              <NuxtLink :to="link.path" class="text-kh-sm text-ink-muted hover:text-brand">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} {{ nameEn }}. {{ t('allRightsReserved') }}</p>
        <p class="khmer-wrap">{{ siteName }}</p>
      </div>
    </div>
  </footer>
</template>
