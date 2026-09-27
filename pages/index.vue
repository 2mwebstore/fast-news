<script setup lang="ts">
import type { ArticleCard, CategoryDetail } from '~/types'

/**
 * Homepage (§6, §84, §85).
 *
 * Section order matches the spec. Everything above the fold is server-rendered
 * in one pass so the largest paint does not wait on client fetches; sections
 * further down are fetched in parallel with the same request.
 */
const config = useRuntimeConfig()
const { t, locale, categoryName } = useLocale()

// One parallel batch rather than sequential awaits: each of these is an
// independent endpoint, and waiting for them in series would add a full
// round-trip per section to time-to-first-byte.
const [{ data: featured }, { data: latest }, { data: trending }, { data: categories }] =
  await Promise.all([
    useAsyncApi<ArticleCard[]>('home-featured', '/api/featured', { limit: 5 }),
    useAsyncApi<ArticleCard[]>('home-latest', '/api/news', { limit: 12 }),
    useAsyncApi<ArticleCard[]>('home-trending', '/api/trending', { limit: 8 }),
    useAsyncApi<CategoryDetail[]>('nav-categories', '/api/categories'),
  ])

const hero = computed(() => featured.value?.[0] ?? null)
const secondary = computed(() => featured.value?.slice(1, 5) ?? [])

// The sections rendered as homepage blocks, in the order §6 lists them.
const homeSections = ['cambodia', 'business', 'sports', 'technology', 'entertainment']
const sectionsToRender = computed(() =>
  homeSections
    .map(slug => (categories.value ?? []).find(c => c.slug === slug))
    .filter((c): c is CategoryDetail => Boolean(c)),
)

const { nameEn, nameKh } = useSite()

useSiteSeo({
  // Already carries the brand, so the title template will not re-append it.
  // In English the name alone: "Name | Name" would repeat it.
  title: locale.value === 'en' ? nameEn.value : `${nameKh.value} | ${nameEn.value}`,
  description: t('homeDesc'),
  path: '/',
  image: `${config.public.siteUrl}/og-default.png`,
})

// Organization + WebSite live on the homepage only (§47, §48).
useOrganizationSchema()
</script>

<template>
  <div>
    <!-- Top leaderboard (§6) -->
    <div class="container-content">
      <AdSlot position="HOME_TOP" collapse-when-empty />
    </div>

    <!-- ── Featured (§9) ──────────────────────────────────────────────── -->
    <section v-if="hero" class="container-content" aria-labelledby="featured-heading">
      <h1 id="featured-heading" class="sr-only">{{ t('latestNews') }}</h1>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <!-- priority: this image is the largest contentful paint on the page. -->
          <NewsCard :article="hero" variant="hero" priority />
        </div>

        <div class="space-y-4 lg:border-l lg:border-line lg:pl-6">
          <NewsCard
            v-for="article in secondary"
            :key="article.id"
            :article="article"
            variant="compact"
          />
          <AdSlot position="HOME_SIDEBAR" collapse-when-empty class="hidden lg:flex" />
        </div>
      </div>
    </section>

    <div class="container-content">
      <AdSlot position="HOME_AFTER_HERO" collapse-when-empty />
    </div>

    <!-- ── Latest + sidebar (§6) ──────────────────────────────────────── -->
    <div class="container-content mt-8 grid gap-8 lg:grid-cols-3">
      <section class="lg:col-span-2" aria-labelledby="latest-heading">
        <SectionHeading id="latest-heading" :title="t('latestNews')" href="/archive" />

        <ul class="divide-y divide-line">
          <li v-for="(article, i) in latest ?? []" :key="article.id" v-reveal class="py-4 first:pt-0">
            <NewsCard :article="article" variant="list" show-time />

            <!-- One in-feed unit, placed mid-list rather than between every
                 pair, so the feed stays readable (§38). -->
            <AdSlot v-if="i === 4" position="HOME_IN_FEED" collapse-when-empty class="pt-4" />
          </li>
        </ul>

        <NuxtLink
          to="/archive"
          class="mt-6 block rounded-lg border border-line py-3 text-center text-kh-sm font-semibold hover:bg-surface-muted"
        >
          {{ t('loadMore') }}
        </NuxtLink>
      </section>

      <aside class="space-y-8">
        <TrendingList :articles="trending ?? []" />
        <FiveMinuteNews />
        <NewsPulse />
      </aside>
    </div>

    <!-- ── Category sections (§6) ─────────────────────────────────────── -->
    <div class="container-content mt-10 space-y-10">
      <template v-for="(section, i) in sectionsToRender" :key="section.slug">
        <CategorySection :category="section" />
        <AdSlot v-if="i === 1" position="HOME_IN_FEED" collapse-when-empty />
      </template>
    </div>

    <!-- ── Video (§26) ────────────────────────────────────────────────── -->
    <div class="container-content mt-10">
      <VideoSection />
    </div>
  </div>
</template>
