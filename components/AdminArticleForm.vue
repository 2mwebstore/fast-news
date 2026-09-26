<script setup lang="ts">
import type { ArticleDetail } from '~/types'
import type { AdminArticleDetail } from '~/types/admin'
import type { AdminCategory } from '~/types/adminCategory'
import type { Checklist } from '~/types/admin'

/**
 * The article editor (§15, §58, §59).
 *
 * Publishing is not a save: the workflow buttons call the transition endpoint,
 * which enforces the §16 order server-side. Saving a draft never changes its
 * status.
 */
const props = defineProps<{ articleId?: number }>()

const api = useAdminApi()
const auth = useAuthStore()
const router = useRouter()
const { locale, t } = useAdminLocale()
const { meta, toOptions, requiresDisclosure, transitionsFrom, statusLabel } = useMeta()

const form = reactive({
  titleKh: '', titleEn: '', slug: '',
  summaryKh: '', summaryEn: '',
  contentKh: '', contentEn: '',
  categoryId: 0, authorId: null as number | null,
  imageUrl: '', imageAltKh: '', imageAltEn: '', imageCaption: '',
  imageWidth: 0, imageHeight: 0, imageIsAiGenerated: false,
  contentType: 'editorial' as ArticleDetail['contentType'],
  sponsorName: '', sponsorUrl: '',
  isBreaking: false, isFeatured: false, isPinned: false,
  scheduledAt: null as string | null,
  aiAssisted: false,
})

const seo = reactive({
  seoTitle: '', seoDescription: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', ogImage: '',
  twitterTitle: '', twitterDescription: '', twitterImage: '',
  seoKeywords: [] as string[], robots: '',
})

const keywordText = computed({
  get: () => seo.seoKeywords.join(', '),
  set: (value: string) => {
    seo.seoKeywords = value.split(',').map(k => k.trim()).filter(Boolean)
  },
})

// The four combinations worth offering. Empty means "use the site default".
const robotsOptions = computed(() => [
  { value: '', label: t('robotsDefault') },
  { value: 'index,follow', label: 'index, follow' },
  { value: 'noindex,follow', label: 'noindex, follow' },
  { value: 'index,nofollow', label: 'index, nofollow' },
  { value: 'noindex,nofollow', label: 'noindex, nofollow' },
])

const categories = ref<AdminCategory[]>([])
const status = ref<AdminArticleDetail['status']>('draft')
const checklist = ref<Checklist | null>(null)
const currentId = ref<number | undefined>(props.articleId)
const currentSlug = ref('')

const loading = ref(Boolean(props.articleId))
const saving = ref(false)
const message = ref('')
const errorMessage = ref('')
const aiBusy = ref(false)

const isPublished = computed(() => status.value === 'published')

onMounted(async () => {
  // The admin list, not the public one: /api/categories is nav-filtered, so
  // sections deliberately hidden from readers (Traffic, Economy) were not
  // selectable here at all.
  categories.value = await api.get<AdminCategory[]>('/api/admin/categories')

  if (props.articleId) {
    try {
      const result = await api.get<{ article: AdminArticleDetail; checklist: Checklist }>(
        `/api/admin/news/${props.articleId}`,
      )
      Object.assign(form, {
        titleKh: result.article.titleKh, titleEn: result.article.titleEn ?? '',
        slug: result.article.slug,
        summaryKh: result.article.summaryKh ?? '', summaryEn: result.article.summaryEn ?? '',
        contentKh: result.article.contentKh, contentEn: result.article.contentEn ?? '',
        categoryId: result.article.category?.id ?? 0,
        authorId: result.article.author?.id ?? null,
        imageUrl: result.article.imageUrl ?? '',
        imageAltKh: result.article.imageAlt ?? '',
        imageCaption: result.article.imageCaption ?? '',
        imageWidth: result.article.imageWidth ?? 0,
        imageHeight: result.article.imageHeight ?? 0,
        imageIsAiGenerated: result.article.imageIsAiGenerated ?? false,
        contentType: result.article.contentType,
        sponsorName: result.article.sponsorName ?? '',
        sponsorUrl: result.article.sponsorUrl ?? '',
        isBreaking: result.article.isBreaking,
        isFeatured: result.article.isFeatured,
        aiAssisted: result.article.aiAssisted,
      })
      if (result.article.seo) Object.assign(seo, result.article.seo)
      status.value = result.article.status
      checklist.value = result.checklist
      currentSlug.value = result.article.slug
    } finally {
      loading.value = false
    }
  }
})

async function save() {
  saving.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    const payload = { ...form, categoryId: Number(form.categoryId) }

    const result = currentId.value
      ? await api.put<AdminArticleDetail>(`/api/news/${currentId.value}`, payload)
      : await api.post<AdminArticleDetail>('/api/news', payload)

    currentId.value = result.id
    currentSlug.value = result.slug
    form.slug = result.slug
    status.value = result.status
    message.value = t('saved')

    if (!props.articleId) router.replace(`/admin/news/${result.id}/edit`)
    await refreshChecklist()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('saveFailed')
  } finally {
    saving.value = false
  }
}

async function saveSeo() {
  if (!currentId.value) return
  try {
    await api.put(`/api/admin/news/${currentId.value}/seo`, { ...seo, fromAi: false })
    message.value = t('seoSaved')
    await refreshChecklist()
  } catch {
    errorMessage.value = t('seoSaveFailed')
  }
}

async function transition(target: string) {
  if (!currentId.value) return
  errorMessage.value = ''
  try {
    const result = await api.post<AdminArticleDetail>(`/api/admin/news/${currentId.value}/status`, { status: target })
    status.value = result.status
    message.value = `${t('statusPrefix')} ${result.status}`
    await refreshChecklist()
  } catch (e: unknown) {
    // The server is the authority on the workflow, so its refusal text is
    // shown verbatim — it names exactly what is missing.
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('statusChangeFailed')
  }
}

async function refreshChecklist() {
  if (!currentId.value) return
  try {
    const result = await api.get<{ checklist: Checklist }>(`/api/admin/news/${currentId.value}`)
    checklist.value = result.checklist
  } catch { /* the checklist is advisory; a failure here is not worth an error */ }
}

/** AI SEO suggestions (§23) — saved as unreviewed until an editor saves them. */
async function suggestSeo() {
  aiBusy.value = true
  errorMessage.value = ''
  try {
    const result = await api.post<{ draft: Record<string, string | string[]> }>('/api/ai/generate-seo', {
      articleId: currentId.value,
      titleKh: form.titleKh, titleEn: form.titleEn,
      summary: form.summaryKh, body: form.contentKh,
    })
    const draft = result.draft
    seo.seoTitle = String(draft.seoTitle ?? seo.seoTitle)
    seo.seoDescription = String(draft.seoDescription ?? seo.seoDescription)
    seo.ogTitle = String(draft.ogTitle ?? seo.ogTitle)
    seo.ogDescription = String(draft.ogDescription ?? seo.ogDescription)
    seo.seoKeywords = (draft.keywords as string[]) ?? seo.seoKeywords
    if (!form.imageAltKh && draft.imageAlt) form.imageAltKh = String(draft.imageAlt)
    message.value = t('aiSuggestedSeo')
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('aiUnavailable')
  } finally {
    aiBusy.value = false
  }
}

// Intrinsic size, whether the image was uploaded or linked. It reserves the
// slot in the article layout, so a missing value means a shifting page.
function onImageNatural(size: { width: number; height: number }) {
  form.imageWidth = size.width
  form.imageHeight = size.height
}

// Which transitions exist comes from the API's own workflow table, so a change
// to the editorial flow does not need mirroring here. Permissions still gate
// them: a journalist may submit for review but not publish.
const permissionForStatus: Record<string, string> = {
  review: 'news.edit',
  approved: 'news.review',
  rejected: 'news.review',
  published: 'news.publish',
  scheduled: 'news.publish',
  archived: 'news.publish',
  draft: 'news.edit',
}

const primaryStatus: Record<string, string> = {
  draft: 'review', rejected: 'review', review: 'approved',
  approved: 'published', scheduled: 'published', published: '',
}

const availableTransitions = computed(() =>
  transitionsFrom(status.value)
    .filter(target => auth.can(permissionForStatus[target] ?? 'news.edit'))
    .map(target => ({
      target,
      label: statusLabel(target, locale.value),
      primary: primaryStatus[status.value] === target,
    })),
)

const contentTypeOptions = computed(() => toOptions(meta.value?.contentTypes, locale.value))

const contentTypeHint = computed(() =>
  meta.value?.contentTypes?.find(o => o.value === form.contentType)?.hint ?? '',
)

const needsSponsor = computed(() => requiresDisclosure(form.contentType))

const categoryOptions = computed(() =>
  categories.value.map(c => ({
    value: c.id,
    // Show the parent so a subsection does not read like a top-level one.
    label: c.parentNameKh ? `${c.parentNameKh} › ${c.nameKh}` : c.nameKh,
    sub: c.inNav ? c.nameEn : `${c.nameEn} · hidden from nav`,
  })),
)

</script>

<template>
  <div v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</div>

  <form v-else class="grid gap-6 lg:grid-cols-3" @submit.prevent="save">
    <!-- ── Main column ─────────────────────────────────────────────────── -->
    <div class="space-y-4 lg:col-span-2">
      <div class="card space-y-4 p-5">
        <div>
          <label for="titleKh" class="mb-1 block text-sm font-semibold">{{ t('headlineKh') }} *</label>
          <input
            id="titleKh" v-model="form.titleKh" required
            class="w-full rounded-lg border border-line px-3 py-2.5 text-kh-lg outline-none focus:border-brand"
          >
        </div>

        <div>
          <label for="titleEn" class="mb-1 block text-sm font-semibold">Headline (English)</label>
          <input
            id="titleEn" v-model="form.titleEn"
            class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">
            {{ t('slugHintArticle') }}
          </p>
        </div>

        <div>
          <label for="summaryKh" class="mb-1 block text-sm font-semibold">{{ t('summaryKh') }}</label>
          <textarea
            id="summaryKh" v-model="form.summaryKh" rows="3"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
          />
        </div>

        <div>
          <label for="contentKh" class="mb-1 block text-sm font-semibold">{{ t('bodyKh') }} *</label>
          <AdminRichText v-model="form.contentKh" />
        </div>
      </div>

      <!-- ── SEO panel (§58) ───────────────────────────────────────────── -->
      <div class="card space-y-4 p-5">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">SEO</h2>
          <button
            v-if="auth.can('ai.use')" type="button" :disabled="aiBusy"
            class="rounded-lg border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-50"
            @click="suggestSeo"
          >{{ aiBusy ? t('processing') : t('suggestWithAiShort') }}</button>
        </div>

        <div>
          <label for="seoTitle" class="mb-1 block text-sm font-semibold">
            {{ t('seoTitleLabel') }}
            <span class="font-normal text-ink-muted">({{ seo.seoTitle.length }}/60)</span>
          </label>
          <input
            id="seoTitle" v-model="seo.seoTitle" maxlength="120"
            :placeholder="form.titleKh || t('seoFallbackTitle')"
            class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">{{ t('seoOverrideHint') }}</p>
        </div>

        <div>
          <label for="seoDescription" class="mb-1 block text-sm font-semibold">
            {{ t('seoDescLabel') }}
            <span class="font-normal text-ink-muted">({{ seo.seoDescription.length }}/155)</span>
          </label>
          <textarea
            id="seoDescription" v-model="seo.seoDescription" rows="2" maxlength="320"
            :placeholder="form.summaryKh || t('seoFallbackDesc')"
            class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
          />
        </div>

        <div>
          <label for="seoKeywords" class="mb-1 block text-sm font-semibold">{{ t('seoKeywords') }}</label>
          <input
            id="seoKeywords" v-model="keywordText" placeholder="kun khmer, phnom penh"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">{{ t('seoKeywordsHint') }}</p>
        </div>

        <div>
          <label for="canonicalUrl" class="mb-1 block text-sm font-semibold">{{ t('canonicalUrl') }}</label>
          <input
            id="canonicalUrl" v-model="seo.canonicalUrl" type="url"
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
              folder="article"
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
              folder="article"
              :label="t('twitterImage')"
              :hint="t('twitterImageHint')"
              @error="errorMessage = $event"
            />
          </div>
        </details>

        <button
          type="button" :disabled="!currentId"
          class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted disabled:opacity-50"
          @click="saveSeo"
        >{{ t('saveSeoLabel') }}</button>
      </div>
    </div>

    <!-- ── Sidebar ─────────────────────────────────────────────────────── -->
    <aside class="space-y-4">
      <div class="card space-y-3 p-5">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">{{ t('status') }}</span>
          <AdminStatusBadge :status="status" />
        </div>

        <button
          type="submit" :disabled="saving"
          class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >{{ saving ? t('saving') : t('save') }}</button>

        <button
          v-for="option in availableTransitions" :key="option.target"
          type="button"
          :class="[
            'w-full rounded-lg px-4 py-2.5 font-semibold',
            option.primary ? 'bg-success text-white hover:opacity-90' : 'border border-line hover:bg-surface-muted',
          ]"
          @click="transition(option.target)"
        >{{ option.label }}</button>

        <p v-if="message" class="rounded bg-success/10 p-2 text-sm text-success">{{ message }}</p>
        <p v-if="errorMessage" class="rounded bg-breaking/10 p-2 text-sm text-breaking">{{ errorMessage }}</p>

        <NuxtLink
          v-if="isPublished && currentSlug" :to="`/news/${currentSlug}`" target="_blank"
          class="block rounded-lg border border-line px-4 py-2 text-center text-sm hover:bg-surface-muted"
        >{{ t('viewOnSite') }}</NuxtLink>
      </div>

      <!-- ── Checklist (§59) ───────────────────────────────────────────── -->
      <div v-if="checklist" class="card p-5">
        <h2 class="mb-2 text-sm font-bold">{{ t('publishChecklist') }}</h2>
        <p class="mb-3 text-xs" :class="checklist.readyToPublish ? 'text-success' : 'text-warning'">
          {{ checklist.completed }}/{{ checklist.total }}
          · {{ checklist.readyToPublish ? t('readyToPublish') : t('missingRequired') }}
        </p>
        <ul class="space-y-1.5">
          <li v-for="item in checklist.items" :key="item.key" class="flex items-center gap-2 text-sm">
            <span :class="item.done ? 'text-success' : 'text-ink-muted'" aria-hidden="true">
              {{ item.done ? '✓' : '○' }}
            </span>
            <span :class="item.done ? '' : 'text-ink-muted'">
              {{ item.label }}<span v-if="item.required && !item.done" class="text-breaking"> *</span>
            </span>
          </li>
        </ul>
        <p class="mt-3 border-t border-line pt-2 text-xs text-ink-muted">{{ checklist.note }}</p>
      </div>

      <!-- ── Placement ─────────────────────────────────────────────────── -->
      <div class="card space-y-3 p-5">
        <!-- Searchable: the section list nests subcategories and is long
             enough that scanning a plain dropdown is slow. -->
        <SearchableSelect
          v-model="form.categoryId"
          :options="categoryOptions"
          :label="t('section')"
          required
          :clearable="false"
          :placeholder="t('chooseSection')"
          :search-placeholder="t('searchSection')"
        />

        <SelectField
          v-model="form.contentType"
          :options="contentTypeOptions"
          :label="t('contentTypeLabel')"
        />
        <p v-if="contentTypeHint" class="-mt-1 text-xs text-ink-muted khmer-wrap">{{ contentTypeHint }}</p>

        <!-- The sponsor name is required to publish anything non-editorial,
             because it is what the disclosure label prints (§42). Which types
             need it comes from the API, so adding one does not mean editing
             this condition. -->
        <div v-if="needsSponsor">
          <label for="sponsorName" class="mb-1 block text-sm font-semibold">{{ t('sponsorName') }} *</label>
          <input
            id="sponsorName" v-model="form.sponsorName"
            class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
          >
        </div>

        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.isFeatured" type="checkbox" class="rounded border-line"> {{ t('featureArticle') }}
        </label>
        <label v-if="auth.can('news.publish')" class="flex items-center gap-2 text-sm">
          <input v-model="form.isBreaking" type="checkbox" class="rounded border-line">
          <span class="font-semibold text-breaking">{{ t('breakingArticle') }}</span>
        </label>

        <div>
          <label for="scheduledAt" class="mb-1 block text-sm font-semibold">{{ t('scheduleAt') }}</label>
          <input
            id="scheduledAt" v-model="form.scheduledAt" type="datetime-local"
            class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
          >
        </div>
      </div>

      <!-- ── Image (§55) ───────────────────────────────────────────────── -->
      <div class="card space-y-3 p-5">
        <h2 class="text-sm font-bold">{{ t('mainImage') }}</h2>

        <ImageField
          v-model="form.imageUrl"
          folder="article"
          :max-size-mb="10"
          ratio="16 / 9"
          @natural="onImageNatural"
          @error="errorMessage = $event"
        />

        <div>
          <label for="imageAltKh" class="mb-1 block text-sm font-semibold">ALT text *</label>
          <input
            id="imageAltKh" v-model="form.imageAltKh"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">{{ t('altRequired') }}</p>
        </div>

        <label class="flex items-start gap-2 text-sm">
          <input v-model="form.imageIsAiGenerated" type="checkbox" class="mt-0.5 rounded border-line">
          <span>{{ t('aiImage') }}
            <span class="block text-xs text-ink-muted">{{ t('aiImageHint') }}</span>
          </span>
        </label>
      </div>
    </aside>
  </form>
</template>
