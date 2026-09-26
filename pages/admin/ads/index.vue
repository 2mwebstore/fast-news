<script setup lang="ts">
import type { ApiMeta } from '~/types'
import type { SelectOption } from '~/components/SelectField.vue'

/**
 * Advertising hub (§35, §40, §41): campaigns, creatives and performance.
 *
 * Approval is the gate that matters here. A campaign never serves until an ad
 * manager signs it off, and editing its flight or advertiser revokes that
 * sign-off — otherwise a campaign approved for one week could be quietly
 * stretched to a year.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const auth = useAuthStore()
const { t } = useAdminLocale()
const { dateTime } = useFormat()

interface Creative {
  id: number; name: string; position: string; status: string
  desktopImageUrl?: string; mobileImageUrl?: string
  desktopWidth: number; desktopHeight: number
  targetUrl?: string; startAt: string; endAt: string
  impressionCount: number; clickCount: number
  campaign?: { id: number; name: string; approvedAt?: string }
}

interface Campaign {
  id: number; name: string; advertiser: string; contactEmail?: string
  status: string; startAt: string; endAt: string; notes?: string
  approvedAt?: string
  advertisements?: { id: number; name: string; position: string; status: string }[]
}

interface PerfRow {
  adId: number; name: string; position: string; campaign: string
  impressions: number; clicks: number; ctr: number
}

const tab = ref<'campaigns' | 'creatives' | 'performance'>('campaigns')

const campaigns = ref<Campaign[]>([])
const creatives = ref<Creative[]>([])
const creativeMeta = ref<ApiMeta | null>(null)
const performance = ref<PerfRow[]>([])
const loading = ref(true)
const errorMessage = ref('')
const notice = ref('')

// ── Campaign form (create and edit share it) ────────────────────────────
const editingCampaign = ref<Campaign | null>(null)
const showCampaignForm = ref(false)
const savingCampaign = ref(false)
const campaignForm = reactive({
  name: '', advertiser: '', contactEmail: '',
  startAt: '', endAt: '', notes: '',
})

const pendingDelete = ref<{ kind: 'campaign' | 'creative'; id: number; label: string } | null>(null)
const deleting = ref(false)

const creativeStatusOptions: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
]

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [c, a, p] = await Promise.all([
      api.list<Campaign[]>('/api/admin/ads/campaigns', { limit: 100 }),
      api.list<Creative[]>('/api/admin/ads', { limit: 100 }),
      api.get<{ rows: PerfRow[] }>('/api/admin/ads/performance', { days: 30 }),
    ])
    campaigns.value = c.data ?? []
    creatives.value = a.data ?? []
    creativeMeta.value = a.meta ?? null
    performance.value = p.rows ?? []
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not load advertising data.'
  } finally {
    loading.value = false
  }
}
onMounted(load)

// Datetime-local wants "YYYY-MM-DDTHH:mm"; the API returns RFC 3339.
function toLocalInput(iso?: string) {
  return iso ? new Date(iso).toISOString().slice(0, 16) : ''
}

function openCampaign(campaign?: Campaign) {
  editingCampaign.value = campaign ?? null
  Object.assign(campaignForm, {
    name: campaign?.name ?? '',
    advertiser: campaign?.advertiser ?? '',
    contactEmail: campaign?.contactEmail ?? '',
    startAt: toLocalInput(campaign?.startAt),
    endAt: toLocalInput(campaign?.endAt),
    notes: campaign?.notes ?? '',
  })
  showCampaignForm.value = true
}

async function saveCampaign() {
  savingCampaign.value = true
  errorMessage.value = ''
  notice.value = ''
  try {
    const payload = {
      ...campaignForm,
      startAt: new Date(campaignForm.startAt).toISOString(),
      endAt: new Date(campaignForm.endAt).toISOString(),
    }
    if (editingCampaign.value) {
      const result = await api.put<{ reapprovalRequired: boolean }>(
        `/api/admin/ads/campaigns/${editingCampaign.value.id}`, payload,
      )
      notice.value = result.reapprovalRequired
        ? 'Saved. The flight changed, so this campaign needs approving again before it serves.'
        : 'Saved.'
    } else {
      await api.post('/api/admin/ads/campaigns', payload)
      notice.value = 'Campaign created as a draft. Approve it to let its creatives run.'
    }
    showCampaignForm.value = false
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not save the campaign.'
  } finally {
    savingCampaign.value = false
  }
}

async function approve(campaign: Campaign) {
  try {
    await api.post(`/api/admin/ads/campaigns/${campaign.id}/approve`)
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not approve.'
  }
}

async function setCreativeStatus(creative: Creative, status: string) {
  errorMessage.value = ''
  try {
    await api.put(`/api/ads/${creative.id}/status`, { status })
    await load()
  } catch (e: unknown) {
    // The API refuses to activate a creative under an unapproved campaign —
    // surface that reason rather than a generic failure.
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not change the status.'
  }
}

async function confirmDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    const path = pendingDelete.value.kind === 'campaign'
      ? `/api/admin/ads/campaigns/${pendingDelete.value.id}`
      : `/api/ads/${pendingDelete.value.id}`
    await api.del(path)
    pendingDelete.value = null
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not delete.'
  } finally {
    deleting.value = false
  }
}

const tabs = [
  { key: 'campaigns' as const, label: 'Campaigns' },
  { key: 'creatives' as const, label: 'Creatives' },
  { key: 'performance' as const, label: 'Performance' },
]

useHead({ title: 'Advertising — Newsroom' })
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-bold">{{ t('advertising') }}</h1>
      <div class="flex gap-2">
        <button
          v-if="auth.can('ads.create')"
          class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
          @click="openCampaign()"
        >+ Campaign</button>
        <NuxtLink
          v-if="auth.can('ads.create')"
          to="/admin/ads/creatives/create"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >+ Creative</NuxtLink>
      </div>
    </div>

    <div class="mb-4 flex gap-2">
      <button
        v-for="item in tabs" :key="item.key"
        :class="[
          'rounded-full border px-4 py-1.5 text-sm transition-colors',
          tab === item.key ? 'border-brand bg-brand text-white' : 'border-line hover:border-brand',
        ]"
        @click="tab = item.key"
      >{{ item.label }}</button>
    </div>

    <p v-if="notice" class="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">{{ notice }}</p>
    <p v-if="errorMessage" class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>
    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>

    <!-- ── Campaigns ─────────────────────────────────────────────────── -->
    <section v-else-if="tab === 'campaigns'">
      <p v-if="!campaigns.length" class="card p-8 text-center text-ink-muted">No campaigns yet.</p>

      <ul v-else class="space-y-3">
        <li v-for="campaign in campaigns" :key="campaign.id" class="card p-4">
          <div class="flex flex-wrap items-center gap-3">
            <div class="min-w-0 flex-1">
              <p class="font-semibold">{{ campaign.name }}</p>
              <p class="text-xs text-ink-muted">
                {{ campaign.advertiser }} · {{ dateTime(campaign.startAt) }} → {{ dateTime(campaign.endAt) }}
              </p>
            </div>

            <span class="rounded bg-ink/10 px-2 py-0.5 text-xs font-semibold">{{ campaign.status }}</span>

            <span v-if="campaign.approvedAt" class="text-xs font-semibold text-success">✓ Approved</span>
            <button
              v-else-if="auth.can('ads.publish')"
              class="rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              @click="approve(campaign)"
            >Approve</button>
            <span v-else class="text-xs text-warning">Awaiting approval</span>

            <div class="flex gap-1.5">
              <button
                v-if="auth.can('ads.edit')"
                class="rounded border border-line px-2 py-1 text-xs hover:bg-surface-muted"
                @click="openCampaign(campaign)"
              >{{ t('edit') }}</button>
              <button
                v-if="auth.can('ads.delete')"
                class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5"
                @click="pendingDelete = { kind: 'campaign', id: campaign.id, label: campaign.name }"
              >{{ t('remove') }}</button>
            </div>
          </div>

          <ul v-if="campaign.advertisements?.length" class="mt-2 border-t border-line pt-2 text-xs text-ink-muted">
            <li v-for="ad in campaign.advertisements" :key="ad.id">
              {{ ad.name }} · {{ ad.position }} · {{ ad.status }}
            </li>
          </ul>
        </li>
      </ul>
    </section>

    <!-- ── Creatives ─────────────────────────────────────────────────── -->
    <section v-else-if="tab === 'creatives'">
      <p v-if="!creatives.length" class="card p-8 text-center text-ink-muted">No creatives yet.</p>

      <div v-else class="card overflow-hidden">
        <ul class="divide-y divide-line">
          <li v-for="creative in creatives" :key="creative.id" class="flex flex-wrap items-start gap-3 p-4">
            <SmartImage
              :src="creative.desktopImageUrl || creative.mobileImageUrl"
              :alt="creative.name"
              :ratio="creative.desktopWidth && creative.desktopHeight
                ? `${creative.desktopWidth} / ${creative.desktopHeight}` : '16 / 9'"
              class="w-28 shrink-0 rounded"
            />

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ creative.name }}</p>
              <p class="mt-1 text-xs text-ink-muted">
                {{ creative.position }} · {{ creative.campaign?.name }}
                <span v-if="creative.campaign && !creative.campaign.approvedAt" class="text-warning">
                  · campaign not approved
                </span>
              </p>
              <p class="text-xs text-ink-muted">
                {{ creative.impressionCount }} impressions · {{ creative.clickCount }} clicks
                · {{ dateTime(creative.startAt) }} → {{ dateTime(creative.endAt) }}
              </p>
            </div>

            <div class="flex shrink-0 flex-wrap items-center gap-1.5">
              <SelectField
                v-if="auth.can('ads.publish')"
                :model-value="creative.status"
                :options="creativeStatusOptions"
                size="sm"
                @update:model-value="setCreativeStatus(creative, String($event))"
              />
              <span v-else class="rounded bg-ink/10 px-2 py-0.5 text-xs">{{ creative.status }}</span>

              <NuxtLink
                v-if="auth.can('ads.edit')"
                :to="`/admin/ads/creatives/${creative.id}/edit`"
                class="rounded border border-line px-2 py-1 text-xs hover:bg-surface-muted"
              >{{ t('edit') }}</NuxtLink>
              <button
                v-if="auth.can('ads.delete')"
                class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5"
                @click="pendingDelete = { kind: 'creative', id: creative.id, label: creative.name }"
              >{{ t('remove') }}</button>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Performance ───────────────────────────────────────────────── -->
    <section v-else>
      <p v-if="!performance.length" class="card p-8 text-center text-ink-muted">No data for the last 30 days.</p>

      <div v-else class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-line bg-surface-muted text-left text-xs uppercase text-ink-muted">
            <tr>
              <th class="px-4 py-2">Creative</th>
              <th class="px-4 py-2">Position</th>
              <th class="px-4 py-2 text-right">Impressions</th>
              <th class="px-4 py-2 text-right">Clicks</th>
              <th class="px-4 py-2 text-right">CTR</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="row in performance" :key="row.adId">
              <td class="px-4 py-2">
                <p class="font-medium">{{ row.name }}</p>
                <p class="text-xs text-ink-muted">{{ row.campaign }}</p>
              </td>
              <td class="px-4 py-2 text-xs">{{ row.position }}</td>
              <td class="px-4 py-2 text-right tabular-nums">{{ row.impressions }}</td>
              <td class="px-4 py-2 text-right tabular-nums">{{ row.clicks }}</td>
              <td class="px-4 py-2 text-right tabular-nums">{{ row.ctr.toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── Campaign form ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showCampaignForm"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        @click.self="showCampaignForm = false"
      >
        <form class="w-full max-w-lg rounded-xl bg-surface p-6" @submit.prevent="saveCampaign">
          <h2 class="mb-4 text-lg font-bold">
            {{ editingCampaign ? t('edit') : t('create') }} campaign
          </h2>

          <div class="space-y-3">
            <div>
              <label for="c-name" class="mb-1 block text-sm font-medium">Name *</label>
              <input id="c-name" v-model="campaignForm.name" required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
            </div>
            <div>
              <label for="c-adv" class="mb-1 block text-sm font-medium">Advertiser *</label>
              <input id="c-adv" v-model="campaignForm.advertiser" required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
            </div>
            <div>
              <label for="c-email" class="mb-1 block text-sm font-medium">Contact email</label>
              <input id="c-email" v-model="campaignForm.contactEmail" type="email" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label for="c-start" class="mb-1 block text-sm font-medium">Starts *</label>
                <input id="c-start" v-model="campaignForm.startAt" type="datetime-local" required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
              </div>
              <div>
                <label for="c-end" class="mb-1 block text-sm font-medium">Ends *</label>
                <input id="c-end" v-model="campaignForm.endAt" type="datetime-local" required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">
              </div>
            </div>
            <div>
              <label for="c-notes" class="mb-1 block text-sm font-medium">Notes</label>
              <textarea id="c-notes" v-model="campaignForm.notes" rows="2" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand" />
            </div>
          </div>

          <p v-if="editingCampaign?.approvedAt" class="mt-3 rounded-lg bg-warning/10 p-2.5 text-xs">
            Changing the dates or advertiser will revoke approval, and the campaign will stop serving until it is approved again.
          </p>

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted" @click="showCampaignForm = false">
              {{ t('cancel') }}
            </button>
            <button type="submit" :disabled="savingCampaign" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
              {{ savingCampaign ? t('saving') : t('save') }}
            </button>
          </div>
        </form>
      </div>
    </Teleport>

    <ConfirmDialog
      :open="!!pendingDelete"
      :title="t('confirmDeleteTitle')"
      :message="pendingDelete?.label ?? ''"
      :require-text="pendingDelete?.kind === 'campaign' ? 'DELETE' : undefined"
      :consequences="pendingDelete?.kind === 'campaign'
        ? ['Every creative in this campaign is removed with it.', 'Impression and click history is kept for reporting.']
        : ['The creative stops serving immediately.', 'Its impression and click history is kept.']"
      :confirm-label="t('remove')"
      :busy="deleting"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
