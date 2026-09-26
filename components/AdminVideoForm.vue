<script setup lang="ts">
import type { AdminCategory } from '~/types/adminCategory'
import type { SEORef } from '~/types'

/**
 * Video editor.
 *
 * A video is a YouTube link plus editorial metadata. The link is parsed
 * server-side into a bare id, so whatever form an editor pastes — watch,
 * youtu.be, embed, Shorts — ends up as the same canonical record, and the
 * player we render is one we built rather than a URL we were handed.
 */
const props = defineProps<{ videoId?: number }>()

const api = useAdminApi()
const router = useRouter()
const { t } = useAdminLocale()

const form = reactive({
  titleKh: '', titleEn: '', descKh: '', descEn: '',
  youtubeUrl: '', categoryId: '' as string | number,
  durationSec: 0,
  thumbnailUrl: '', thumbnailAlt: '', slug: '',
})

// Same shape as the article SEO panel, so an editor who knows one knows both.
// Sent nested under `seo`; the API leaves stored metadata alone if the key is
// absent, so it is always included once the form has loaded.
const seo = reactive({
  seoTitle: '', seoDescription: '', seoKeywords: [] as string[],
  canonicalUrl: '', robots: '',
  ogTitle: '', ogDescription: '', ogImage: '',
  twitterTitle: '', twitterDescription: '', twitterImage: '',
})

const keywordText = computed({
  get: () => seo.seoKeywords.join(', '),
  set: (value: string) => {
    seo.seoKeywords = value.split(',').map(k => k.trim()).filter(Boolean)
  },
})

// The four combinations that are actually useful. An empty value means "use
// the site default", which is index,follow.
const robotsOptions = computed(() => [
  { value: '', label: t('robotsDefault') },
  { value: 'index,follow', label: 'index, follow' },
  { value: 'noindex,follow', label: 'noindex, follow' },
  { value: 'index,nofollow', label: 'index, nofollow' },
  { value: 'noindex,nofollow', label: 'noindex, nofollow' },
])

const categories = ref<AdminCategory[]>([])
const loading = ref(Boolean(props.videoId))
const saving = ref(false)
const message = ref('')
const errorMessage = ref('')
const currentId = ref<number | undefined>(props.videoId)
const youtubeId = ref('')

// Mirrors the server's parser so the editor sees the preview immediately,
// before saving. The server remains the authority.
const YOUTUBE_PATTERN = /(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/|\/v\/)([A-Za-z0-9_-]{11})/
function parseId(input: string): string {
  const trimmed = input.trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed
  return YOUTUBE_PATTERN.exec(trimmed)?.[1] ?? ''
}

watch(() => form.youtubeUrl, (value) => { youtubeId.value = parseId(value) })

// Same shape as the article form's control, so filing a video into a section
// works exactly like filing a story into one.
const categoryOptions = computed(() =>
  categories.value.map(c => ({
    value: c.id,
    // Show the parent so a subsection does not read like a top-level one.
    label: c.parentNameKh ? `${c.parentNameKh} › ${c.nameKh}` : c.nameKh,
    sub: c.inNav ? c.nameEn : `${c.nameEn} · hidden from nav`,
  })),
)

onMounted(async () => {
  categories.value = await api.get<AdminCategory[]>('/api/admin/categories')

  if (props.videoId) {
    try {
      const video = await api.get<Record<string, unknown>>(`/api/admin/videos/${props.videoId}`)
      Object.assign(form, {
        titleKh: video.titleKh, titleEn: video.titleEn ?? '',
        descKh: video.descKh ?? '', descEn: video.descEn ?? '',
        youtubeUrl: String(video.youtubeId ?? ''),
        categoryId: (video.category as { id?: number } | undefined)?.id ?? '',
        durationSec: Number(video.durationSec ?? 0),
        thumbnailUrl: String(video.thumbnailUrl ?? ''),
        thumbnailAlt: String(video.thumbnailAlt ?? ''),
        slug: String(video.slug ?? ''),
      })
      if (video.seo) Object.assign(seo, video.seo as SEORef)
      youtubeId.value = String(video.youtubeId ?? '')
    } finally {
      loading.value = false
    }
  }
})

async function save() {
  if (!youtubeId.value) {
    errorMessage.value = t('youtubeInvalid')
    return
  }

  saving.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    const payload = {
      ...form,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      durationSec: Number(form.durationSec) || 0,
      seo: { ...seo },
    }
    const result = currentId.value
      ? await api.put<{ id: number }>(`/api/videos/${currentId.value}`, payload)
      : await api.post<{ id: number }>('/api/videos', payload)

    currentId.value = result.id
    message.value = t('saved')
    if (!props.videoId) router.replace(`/admin/videos/${result.id}/edit`)
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not save the video.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>

  <form v-else class="grid gap-6 lg:grid-cols-3" @submit.prevent="save">
    <div class="space-y-4 lg:col-span-2">
      <div class="card space-y-4 p-5">
        <div>
          <label for="yt-url" class="mb-1 block text-sm font-medium">YouTube link *</label>
          <input
            id="yt-url"
            v-model="form.youtubeUrl"
            type="text"
            placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
            class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs" :class="youtubeId ? 'text-success' : 'text-ink-muted'">
            <template v-if="youtubeId">✓ Video id: <code>{{ youtubeId }}</code></template>
            <template v-else>{{ t('youtubeHint') }}</template>
          </p>
        </div>

        <div v-if="youtubeId">
          <span class="mb-1 block text-sm font-medium">Preview</span>
          <YouTubeEmbed :youtube-id="youtubeId" :title="form.titleKh || 'Preview'" />
        </div>

        <div>
          <label for="v-title-kh" class="mb-1 block text-sm font-medium">{{ t('titleKhLabel') }} *</label>
          <input
            id="v-title-kh" v-model="form.titleKh" required
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
          >
        </div>

        <div>
          <label for="v-title-en" class="mb-1 block text-sm font-medium">Title (English)</label>
          <input
            id="v-title-en" v-model="form.titleEn"
            class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
          >
        </div>

        <div>
          <label for="v-desc" class="mb-1 block text-sm font-medium">{{ t('descKhLabelVideo') }}</label>
          <textarea
            id="v-desc" v-model="form.descKh" rows="4"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
          />
        </div>
      </div>
            <!-- ── SEO (§58) ─────────────────────────────────────────────────── -->
      <!-- Same open card as the article form, so the two editors look and
           behave alike. The fields are overrides, but hiding them behind a
           disclosure meant an editor had to know they existed at all. -->
      <div class="card space-y-4 p-5">
        <h2 class="font-bold">SEO</h2>

        <div>
          <label for="v-seo-title" class="mb-1 block text-sm font-medium">
            {{ t('seoTitleLabel') }}
            <span class="font-normal text-ink-muted">({{ seo.seoTitle.length }}/60)</span>
          </label>
          <input
            id="v-seo-title" v-model="seo.seoTitle" maxlength="120"
            :placeholder="form.titleKh || t('seoFallbackTitle')"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">{{ t('seoOverrideHint') }}</p>
        </div>

        <div>
          <label for="v-seo-desc" class="mb-1 block text-sm font-medium">
            {{ t('seoDescLabel') }}
            <span class="font-normal text-ink-muted">({{ seo.seoDescription.length }}/155)</span>
          </label>
          <textarea
            id="v-seo-desc" v-model="seo.seoDescription" rows="2" maxlength="320"
            :placeholder="form.descKh || t('seoFallbackDesc')"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label for="v-seo-keywords" class="mb-1 block text-sm font-medium">{{ t('seoKeywords') }}</label>
          <input
            id="v-seo-keywords" v-model="keywordText" placeholder="kun khmer, phnom penh"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">{{ t('seoKeywordsHint') }}</p>
        </div>

        <div>
          <label for="v-canonical" class="mb-1 block text-sm font-medium">{{ t('canonicalUrl') }}</label>
          <input
            id="v-canonical" v-model="seo.canonicalUrl" type="url"
            class="w-full rounded-lg border border-line px-3 py-2 font-mono text-xs outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">{{ t('canonicalHint') }}</p>
        </div>

        <SelectField v-model="seo.robots" :options="robotsOptions" :label="t('robotsLabel')" />

        <details class="rounded-lg border border-line p-3">
          <summary class="cursor-pointer text-sm font-medium">{{ t('socialCards') }}</summary>
          <div class="mt-3 space-y-3">
            <input
              v-model="seo.ogTitle" :placeholder="t('ogTitle')"
              class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            >
            <textarea
              v-model="seo.ogDescription" rows="2" :placeholder="t('ogDescription')"
              class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <ImageField
              v-model="seo.ogImage"
              folder="video"
              :label="t('ogImage')"
              :hint="t('ogImageHint')"
              @error="errorMessage = $event"
            />
            <input
              v-model="seo.twitterTitle" :placeholder="t('twitterTitle')"
              class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            >
            <textarea
              v-model="seo.twitterDescription" rows="2" :placeholder="t('twitterDescription')"
              class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <ImageField
              v-model="seo.twitterImage"
              folder="video"
              :label="t('twitterImage')"
              :hint="t('twitterImageHint')"
              @error="errorMessage = $event"
            />
          </div>
        </details>
      </div>
    </div>

    <aside class="space-y-4">
      <div class="card space-y-3 p-5">
        <button
          type="submit" :disabled="saving || !youtubeId"
          class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >{{ saving ? t('saving') : t('save') }}</button>

        <p v-if="message" class="rounded bg-success/10 p-2 text-sm text-success">{{ message }}</p>
        <p v-if="errorMessage" class="rounded bg-breaking/10 p-2 text-sm text-breaking">{{ errorMessage }}</p>

        <NuxtLink to="/admin/videos" class="block text-center text-sm text-brand hover:underline">
          ← {{ t('videos') }}
        </NuxtLink>
      </div>

      <div class="card space-y-3 p-5">
        <!-- Searchable, matching the article form: the section list nests
             subcategories and is long enough that a plain dropdown is slow. -->
        <SearchableSelect
          v-model="form.categoryId"
          :options="categoryOptions"
          :label="t('section')"
          :placeholder="t('chooseSection')"
          :search-placeholder="t('searchSection')"
        />

        <div>
          <label for="v-duration" class="mb-1 block text-sm font-medium">{{ t('durationSeconds') }}</label>
          <input
            id="v-duration" v-model.number="form.durationSec" type="number" min="0"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
        </div>

        <ImageField
          v-model="form.thumbnailUrl"
          folder="video"
          :label="t('thumbnail')"
          placeholder="https://… (defaults to YouTube's poster)"
          :hint="t('thumbnailHint')"
          @error="errorMessage = $event"
        />

        <div>
          <label for="v-thumb-alt" class="mb-1 block text-sm font-medium">{{ t('altText') }}</label>
          <input
            id="v-thumb-alt" v-model="form.thumbnailAlt"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
        </div>
      </div>

    </aside>
  </form>
</template>
