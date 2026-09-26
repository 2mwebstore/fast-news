<script setup lang="ts">
/**
 * Standalone pages: the policies, About, Contact (§93).
 *
 * One route for all of them, rendering rows the newsroom edits in the admin.
 * These used to be six Vue files, so a lawyer's wording change needed a deploy.
 *
 * This is a single-segment dynamic route at the root, which Nuxt matches only
 * after every static route, so /video, /search and friends still win. Anything
 * that is not a published page 404s rather than rendering an empty shell.
 */
interface PageDetail {
  slug: string
  titleKh: string
  titleEn?: string
  bodyKh: string
  bodyEn?: string
  metaDescKh?: string
  metaDescEn?: string
  hasEnglish: boolean
  updatedAt: string
}

const route = useRoute()
const api = useApi()
const { t, locale } = useLocale()
const { dateTime } = useFormat()

const slug = computed(() => String(route.params.slug))

const { data: page, error } = await useAsyncData(
  () => `page-${slug.value}`,
  () => api.get<PageDetail>(`/api/pages/${slug.value}`),
  { watch: [slug] },
)

if (error.value) throw pageError(error.value, 'Page not found')
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const isEnglish = computed(() => locale.value === 'en')

const title = computed(() =>
  isEnglish.value && page.value?.titleEn ? page.value.titleEn : page.value!.titleKh,
)

// Falls back to Khmer rather than showing an empty page: the document exists,
// it just has not been translated, and the notice below says so.
const body = computed(() =>
  isEnglish.value && page.value?.bodyEn ? page.value.bodyEn : page.value!.bodyKh,
)

const description = computed(() => {
  const p = page.value!
  return (isEnglish.value ? p.metaDescEn : p.metaDescKh) || p.metaDescKh || title.value
})

const showTranslationNotice = computed(() => isEnglish.value && !page.value?.hasEnglish)

useSiteSeo({
  title: title.value,
  description: description.value,
  path: `/${page.value.slug}`,
  // Policy pages are indexable but carry no images and change rarely.
  type: 'website',
})
</script>

<template>
  <div v-if="page" class="container-content max-w-prose py-2">
    <h1 class="text-kh-2xl font-bold sm:text-kh-3xl">{{ title }}</h1>

    <p class="mt-2 text-sm text-ink-muted">
      {{ t('policyUpdated') }} {{ dateTime(page.updatedAt) }}
    </p>

    <!-- Same treatment an article gets when a reader picks English and no
         English version was written. -->
    <p
      v-if="showTranslationNotice"
      class="mt-4 rounded-lg border border-line bg-surface-muted px-4 py-3 text-sm text-ink-muted"
      role="note"
    >{{ t('policyOnlyKhmer') }}</p>

    <!-- The body is sanitised server-side on every write, so what is stored can
         never contain a script even if an editor pasted one. -->
    <div class="article-body mt-6" v-html="body" />
  </div>
</template>
