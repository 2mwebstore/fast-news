<script setup lang="ts">
/** Media library (§69). */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()

const api = useAdminApi()
const auth = useAuthStore()
const { dateTime } = useFormat()

interface MediaItem {
  id: number; url: string; filename: string; mimeType: string
  sizeBytes: number; width: number; height: number
  altKh: string; altEn: string; caption: string; credit: string
  folder: string; isAiGenerated: boolean; createdAt: string
}

const items = ref<MediaItem[]>([])
const loading = ref(true)
const uploading = ref(false)
const errorMessage = ref('')
const folder = ref('')
const editing = ref<MediaItem | null>(null)
const pendingDelete = ref<MediaItem | null>(null)
const deleting = ref(false)

async function load() {
  loading.value = true
  try {
    const result = await api.list<MediaItem[]>('/api/media', { folder: folder.value || undefined, limit: 60 })
    items.value = result.data ?? []
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(folder, load)

async function upload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return

  uploading.value = true
  errorMessage.value = ''
  try {
    for (const file of Array.from(files)) {
      const data = new FormData()
      data.append('file', file)
      data.append('folder', folder.value || 'article')
      await api.upload('/api/media/upload', data)
    }
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('uploadFailed')
  } finally {
    uploading.value = false
    ;(event.target as HTMLInputElement).value = ''
  }
}

async function saveMeta() {
  if (!editing.value) return
  await api.patch(`/api/media/${editing.value.id}`, {
    altKh: editing.value.altKh, altEn: editing.value.altEn,
    caption: editing.value.caption, credit: editing.value.credit,
  })
  editing.value = null
  await load()
}

// A browser confirm() gives no room to state consequences, and an image that
// is in use on a published article deserves that warning.
async function confirmDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  errorMessage.value = ''
  try {
    await api.del(`/api/media/${pendingDelete.value.id}`)
    pendingDelete.value = null
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not delete the file.'
  } finally {
    deleting.value = false
  }
}

function sizeLabel(bytes: number) {
  return bytes > 1 << 20 ? `${(bytes / (1 << 20)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

useHead({ title: 'Media — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">{{ t('mediaLibrary') }}</h1>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <select v-model="folder" class="rounded-lg border border-line px-3 py-2 text-sm">
        <option value="">{{ t('all') }}</option>
        <option value="article">{{ t('folderArticle') }}</option>
        <option value="author">{{ t('folderAuthor') }}</option>
        <option value="ad">{{ t('folderAd') }}</option>
        <option value="video">{{ t('folderVideo') }}</option>
        <option value="site">{{ t('folderSite') }}</option>
      </select>

      <label class="cursor-pointer rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
        {{ uploading ? t('uploading') : t('uploadFile') }}
        <input type="file" multiple accept="image/*,video/*" class="hidden" :disabled="uploading" @change="upload">
      </label>
    </div>

    <p v-if="errorMessage" class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>
    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!items.length" class="card py-12 text-center text-ink-muted">{{ t('noFiles') }}</p>

    <div v-else class="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <figure v-for="item in items" :key="item.id" class="card overflow-hidden">
        <img
          v-if="item.mimeType.startsWith('image/')"
          :src="item.url" :alt="item.altKh || item.filename"
          class="w-full bg-surface-muted object-cover" style="aspect-ratio:4/3" loading="lazy"
        >
        <div v-else class="flex items-center justify-center bg-surface-muted text-3xl" style="aspect-ratio:4/3">🎬</div>

        <figcaption class="p-2.5">
          <p class="truncate text-xs font-semibold" :title="item.filename">{{ item.filename }}</p>
          <p class="mt-0.5 text-[10px] text-ink-muted">
            {{ item.width }}×{{ item.height }} · {{ sizeLabel(item.sizeBytes) }}
          </p>
          <!-- Missing ALT text is surfaced here as well as in the SEO audit,
               because this is where it gets fixed. -->
          <p v-if="!item.altKh && !item.altEn" class="mt-1 text-[10px] font-semibold text-warning">
            {{ t('missingAlt') }}
          </p>
          <p v-if="item.isAiGenerated" class="mt-1 text-[10px] text-brand">{{ t('aiImageLabel') }}</p>

          <div class="mt-2 flex gap-1">
            <button class="flex-1 rounded border border-line px-2 py-1 text-[10px] hover:bg-surface-muted" @click="editing = { ...item }">
              {{ t('edit2') }}
            </button>
            <button
              v-if="auth.can('media.delete')"
              class="rounded border border-breaking px-2 py-1 text-[10px] text-breaking hover:bg-breaking/5"
              @click="pendingDelete = item"
            >{{ t('delete') }}</button>
          </div>
        </figcaption>
      </figure>
    </div>

    <ConfirmDialog
      :open="!!pendingDelete"
      title="Delete this file permanently?"
      :message="pendingDelete?.filename ?? ''"
      require-text="DELETE"
      :consequences="[
        'The file is removed from Cloudflare R2 and cannot be recovered.',
        'Any article still using it will show a broken image.',
        'Check where it is used before deleting.',
      ]"
      confirm-label="Delete file"
      :busy="deleting"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />

    <!-- ── Metadata editor ──────────────────────────────────────────────── -->
    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" @click.self="editing = null">
      <div class="w-full max-w-md rounded-xl bg-surface p-5">
        <h2 class="mb-3 font-bold">{{ t('editFileInfo') }}</h2>

        <img v-if="editing.mimeType.startsWith('image/')" :src="editing.url" alt="" class="mb-3 w-full rounded-lg">

        <div class="space-y-3">
          <div>
            <label class="mb-1 block text-sm font-semibold">{{ t('altTextKh') }}</label>
            <input v-model="editing.altKh" class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand">
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold">ALT text (English)</label>
            <input v-model="editing.altEn" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold">{{ t('imageCaption') }}</label>
            <input v-model="editing.caption" class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand">
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold">{{ t('credit') }}</label>
            <input v-model="editing.credit" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button class="flex-1 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark" @click="saveMeta">
            {{ t('save') }}
          </button>
          <button class="rounded-lg border border-line px-4 py-2 hover:bg-surface-muted" @click="editing = null">{{ t('cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
