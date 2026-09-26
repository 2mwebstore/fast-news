<script setup lang="ts">
/**
 * Drag-and-drop upload for the media library.
 *
 * Uses XMLHttpRequest rather than fetch because fetch still cannot report
 * upload progress, and a newsroom uploading a 40 MB video needs to see that
 * something is happening rather than a frozen button.
 *
 * Validation here is a courtesy that saves a wasted round trip. The server is
 * the authority: it sniffs the actual bytes and ignores the filename and the
 * declared type entirely.
 */
export interface UploadedFile {
  id: number
  url: string
  filename: string
  mimeType: string
  sizeBytes: number
  width: number
  height: number
}

const props = withDefaults(defineProps<{
  /** Media library folder: article | author | ad | video | tip. */
  folder?: string
  accept?: string
  multiple?: boolean
  label?: string
  /** Client-side ceiling in MB, mirroring the server's limit. */
  maxSizeMb?: number
  /** Show a preview strip of what was uploaded in this session. */
  showPreview?: boolean
}>(), {
  folder: 'article',
  accept: 'image/*',
  multiple: false,
  maxSizeMb: 10,
  showPreview: true,
})

const emit = defineEmits<{
  uploaded: [file: UploadedFile]
  allUploaded: [files: UploadedFile[]]
  error: [message: string]
}>()

const auth = useAuthStore()
const config = useRuntimeConfig()
const { t } = useAdminLocale()

const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const currentName = ref('')
const errorMessage = ref('')
const uploaded = ref<UploadedFile[]>([])

// A counter, not a boolean: dragging over a child element fires dragleave on
// the parent, and a boolean would flicker the highlight off mid-drag.
let dragDepth = 0

function onDragEnter(event: DragEvent) {
  event.preventDefault()
  dragDepth += 1
  dragging.value = true
}
function onDragLeave(event: DragEvent) {
  event.preventDefault()
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dragging.value = false
}
function onDrop(event: DragEvent) {
  event.preventDefault()
  dragDepth = 0
  dragging.value = false
  const files = event.dataTransfer?.files
  if (files?.length) void handleFiles(Array.from(files))
}

function onPick(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files?.length) void handleFiles(Array.from(files))
}

function validate(file: File): string | null {
  const limit = props.maxSizeMb * 1024 * 1024
  if (file.size > limit) {
    return `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${props.maxSizeMb} MB.`
  }
  if (file.size === 0) return `${file.name} is empty.`
  return null
}

/** One upload, with progress. Resolves to the stored media record. */
function upload(file: File): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', props.folder)

    const request = new XMLHttpRequest()
    request.open('POST', `${config.public.apiBase}/api/media/upload`)
    if (auth.accessToken) {
      request.setRequestHeader('Authorization', `Bearer ${auth.accessToken}`)
    }
    // Content-Type is deliberately not set: the browser has to add the
    // multipart boundary itself.

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        progress.value = Math.round((event.loaded / event.total) * 100)
      }
    })

    request.addEventListener('load', () => {
      let body: { success?: boolean; data?: UploadedFile; message?: string } = {}
      try {
        body = JSON.parse(request.responseText)
      } catch {
        reject(new Error('The server returned an unreadable response.'))
        return
      }
      if (request.status >= 200 && request.status < 300 && body.data) {
        resolve(body.data)
      } else {
        // Surface the server's reason — it names the actual problem, such as a
        // rejected file type.
        reject(new Error(body.message || `Upload failed (HTTP ${request.status}).`))
      }
    })

    request.addEventListener('error', () => reject(new Error('The connection dropped during upload.')))
    request.addEventListener('abort', () => reject(new Error('Upload cancelled.')))
    request.send(form)
  })
}

async function handleFiles(files: File[]) {
  errorMessage.value = ''
  const queue = props.multiple ? files : files.slice(0, 1)
  const done: UploadedFile[] = []

  uploading.value = true
  try {
    for (const file of queue) {
      const problem = validate(file)
      if (problem) {
        errorMessage.value = problem
        emit('error', problem)
        continue
      }

      currentName.value = file.name
      progress.value = 0
      try {
        const record = await upload(file)
        done.push(record)
        uploaded.value.unshift(record)
        emit('uploaded', record)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Upload failed.'
        errorMessage.value = message
        emit('error', message)
      }
    }
    if (done.length) emit('allUploaded', done)
  } finally {
    uploading.value = false
    currentName.value = ''
    progress.value = 0
    // Clearing the input allows re-picking the same file after a failure.
    if (input.value) input.value.value = ''
  }
}

function sizeLabel(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`
}
</script>

<template>
  <div>
    <span v-if="label" class="mb-1 block text-sm font-medium">{{ label }}</span>

    <!-- The whole area is a label, so a click anywhere opens the picker and
         keyboard focus lands on the real input. -->
    <label
      :class="[
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors',
        dragging ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/50 hover:bg-surface-muted',
        uploading ? 'pointer-events-none opacity-60' : '',
      ]"
      @dragenter="onDragEnter"
      @dragover.prevent
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input
        ref="input"
        type="file"
        class="sr-only"
        :accept="accept"
        :multiple="multiple"
        :disabled="uploading"
        @change="onPick"
      >

      <svg class="h-8 w-8 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M12 16V4m0 0L8 8m4-4l4 4" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" stroke-linecap="round" />
      </svg>

      <span class="text-kh-sm font-medium">
        {{ dragging ? 'Drop to upload' : 'Drag a file here, or click to choose' }}
      </span>
      <span class="text-xs text-ink-muted">
        {{ accept === 'image/*' ? 'Images' : accept }} · up to {{ maxSizeMb }} MB
      </span>
    </label>

    <!-- Progress -->
    <div v-if="uploading" class="mt-3" aria-live="polite">
      <div class="mb-1 flex items-center justify-between text-xs text-ink-muted">
        <span class="min-w-0 truncate">{{ currentName }}</span>
        <span class="shrink-0 tabular-nums">{{ progress }}%</span>
      </div>
      <div class="h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div
          class="h-full rounded-full bg-brand transition-[width] duration-200"
          :style="{ width: `${progress}%` }"
          role="progressbar"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>

    <p v-if="errorMessage" class="mt-2 rounded-lg bg-breaking/10 p-2.5 text-sm text-breaking">
      {{ errorMessage }}
    </p>

    <!-- What was uploaded in this session -->
    <ul v-if="showPreview && uploaded.length" class="mt-3 space-y-2">
      <li
        v-for="file in uploaded"
        :key="file.id"
        class="flex items-center gap-3 rounded-lg border border-line p-2"
      >
        <SmartImage
          v-if="file.mimeType.startsWith('image/')"
          :src="file.url" :alt="file.filename"
          ratio="1 / 1" class="h-10 w-10 shrink-0 rounded"
        />
        <span v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-muted text-lg" aria-hidden="true">🎬</span>

        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm font-medium">{{ file.filename }}</span>
          <span class="block text-xs text-ink-muted">
            {{ sizeLabel(file.sizeBytes) }}<template v-if="file.width"> · {{ file.width }}×{{ file.height }}</template>
          </span>
        </span>

        <span class="shrink-0 text-xs font-semibold text-success">✓</span>
      </li>
    </ul>
  </div>
</template>
