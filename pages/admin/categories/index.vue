<script setup lang="ts">
import type { SelectOption } from '~/components/SelectField.vue'

/**
 * Section management (§13): the site's menu and its URL structure.
 *
 * A section is not just a label — /category/<slug> is a public, indexable
 * address, and every published article in the section hangs off it. So the
 * screen is built around three guards the API enforces too: a slug change
 * leaves a 301 behind, a section holding content cannot be deleted, and
 * "hidden" (isActive false) is offered as the safe alternative to deleting.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const { t, locale } = useAdminLocale()

interface AdminCategory {
  id: number
  slug: string
  nameKh: string
  nameEn: string
  inNav: boolean
  isActive: boolean
  parentId: number | null
  parentNameKh?: string
  parentNameEn?: string
  position: number
  icon?: string
  color?: string
  descKh?: string
  descEn?: string
  seoTitleKh?: string
  seoDescKh?: string
  seoTitleEn?: string
  seoDescEn?: string
  articleCount: number
  videoCount: number
}

const categories = ref<AdminCategory[]>([])
const loading = ref(true)
const errorMessage = ref('')
const notice = ref('')
const search = ref('')

function emptyForm() {
  return {
    nameKh: '', nameEn: '', slug: '',
    descKh: '', descEn: '',
    icon: '', color: '#C8102E', position: 0,
    inNav: true, isActive: true,
    parentId: '' as string | number,
    seoTitleKh: '', seoDescKh: '', seoTitleEn: '', seoDescEn: '',
  }
}

const form = ref(emptyForm())
const editingId = ref<number | null>(null)
const panelOpen = ref(false)
const saving = ref(false)

const deleteTarget = ref<AdminCategory | null>(null)
const deleting = ref(false)

function name(category: AdminCategory) {
  return locale.value === 'en' ? category.nameEn || category.nameKh : category.nameKh
}

function parentName(category: AdminCategory) {
  return locale.value === 'en'
    ? category.parentNameEn || category.parentNameKh
    : category.parentNameKh
}

// Client-side filtering: the whole tree is a couple of dozen rows, so a round
// trip per keystroke would be slower than the filter it replaces.
const rows = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return categories.value
  return categories.value.filter(category =>
    category.nameKh.toLowerCase().includes(term)
    || category.nameEn.toLowerCase().includes(term)
    || category.slug.includes(term),
  )
})

// Only top-level sections can be a parent: the public nav renders one level of
// nesting, so a grandchild would simply never appear. The API refuses it too.
const parentOptions = computed<SelectOption[]>(() => [
  { value: '', label: t('noParent') },
  ...categories.value
    .filter(category => category.parentId === null && category.id !== editingId.value)
    .map(category => ({ value: category.id, label: name(category) })),
])

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    // includeInactive so a hidden section can be found and brought back; the
    // article form calls the same endpoint without it and gets active only.
    categories.value = await api.get<AdminCategory[]>('/api/admin/categories', {
      includeInactive: 'true',
    })
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message
      || t('sectionsLoadFailed')
  } finally {
    loading.value = false
  }
}

function startCreate() {
  editingId.value = null
  form.value = emptyForm()
  // New sections go to the end of the menu rather than silently jumping to the
  // front, which position 0 would do.
  form.value.position = categories.value.length + 1
  panelOpen.value = true
  errorMessage.value = ''
}

function startEdit(category: AdminCategory) {
  editingId.value = category.id
  form.value = {
    nameKh: category.nameKh, nameEn: category.nameEn, slug: category.slug,
    descKh: category.descKh || '', descEn: category.descEn || '',
    icon: category.icon || '', color: category.color || '#C8102E',
    position: category.position,
    inNav: category.inNav, isActive: category.isActive,
    parentId: category.parentId ?? '',
    seoTitleKh: category.seoTitleKh || '', seoDescKh: category.seoDescKh || '',
    seoTitleEn: category.seoTitleEn || '', seoDescEn: category.seoDescEn || '',
  }
  panelOpen.value = true
  errorMessage.value = ''
}

function closePanel() {
  panelOpen.value = false
  editingId.value = null
  form.value = emptyForm()
}

const canSave = computed(() =>
  !saving.value && form.value.nameKh.trim() !== '' && form.value.nameEn.trim() !== '',
)

async function save() {
  if (!canSave.value) return
  saving.value = true
  errorMessage.value = ''
  notice.value = ''

  const body = {
    ...form.value,
    // An empty select means "top level", which the API expects as null rather
    // than the empty string the DOM hands back.
    parentId: form.value.parentId === '' ? null : Number(form.value.parentId),
  }

  try {
    if (editingId.value) {
      await api.put(`/api/admin/categories/${editingId.value}`, body)
    } else {
      await api.post('/api/admin/categories', body)
    }
    notice.value = t('saved')
    closePanel()
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message
      || t('sectionSaveFailed')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target) return
  deleting.value = true
  errorMessage.value = ''
  try {
    await api.del(`/api/admin/categories/${target.id}`)
    deleteTarget.value = null
    notice.value = t('saved')
    await load()
  } catch (e: unknown) {
    // The API refuses a delete that would orphan content and says why; that
    // message is more useful than anything generic, so show it verbatim.
    errorMessage.value = (e as { data?: { message?: string } }).data?.message
      || t('sectionDeleteFailed')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

/** Nudge a section up or down one place in the menu. */
async function move(category: AdminCategory, direction: -1 | 1) {
  const ordered = [...categories.value]
  const from = ordered.findIndex(c => c.id === category.id)
  const to = from + direction
  if (from < 0 || to < 0 || to >= ordered.length) return

  const [moved] = ordered.splice(from, 1)
  ordered.splice(to, 0, moved!)
  categories.value = ordered

  try {
    await api.put('/api/admin/categories/order', { order: ordered.map(c => c.id) })
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message
      || t('orderSaveFailed')
    await load()
  }
}

// Client-side only: the access token lives in the browser, so a server-side
// fetch here would 401 and bounce the operator to the login screen.
onMounted(load)

useHead({ title: `${t('sections')} · CFN Admin` })
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold">{{ t('sections') }}</h1>
        <p class="mt-1 max-w-2xl text-sm text-ink-muted">{{ t('sectionsIntro') }}</p>
      </div>
      <button type="button" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50" @click="startCreate">
        + {{ t('newSection') }}
      </button>
    </header>

    <p v-if="errorMessage" class="rounded-lg bg-breaking/10 px-4 py-3 text-sm text-breaking" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="notice" class="rounded-lg bg-brand/10 px-4 py-3 text-sm text-brand" role="status">
      {{ notice }}
    </p>

    <!-- Create / edit ------------------------------------------------------ -->
    <form v-if="panelOpen" class="card space-y-4 p-4" @submit.prevent="save">
      <h2 class="text-sm font-bold uppercase tracking-wide text-ink-muted">
        {{ editingId ? t('editSection') : t('newSection') }}
      </h2>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="c-name-kh" class="mb-1 block text-sm font-medium">{{ t('nameKhLabel') }} *</label>
          <input
            id="c-name-kh" v-model="form.nameKh" required
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"
          >
        </div>
        <div>
          <label for="c-name-en" class="mb-1 block text-sm font-medium">{{ t('nameEnLabel') }} *</label>
          <input
            id="c-name-en" v-model="form.nameEn" required
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
        </div>

        <div>
          <label for="c-slug" class="mb-1 block text-sm font-medium">{{ t('slugLabel') }}</label>
          <div class="flex items-center gap-1">
            <span class="shrink-0 text-sm text-ink-muted">/category/</span>
            <input
              id="c-slug" v-model="form.slug" placeholder="business"
              class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand"
            >
          </div>
          <p class="mt-1 text-xs text-ink-muted">{{ t('slugHint') }}</p>
        </div>

        <SelectField v-model="form.parentId" :options="parentOptions" :label="t('parentSection')" />

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label for="c-icon" class="mb-1 block text-sm font-medium">{{ t('iconLabel') }}</label>
            <input
              id="c-icon" v-model="form.icon" maxlength="4" placeholder="📈"
              class="w-full rounded-lg border border-line px-3 py-2 text-center text-sm outline-none focus:border-brand"
            >
          </div>
          <div>
            <label for="c-color" class="mb-1 block text-sm font-medium">{{ t('colorLabel') }}</label>
            <input
              id="c-color" v-model="form.color" type="color"
              class="h-[42px] w-full rounded-lg border border-line px-1 outline-none focus:border-brand"
            >
          </div>
          <div>
            <label for="c-position" class="mb-1 block text-sm font-medium">{{ t('positionLabel') }}</label>
            <input
              id="c-position" v-model.number="form.position" type="number" min="0"
              class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            >
          </div>
        </div>

        <div class="space-y-2 self-end">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.inNav" type="checkbox" class="rounded border-line">
            {{ t('showInNav') }}
          </label>
          <label class="flex items-start gap-2 text-sm">
            <input v-model="form.isActive" type="checkbox" class="mt-0.5 rounded border-line">
            <span>
              {{ t('activeSection') }}
              <span class="block text-xs text-ink-muted">{{ t('activeHint') }}</span>
            </span>
          </label>
        </div>

        <div>
          <label for="c-desc-kh" class="mb-1 block text-sm font-medium">{{ t('descKhLabel') }}</label>
          <textarea
            id="c-desc-kh" v-model="form.descKh" rows="2"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label for="c-desc-en" class="mb-1 block text-sm font-medium">{{ t('descEnLabel') }}</label>
          <textarea
            id="c-desc-en" v-model="form.descEn" rows="2"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      <details class="rounded-lg border border-line p-3">
        <summary class="cursor-pointer text-sm font-medium">{{ t('seoFields') }}</summary>
        <!-- "(ខ្មែរ)" and "(EN)" stay in their own language whatever the admin
             locale is: they name which language the field's content is in, not
             which language the interface is in. -->
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            v-model="form.seoTitleKh" :placeholder="`${t('seoTitleLabel')} (ខ្មែរ)`"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"
          >
          <input
            v-model="form.seoTitleEn" :placeholder="`${t('seoTitleLabel')} (EN)`"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
          <textarea
            v-model="form.seoDescKh" rows="2" :placeholder="`${t('seoDescLabel')} (ខ្មែរ)`"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"
          />
          <textarea
            v-model="form.seoDescEn" rows="2" :placeholder="`${t('seoDescLabel')} (EN)`"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </details>

      <div class="flex gap-2">
        <button type="submit" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50" :disabled="!canSave">
          {{ saving ? t('saving') : t('save') }}
        </button>
        <button type="button" class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted" @click="closePanel">{{ t('cancel') }}</button>
      </div>
    </form>

    <!-- List --------------------------------------------------------------- -->
    <SearchInput v-model="search" :placeholder="t('searchSections')" :label="t('search')" />

    <p v-if="loading" class="text-sm text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!rows.length" class="card p-6 text-center text-sm text-ink-muted">
      {{ search ? t('noResults') : t('noSections') }}
    </p>

    <div v-else class="card overflow-hidden">
      <ul class="divide-y divide-line">
        <li
          v-for="(category, index) in rows"
          :key="category.id"
          class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded text-base"
            :style="{ backgroundColor: `${category.color || '#C8102E'}1A`, color: category.color || '#C8102E' }"
            aria-hidden="true"
          >{{ category.icon || '⊞' }}</span>

          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-kh-sm font-semibold">
              <span v-if="category.parentId" class="text-ink-muted">{{ parentName(category) }} ›</span>
              {{ name(category) }}
              <span v-if="!category.isActive" class="rounded bg-ink/10 px-1.5 py-0.5 text-xs font-normal text-ink-muted">
                {{ t('hidden') }}
              </span>
            </p>

            <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <code class="font-mono">/category/{{ category.slug }}</code>
              <span>· {{ category.inNav ? t('inMenu') : t('notInMenu') }}</span>
              <span>· {{ t('articlesCount', { n: category.articleCount }) }}</span>
              <span v-if="category.videoCount">· {{ t('videosCount', { n: category.videoCount }) }}</span>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <!-- Reordering is disabled while a search is filtering the list:
                 the visible neighbours are not the real ones. -->
            <button
              type="button" class="rounded px-2 py-1 text-sm hover:bg-line disabled:opacity-30"
              :disabled="!!search || index === 0" aria-label="Move up"
              @click="move(category, -1)"
            >↑</button>
            <button
              type="button" class="rounded px-2 py-1 text-sm hover:bg-line disabled:opacity-30"
              :disabled="!!search || index === rows.length - 1" aria-label="Move down"
              @click="move(category, 1)"
            >↓</button>
            <button
              type="button"
              class="rounded-lg border border-line px-3 py-1 text-sm font-semibold hover:bg-surface-muted"
              @click="startEdit(category)"
            >
              {{ t('edit') }}
            </button>
            <button
              type="button" class="rounded px-2 py-1 text-sm text-breaking hover:bg-breaking/10"
              @click="deleteTarget = category"
            >{{ t('remove') }}</button>
          </div>
        </li>
      </ul>
    </div>

    <ConfirmDialog
      :open="!!deleteTarget"
      :title="t('deleteSectionTitle')"
      :message="deleteTarget ? t('deleteSectionMessage', { name: name(deleteTarget) }) : ''"
      :consequences="deleteTarget && (deleteTarget.articleCount || deleteTarget.videoCount)
        ? [t('sectionHasContent')]
        : []"
      :confirm-label="t('remove')"
      :cancel-label="t('cancel')"
      :busy="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
