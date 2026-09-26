<script setup lang="ts">
import type { ArticleCard } from '~/types'

/**
 * NewsCard is the single article presentation used across every feed.
 * `variant` changes the layout; the metadata shown stays consistent so a
 * sponsored item is labelled identically wherever it appears (§42).
 */
const props = withDefaults(defineProps<{
  article: ArticleCard
  variant?: 'grid' | 'list' | 'compact' | 'hero'
  /** Shows the leading timestamp used by the latest-news feed (§10). */
  showTime?: boolean
  /** Index for the numbered five-minute list (§11). */
  rank?: number
  /** Only the first card above the fold should load eagerly. */
  priority?: boolean
}>(), { variant: 'grid', showTime: false, priority: false })

const { time, relativeKh, compact } = useFormat()
const { title, summary, categoryName } = useLocale()

const href = computed(() => `/news/${props.article.slug}`)
const isSponsored = computed(() => props.article.contentType !== 'editorial')

// Alt text falls back to the headline rather than being left empty: a
// decorative-empty alt on a news photo is wrong for screen readers (§55).
const imageAlt = computed(() => props.article.imageAlt || title(props.article))

// Cards are fixed 16:9 so a grid never reflows as images arrive.
const aspect = '16 / 9'
</script>

<template>
  <article :class="['group', variant === 'compact' ? 'flex gap-3' : '']">
    <!-- ── Hero ──────────────────────────────────────────────────────── -->
    <!--
      The card is made clickable by stretching the headline link's
      pseudo-element over it, rather than wrapping everything in one anchor.
      Wrapping would nest the byline link inside the card link, which is
      invalid HTML and breaks hydration.
    -->
    <template v-if="variant === 'hero'">
      <div class="relative">
        <SmartImage
          :src="article.imageUrl"
          :alt="imageAlt"
          :width="article.imageWidth || 1200"
          :height="article.imageHeight || 675"
          :ratio="aspect"
          :priority="priority"
          img-class="transition-transform duration-300 group-hover:scale-[1.02]"
          class="rounded-lg"
        >
          <ArticleImageNotice v-if="article.imageIsAiGenerated" />
        </SmartImage>

        <div class="mt-4 space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <BreakingBadge v-if="article.isBreaking" />
            <span v-else-if="article.category" class="badge-category">
              {{ categoryName(article.category) }}
            </span>
            <SponsoredBadge v-if="isSponsored" :sponsor="article.sponsorName" />
          </div>

          <h2 class="text-kh-2xl font-bold leading-snug khmer-wrap sm:text-kh-3xl">
            <NuxtLink
              :to="href"
              class="after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
            >
              {{ title(article) }}
            </NuxtLink>
          </h2>

          <p v-if="summary(article)" class="line-clamp-2 text-kh-base text-ink-muted khmer-wrap">
            {{ summary(article) }}
          </p>

          <!-- z-10 lifts the byline above the stretched overlay so it stays
               independently clickable. -->
          <NewsCardMeta :article="article" class="relative z-10" />
        </div>
      </div>
    </template>

    <!-- ── Compact: a text row with a small thumbnail ─────────────────── -->
    <template v-else-if="variant === 'compact'">
      <span
        v-if="rank !== undefined"
        class="mt-0.5 w-7 shrink-0 text-lg font-extrabold tabular-nums text-brand/40"
      >{{ String(rank).padStart(2, '0') }}</span>

      <NuxtLink :to="href" class="flex min-w-0 flex-1 gap-3">
        <div class="min-w-0 flex-1">
          <div class="mb-1 flex flex-wrap items-center gap-2 text-xs">
            <time v-if="showTime && article.publishedAt" class="font-semibold tabular-nums text-ink-muted">
              {{ time(article.publishedAt) }}
            </time>
            <BreakingBadge v-if="article.isBreaking" small />
            <span v-else-if="article.category" class="text-brand">{{ categoryName(article.category) }}</span>
            <SponsoredBadge v-if="isSponsored" :sponsor="article.sponsorName" small />
          </div>
          <h3 class="line-clamp-2 text-kh-sm font-semibold leading-snug khmer-wrap group-hover:text-brand">
            {{ title(article) }}
          </h3>
        </div>

        <SmartImage
          v-if="article.imageUrl"
          :src="article.imageUrl" :alt="imageAlt"
          :width="96" :height="54" :ratio="aspect"
          class="w-20 shrink-0 rounded sm:w-24"
        />
      </NuxtLink>
    </template>

    <!-- ── List: image beside a headline and summary ──────────────────── -->
    <template v-else-if="variant === 'list'">
      <div class="relative flex w-full gap-3 sm:gap-4">
        <SmartImage
          :src="article.imageUrl" :alt="imageAlt"
          :width="article.imageWidth || 352" :height="article.imageHeight || 198"
          :ratio="aspect"
          img-class="transition-transform duration-300 group-hover:scale-[1.03]"
          class="w-28 shrink-0 rounded-lg sm:w-44"
        />

        <div class="min-w-0 flex-1">
          <div class="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
            <time v-if="showTime && article.publishedAt" class="font-semibold tabular-nums text-ink-muted">
              {{ time(article.publishedAt) }}
            </time>
            <BreakingBadge v-if="article.isBreaking" small />
            <span v-else-if="article.category" class="badge-category">{{ categoryName(article.category) }}</span>
            <SponsoredBadge v-if="isSponsored" :sponsor="article.sponsorName" small />
          </div>

          <h3 class="line-clamp-3 text-kh-base font-semibold leading-snug khmer-wrap sm:text-kh-lg">
            <NuxtLink
              :to="href"
              class="after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
            >
              {{ title(article) }}
            </NuxtLink>
          </h3>

          <p v-if="summary(article)" class="mt-1 hidden line-clamp-2 text-kh-sm text-ink-muted khmer-wrap sm:block">
            {{ summary(article) }}
          </p>

          <NewsCardMeta :article="article" class="relative z-10 mt-2 hidden sm:flex" />
        </div>
      </div>
    </template>

    <!-- ── Grid (default) ────────────────────────────────────────────── -->
    <template v-else>
      <NuxtLink :to="href" class="block">
        <SmartImage
          :src="article.imageUrl" :alt="imageAlt"
          :width="article.imageWidth || 640" :height="article.imageHeight || 360"
          :ratio="aspect" :priority="priority"
          img-class="transition-transform duration-300 group-hover:scale-[1.03]"
          class="rounded-lg"
        >
          <ArticleImageNotice v-if="article.imageIsAiGenerated" />
        </SmartImage>

        <div class="mt-3 space-y-1.5">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <BreakingBadge v-if="article.isBreaking" small />
            <span v-else-if="article.category" class="badge-category">{{ categoryName(article.category) }}</span>
            <SponsoredBadge v-if="isSponsored" :sponsor="article.sponsorName" small />
          </div>

          <h3 class="line-clamp-3 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand">
            {{ title(article) }}
          </h3>

          <div class="flex items-center gap-2 text-xs text-ink-muted">
            <time v-if="article.publishedAt" :datetime="article.publishedAt">
              {{ relativeKh(article.publishedAt) }}
            </time>
            <template v-if="article.viewCount > 0">
              <span aria-hidden="true">•</span>
              <span>{{ compact(article.viewCount) }}</span>
            </template>
          </div>
        </div>
      </NuxtLink>
    </template>
  </article>
</template>
