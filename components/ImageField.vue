<script setup lang="ts">
import type { UploadedFile } from '~/components/FileUpload.vue'

/**
 * One image input, two ways to fill it: upload a file, or paste a link.
 *
 * Both routes end at the same place — a URL in the model — so nothing
 * downstream has to care which was used. The distinction that does matter is
 * where the file lives: an upload goes to our own R2 bucket and will still be
 * there next year, while a pasted link depends on somebody else's server and
 * can rot or be swapped for something else. The hint says so rather than
 * leaving an editor to find out.
 *
 * `natural` reports the image's intrinsic pixel size for both routes. The ad
 * creative form needs it to reserve slot space, and measuring a pasted link in
 * the browser saves an editor typing numbers they would have to look up.
 */
const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{
  label?: string
  /** Media library folder: article | author | ad | video | tip. */
  folder?: string
  maxSizeMb?: number
  /** Ratio for the preview box, matching where the image will be used. */
  ratio?: string
  placeholder?: string
  hint?: string
  /** Rendered under the label, e.g. to mark the field required. */
  required?: boolean
}>(), {
  folder: 'article',
  maxSizeMb: 10,
  ratio: '16 / 9',
  placeholder: 'https://…',
  required: false,
})

const emit = defineEmits<{
  /** The image's intrinsic size, once known. */
  natural: [size: { width: number; height: number }]
  error: [message: string]
  /** Fired only for an upload, carrying the full media record. */
  uploaded: [file: UploadedFile]
}>()

type Mode = 'upload' | 'link'
const mode = ref<Mode>('upload')

// A value that is already set almost always came from somewhere; open on the
// link tab so it is visible and editable rather than hidden behind a tab.
onMounted(() => {
  if (model.value) mode.value = 'link'
})

const failed = ref(false)
watch(model, () => { failed.value = false })

function onUploaded(file: UploadedFile) {
  model.value = file.url
  if (file.width && file.height) {
    emit('natural', { width: file.width, height: file.height })
  }
  emit('uploaded', file)
}

// For a pasted link the server never sees the file, so the browser is the only
// thing that can report its size.
function onPreviewLoad(event: Event) {
  const img = event.target as HTMLImageElement
  failed.value = false
  if (img.naturalWidth && img.naturalHeight) {
    emit('natural', { width: img.naturalWidth, height: img.naturalHeight })
  }
}

function clear() {
  model.value = ''
  failed.value = false
}

const inputId = useId()
const { t } = useAdminLocale()

// Shown only while the Link tab is open. Guessing from the URL's origin was
// the other option, but an upload lands on the R2 bucket host, which matches
// neither apiBase nor siteUrl — so every upload would be mislabelled external.
const showExternalNote = computed(() =>
  mode.value === 'link' && /^https?:\/\//i.test(model.value.trim()),
)
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-end justify-between gap-2">
      <label v-if="label" :for="inputId" class="block text-sm font-semibold">
        {{ label }}<span v-if="required" class="text-breaking"> *</span>
      </label>

      <!-- Tabs, not a dropdown: two options, both worth seeing at once. -->
      <div class="flex overflow-hidden rounded-lg border border-line text-xs font-semibold" role="tablist">
        <button
          v-for="tab in (['upload', 'link'] as Mode[])"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="mode === tab"
          :class="[
            'px-3 py-1.5 transition-colors',
            mode === tab ? 'bg-brand text-white' : 'bg-surface hover:bg-surface-muted',
          ]"
          @click="mode = tab"
        >{{ tab === 'upload' ? t('upload') : t('link') }}</button>
      </div>
    </div>

    <!-- Preview sits above both tabs: whichever route filled the field, this
         is the thing that will actually be published. -->
    <div v-if="model" class="relative">
      <div
        class="overflow-hidden rounded-lg border border-line bg-surface-muted"
        :style="{ aspectRatio: ratio }"
      >
        <img
          v-if="!failed"
          :src="model" alt=""
          class="h-full w-full object-cover"
          @load="onPreviewLoad"
          @error="failed = true"
        >
        <p v-else class="flex h-full items-center justify-center px-4 text-center text-xs text-breaking">
          {{ t('imageLoadFailed') }}
        </p>
      </div>

      <button
        type="button"
        class="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs font-semibold text-white hover:bg-ink"
        @click="clear"
      >{{ t('removeImage') }}</button>

      <p v-if="showExternalNote" class="mt-1 text-xs text-ink-muted">
        {{ t('hostedElsewhere') }}
      </p>
    </div>

    <FileUpload
      v-if="mode === 'upload'"
      :folder="folder"
      accept="image/*"
      :max-size-mb="maxSizeMb"
      :show-preview="false"
      @uploaded="onUploaded"
      @error="emit('error', $event)"
    />

    <input
      v-else
      :id="inputId"
      v-model="model"
      type="url"
      inputmode="url"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
    >

    <p v-if="hint" class="text-xs text-ink-muted">{{ hint }}</p>
  </div>
</template>
