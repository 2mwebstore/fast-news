<script setup lang="ts">
import type { SelectOption } from '~/components/SelectField.vue'

/**
 * Creative editor (§37, §38).
 *
 * Dimensions are required alongside each image because they are what reserves
 * the slot's space before the creative loads. A creative without them would
 * render an unsized box and push the article down as it arrives — the layout
 * shift the ad system exists to avoid. The API enforces the same rule.
 */
const props = defineProps<{ creativeId?: number }>()

const api = useAdminApi()
const router = useRouter()
const { t } = useAdminLocale()
const { meta: platformMeta, toOptions } = useMeta()

const form = reactive({
  campaignId: '' as string | number,
  name: '', position: '',
  desktopImageUrl: '', desktopWidth: 0, desktopHeight: 0,
  mobileImageUrl: '', mobileWidth: 0, mobileHeight: 0,
  htmlSnippet: '', targetUrl: '', altText: '',
  startAt: '', endAt: '', priority: 0, weight: 1,
  targetDevice: 'all', targetCategories: [] as string[],
})

const campaigns = ref<{ id: number; name: string; advertiser: string; approvedAt?: string }[]>([])
const loading = ref(Boolean(props.creativeId))
const saving = ref(false)
const message = ref('')
const errorMessage = ref('')
const currentId = ref<number | undefined>(props.creativeId)

const positionOptions = computed<SelectOption[]>(() => toOptions(platformMeta.value?.adPositions, 'en'))

const campaignOptions = computed(() =>
  campaigns.value.map(c => ({
    value: c.id,
    label: c.name,
    // Flagging unapproved campaigns here saves the puzzle of a creative that
    // is "active" but never appears.
    sub: c.approvedAt ? c.advertiser : `${c.advertiser} · not approved`,
  })),
)

const deviceOptions: SelectOption[] = [
  { value: 'all', label: 'All devices' },
  { value: 'desktop', label: 'Desktop only' },
  { value: 'mobile', label: 'Mobile only' },
]

function toLocalInput(iso?: string) {
  return iso ? new Date(iso).toISOString().slice(0, 16) : ''
}

onMounted(async () => {
  const list = await api.list<typeof campaigns.value>('/api/admin/ads/campaigns', { limit: 100 })
  campaigns.value = list.data ?? []

  if (props.creativeId) {
    try {
      const ad = await api.get<Record<string, unknown>>(`/api/admin/ads/${props.creativeId}`)
      Object.assign(form, {
        campaignId: ad.campaignId ?? '',
        name: ad.name ?? '', position: ad.position ?? '',
        desktopImageUrl: ad.desktopImageUrl ?? '',
        desktopWidth: Number(ad.desktopWidth ?? 0), desktopHeight: Number(ad.desktopHeight ?? 0),
        mobileImageUrl: ad.mobileImageUrl ?? '',
        mobileWidth: Number(ad.mobileWidth ?? 0), mobileHeight: Number(ad.mobileHeight ?? 0),
        htmlSnippet: ad.htmlSnippet ?? '', targetUrl: ad.targetUrl ?? '', altText: ad.altText ?? '',
        startAt: toLocalInput(ad.startAt as string), endAt: toLocalInput(ad.endAt as string),
        priority: Number(ad.priority ?? 0), weight: Number(ad.weight ?? 1),
        targetDevice: (ad.targetDevice as string) || 'all',
        targetCategories: (ad.targetCategories as string[]) ?? [],
      })
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
    const payload = {
      ...form,
      campaignId: Number(form.campaignId),
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
    }
    const result = currentId.value
      ? await api.put<{ id: number }>(`/api/ads/${currentId.value}`, payload)
      : await api.post<{ id: number }>('/api/ads', payload)

    currentId.value = result.id
    message.value = t('saved')
    if (!props.creativeId) router.replace(`/admin/ads/creatives/${result.id}/edit`)
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not save the creative.'
  } finally {
    saving.value = false
  }
}

/** Reads the natural size of an uploaded image so nobody types it by hand. */
// Fills the dimensions from the image itself, for an upload or a pasted link
// alike. They are required with an image — they reserve the slot's space — and
// nobody should have to look them up by hand.
function applyNatural(target: 'desktop' | 'mobile', size: { width: number; height: number }) {
  if (target === 'desktop') {
    form.desktopWidth = size.width
    form.desktopHeight = size.height
  } else {
    form.mobileWidth = size.width
    form.mobileHeight = size.height
  }
}
</script>

<template>
  <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>

  <form v-else class="grid gap-6 lg:grid-cols-3" @submit.prevent="save">
    <div class="space-y-4 lg:col-span-2">
      <div class="card space-y-4 p-5">
        <div>
          <label for="ad-name" class="mb-1 block text-sm font-medium">Name *</label>
          <input id="ad-name" v-model="form.name" required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
        </div>

        <SearchableSelect
          v-model="form.campaignId"
          :options="campaignOptions"
          label="Campaign"
          required
          :clearable="false"
          placeholder="Choose a campaign"
        />

        <SearchableSelect
          v-model="form.position"
          :options="positionOptions"
          label="Slot"
          required
          :clearable="false"
          placeholder="Choose a slot"
        />

        <div>
          <label for="ad-url" class="mb-1 block text-sm font-medium">Click-through URL</label>
          <input id="ad-url" v-model="form.targetUrl" placeholder="https://…" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
        </div>

        <div>
          <label for="ad-alt" class="mb-1 block text-sm font-medium">ALT text</label>
          <input id="ad-alt" v-model="form.altText" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
        </div>
      </div>

      <!-- ── Creatives per device (§37) ──────────────────────────────── -->
      <div class="card space-y-5 p-5">
        <h2 class="font-bold">Creatives</h2>

        <div>
          <ImageField
            v-model="form.desktopImageUrl"
            folder="ad"
            label="Desktop"
            :ratio="form.desktopWidth && form.desktopHeight ? `${form.desktopWidth} / ${form.desktopHeight}` : '16 / 9'"
            @natural="applyNatural('desktop', $event)"
            @error="errorMessage = $event"
          />
          <div class="mt-2 grid grid-cols-2 gap-2">
            <input v-model.number="form.desktopWidth" type="number" min="0" placeholder="width" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">
            <input v-model.number="form.desktopHeight" type="number" min="0" placeholder="height" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">
          </div>
        </div>

        <div>
          <ImageField
            v-model="form.mobileImageUrl"
            folder="ad"
            label="Mobile"
            :ratio="form.mobileWidth && form.mobileHeight ? `${form.mobileWidth} / ${form.mobileHeight}` : '16 / 9'"
            @natural="applyNatural('mobile', $event)"
            @error="errorMessage = $event"
          />
          <div class="mt-2 grid grid-cols-2 gap-2">
            <input v-model.number="form.mobileWidth" type="number" min="0" placeholder="width" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">
            <input v-model.number="form.mobileHeight" type="number" min="0" placeholder="height" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">
          </div>
          <p class="mt-1.5 text-xs text-ink-muted">
            Width and height are required with an image — they reserve the slot's space so the ad cannot shift the page.
          </p>
        </div>

        <div>
          <label for="ad-tag" class="mb-1 block text-sm font-medium">Third-party ad tag</label>
          <textarea id="ad-tag" v-model="form.htmlSnippet" rows="3" class="w-full rounded-lg border border-line px-3 py-2 font-mono text-xs outline-none focus:border-brand" />
          <p class="mt-1 text-xs text-ink-muted">Rendered in a sandboxed iframe, never injected into the page.</p>
        </div>
      </div>
    </div>

    <aside class="space-y-4">
      <div class="card space-y-3 p-5">
        <button type="submit" :disabled="saving" class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
          {{ saving ? t('saving') : t('save') }}
        </button>
        <p v-if="message" class="rounded bg-success/10 p-2 text-sm text-success">{{ message }}</p>
        <p v-if="errorMessage" class="rounded bg-breaking/10 p-2 text-sm text-breaking">{{ errorMessage }}</p>
        <NuxtLink to="/admin/ads" class="block text-center text-sm text-brand hover:underline">← {{ t('advertising') }}</NuxtLink>
      </div>

      <div class="card space-y-3 p-5">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="ad-start" class="mb-1 block text-sm font-medium">Starts *</label>
            <input id="ad-start" v-model="form.startAt" type="datetime-local" required class="w-full rounded-lg border border-line px-2 py-2 text-sm outline-none focus:border-brand">
          </div>
          <div>
            <label for="ad-end" class="mb-1 block text-sm font-medium">Ends *</label>
            <input id="ad-end" v-model="form.endAt" type="datetime-local" required class="w-full rounded-lg border border-line px-2 py-2 text-sm outline-none focus:border-brand">
          </div>
        </div>

        <SelectField v-model="form.targetDevice" :options="deviceOptions" label="Devices" />

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="ad-priority" class="mb-1 block text-sm font-medium">Priority</label>
            <input id="ad-priority" v-model.number="form.priority" type="number" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">
          </div>
          <div>
            <label for="ad-weight" class="mb-1 block text-sm font-medium">Weight</label>
            <input id="ad-weight" v-model.number="form.weight" type="number" min="1" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">
          </div>
        </div>
        <p class="text-xs text-ink-muted">
          Highest priority wins. Creatives tied on priority share the slot in proportion to their weight.
        </p>
      </div>
    </aside>
  </form>
</template>
