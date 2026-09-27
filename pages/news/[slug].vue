<script setup lang="ts">
import type { ArticleCard, ArticleDetail } from '~/types'

/**
 * Article page (§14).
 *
 * This is the page Google indexes, so it carries the full metadata set:
 * canonical, Open Graph, NewsArticle, BreadcrumbList and — only when a
 * translation exists — hreflang.
 */
const route = useRoute()
const api = useApi()
const { dateTime, iso, khNumber } = useFormat()
const { t, title, summary, body, missingTranslation, categoryName, isEnglish } = useLocale()

const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(
  `article-${slug.value}`,
  () => api.get<{ article: ArticleDetail; related: ArticleCard[] }>(`/api/news/${slug.value}`),
)

// A missing article must return a real 404 status, not a 200 with an error
// message — otherwise search engines index the error page. Anything that is
// not a 404 keeps its own status, so a transient failure is never reported as
// a removed article.
if (error.value) throw pageError(error.value, 'Article not found')
if (!data.value?.article) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const article = computed(() => data.value!.article)
const related = computed(() => data.value!.related ?? [])
const isSponsored = computed(() => article.value.contentType !== 'editorial')

const path = computed(() => `/news/${article.value.slug}`)

// Metadata falls back through editor overrides -> article fields -> derived
// text, so a published article always has a title and description (§58).
const seoTitle = computed(() => article.value.seo?.seoTitle || title(article.value))
const seoDescription = computed(() =>
  article.value.seo?.seoDescription || summary(article.value) || title(article.value),
)
const ogImage = computed(() => article.value.seo?.ogImage || article.value.imageUrl || undefined)

useSiteSeo({
  title: seoTitle.value,
  description: seoDescription.value,
  path: path.value,
  image: ogImage.value,
  imageAlt: article.value.imageAlt,
  type: 'article',
  robots: article.value.seo?.robots,
  publishedAt: article.value.publishedAt,
  modifiedAt: article.value.updatedContentAt || article.value.publishedAt,
})

useArticleSchema(article.value)
useHreflang(path.value, article.value.hasEnglish)
useBreadcrumbSchema([
  { name: t('home'), path: '/' },
  ...(article.value.category
    ? [{ name: article.value.category.nameKh, path: `/category/${article.value.category.slug}` }]
    : []),
  { name: article.value.titleKh, path: path.value },
])

// ── Reading-time beacon ────────────────────────────────────────────────
// Sent once on unload so the trending score reflects how long people actually
// read, not just that the page opened (§44).
const openedAt = ref(0)
onMounted(() => { openedAt.value = Date.now() })

function reportReadingTime() {
  if (!openedAt.value) return
  const seconds = Math.round((Date.now() - openedAt.value) / 1000)
  if (seconds < 3) return
  api.beacon(`/api/news/${article.value.slug}/view`, { readSeconds: Math.min(seconds, 3600) })
  openedAt.value = 0
}
onBeforeUnmount(reportReadingTime)
if (import.meta.client) {
  // visibilitychange fires on mobile where unload often does not.
  useEventListener(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') reportReadingTime()
  })
}
</script>

<template>
  <article v-if="article">
    <div class="container-content">
      <AdSlot position="ARTICLE_TOP" collapse-when-empty />
    </div>

    <div class="container-content grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <!-- ── Breadcrumb (§49) ──────────────────────────────────────── -->
        <nav :aria-label="t('breadcrumb')" class="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
          <NuxtLink to="/" class="hover:text-brand">{{ t('home') }}</NuxtLink>
          <template v-if="article.category">
            <span aria-hidden="true">›</span>
            <NuxtLink :to="`/category/${article.category.slug}`" class="hover:text-brand">
              {{ categoryName(article.category) }}
            </NuxtLink>
          </template>
        </nav>

        <!-- ── Header ───────────────────────────────────────────────── -->
        <header>
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <!-- No category badge here: the breadcrumb directly above already
                 names and links the section. -->
            <BreakingBadge v-if="article.isBreaking" />
            <SponsoredBadge v-if="isSponsored" :sponsor="article.sponsorName" />
          </div>

          <h1 class="text-kh-2xl font-bold leading-snug khmer-wrap sm:text-kh-3xl lg:text-kh-4xl">
            {{ title(article) }}
          </h1>

          <p v-if="summary(article)" class="mt-4 text-kh-lg text-ink-muted khmer-wrap">
            {{ summary(article) }}
          </p>

          <!-- Asking for English on a story that has none is a real state, so
               it is stated rather than silently showing Khmer. -->
          <p
            v-if="missingTranslation(article)"
            class="mt-3 rounded-lg border border-line bg-surface-muted px-3 py-2 text-sm text-ink-muted"
          >
            {{ t('noTranslation') }}
          </p>

          <!-- A paid placement is disclosed above the fold, not in a footnote. -->
          <div
            v-if="isSponsored"
            class="mt-4 rounded-lg border border-warning/40 bg-warning/5 p-3 text-kh-sm khmer-wrap"
          >
            {{ t('sponsoredBy') }}<strong v-if="article.sponsorName"> {{ article.sponsorName }}</strong>។
            {{ t('sponsoredDisclaimer') }}
          </div>

          <!-- Byline and dates. dateModified is only shown when the body was
               actually revised, so it is not implying an update that did not
               happen (§14). -->
          <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 text-sm">
            <NuxtLink
              v-if="article.author"
              :to="`/author/${article.author.slug}`"
              class="flex items-center gap-2 font-semibold hover:text-brand"
            >
              <img
                v-if="article.author.photoUrl"
                :src="article.author.photoUrl" :alt="article.author.nameKh"
                width="32" height="32" class="h-8 w-8 rounded-full object-cover" loading="lazy"
              >
              {{ article.author.nameKh }}
            </NuxtLink>

            <div class="flex flex-col gap-0.5 text-xs text-ink-muted">
              <time v-if="article.publishedAt" :datetime="iso(article.publishedAt)">
                {{ t('published') }}: {{ dateTime(article.publishedAt) }}
              </time>
              <time v-if="article.updatedContentAt" :datetime="iso(article.updatedContentAt)">
                {{ t('updated') }}: {{ dateTime(article.updatedContentAt) }}
              </time>
            </div>

            <span v-if="article.readingMinutes" class="text-xs text-ink-muted">
              {{ t('readMinutes', { n: isEnglish ? article.readingMinutes : khNumber(article.readingMinutes) }) }}
            </span>

          </div>
        </header>

        <!-- ── Main image (§55) ──────────────────────────────────────── -->
        <figure v-if="article.imageUrl" class="mt-6">
          <ImageViewer
            :src="article.imageUrl"
            :alt="article.imageAlt || title(article)"
            :caption="article.imageCaption"
            :ai-generated="article.imageIsAiGenerated"
          >
            <SmartImage
              :src="article.imageUrl"
              :alt="article.imageAlt || title(article)"
              :width="article.imageWidth || 1200"
              :height="article.imageHeight || 675"
              priority
              class="rounded-lg"
            >
              <ArticleImageNotice v-if="article.imageIsAiGenerated" />
            </SmartImage>
          </ImageViewer>
          <figcaption v-if="article.imageCaption" class="mt-2 text-sm text-ink-muted khmer-wrap">
            {{ article.imageCaption }}
          </figcaption>
        </figure>

        <!-- ── AI summary (§24) ──────────────────────────────────────── -->
        <AiSummary
          v-if="article.aiSummary?.length"
          :points="article.aiSummary"
          :generated-at="article.aiSummaryAt"
        />

        <!-- ── Corrections (§20) ─────────────────────────────────────── -->
        <CorrectionNotice v-if="article.corrections?.length" :corrections="article.corrections" />

        <!-- ── Body ──────────────────────────────────────────────────── -->
        <!-- The HTML is sanitised server-side on every save (§74); this is the
             only place it is rendered as markup. -->
        <div class="article-body mt-6" v-html="body(article)" />

        <div v-if="article.tags?.length" class="mt-8 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag.slug"
            :to="{ path: '/search', query: { tag: tag.slug } }"
            class="rounded-full border border-line px-3 py-1 text-kh-sm hover:border-brand hover:text-brand"
          >
            #{{ tag.nameKh }}
          </NuxtLink>
        </div>

        <AdSlot position="ARTICLE_MIDDLE" collapse-when-empty />

        <ArticleShare :article="article" class="mt-6 border-t border-line pt-5" expanded />

        <!-- ── Related (§62) ─────────────────────────────────────────── -->
        <section v-if="related.length" class="mt-10" aria-labelledby="related-heading">
          <SectionHeading id="related-heading" :title="t('relatedNews')" />
          <div class="grid gap-5 sm:grid-cols-2">
            <NewsCard v-for="item in related" :key="item.id" :article="item" variant="grid" />
          </div>
        </section>

        <AdSlot position="ARTICLE_BOTTOM" collapse-when-empty />
      </div>

      <!-- ── Sidebar ─────────────────────────────────────────────────── -->
      <aside class="space-y-8">
        <AdSlot position="ARTICLE_SIDEBAR" collapse-when-empty />
        <ArticleSidebarTrending />
        <FiveMinuteNews />
      </aside>
    </div>
  </article>
</template>
