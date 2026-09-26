<script setup lang="ts">
/**
 * Permission editor for one role (§66).
 *
 * Its own route because the grid is long, because a link to it is worth sending
 * to a colleague, and because the back button should undo "I opened this" rather
 * than navigating away from the whole access screen.
 *
 * Gated on roles.manage, which only Super Admin holds. The three guards the API
 * enforces are mirrored here so the UI never offers something the server will
 * refuse: the Super Admin role is not editable, roles.manage cannot be granted,
 * and unknown permission names are rejected.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useAdminLocale()

const roleId = computed(() => Number(route.params.id))

interface Role {
  id: number; slug: string; name: string; description: string
  isSystem: boolean; userCount: number
  permissions: string[]; holdsEverything: boolean
  permissionsCustomised: boolean
}
interface PermissionGroup {
  group: string
  entries: { name: string; description: string }[]
}

const role = ref<Role | null>(null)
const groups = ref<PermissionGroup[]>([])
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')

/** The working set. A Set rather than an array: every toggle is a membership test. */
const draft = ref<Set<string>>(new Set())

// roles.manage is never grantable — handing it to another role would make the
// Super Admin gate decorative. Rendered, but locked.
const LOCKED = 'roles.manage'

const canEdit = computed(() => auth.can('roles.manage'))

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [roles, perms] = await Promise.all([
      api.get<Role[]>('/api/admin/roles'),
      api.get<PermissionGroup[]>('/api/admin/permissions'),
    ])
    groups.value = perms ?? []
    role.value = (roles ?? []).find(r => r.id === roleId.value) ?? null
    draft.value = new Set(role.value?.permissions ?? [])
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('rolesLoadFailed')
  } finally {
    loading.value = false
  }
}
onMounted(load)

function toggle(name: string) {
  if (name === LOCKED) return
  const next = new Set(draft.value)
  next.has(name) ? next.delete(name) : next.add(name)
  draft.value = next
}

function toggleGroup(group: PermissionGroup, on: boolean) {
  const next = new Set(draft.value)
  for (const entry of group.entries) {
    if (entry.name === LOCKED) continue
    on ? next.add(entry.name) : next.delete(entry.name)
  }
  draft.value = next
}

function groupState(group: PermissionGroup): 'all' | 'some' | 'none' {
  const names = group.entries.map(e => e.name).filter(n => n !== LOCKED)
  const held = names.filter(n => draft.value.has(n)).length
  if (held === 0) return 'none'
  return held === names.length ? 'all' : 'some'
}

/** What saving would change, shown before the click. */
const diff = computed(() => {
  if (!role.value) return { added: [] as string[], removed: [] as string[] }
  const before = new Set(role.value.permissions)
  return {
    added: [...draft.value].filter(n => !before.has(n)).sort(),
    removed: [...before].filter(n => !draft.value.has(n)).sort(),
  }
})

const hasChanges = computed(() => diff.value.added.length > 0 || diff.value.removed.length > 0)

async function save() {
  const current = role.value
  if (!current || !hasChanges.value) return
  saving.value = true
  errorMessage.value = ''
  try {
    const result = await api.put<{ granted: string[]; revoked: string[]; userCount: number }>(
      `/api/admin/roles/${current.id}/permissions`,
      { permissions: [...draft.value] },
    )
    const parts: string[] = []
    if (result.granted.length) parts.push(`${t('grantLabel')} ${result.granted.length}`)
    if (result.revoked.length) parts.push(`${t('revokeLabel')} ${result.revoked.length}`)
    // The confirmation belongs on the list the operator returns to.
    await router.push({
      path: '/admin/roles',
      query: {
        saved: `${current.name} — ${parts.join(', ')}. ${t('accountsAffected', { n: result.userCount })}`,
      },
    })
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('roleSaveFailed')
  } finally {
    saving.value = false
  }
}

async function reset() {
  const current = role.value
  if (!current) return
  saving.value = true
  errorMessage.value = ''
  try {
    const result = await api.del<{ permissions: string[] }>(`/api/admin/roles/${current.id}/permissions`)
    await router.push({
      path: '/admin/roles',
      query: { saved: t('resetDone', { name: current.name, n: result.permissions.length }) },
    })
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('roleResetFailed')
  } finally {
    saving.value = false
  }
}

useHead({ title: () => `${role.value?.name ?? t('permissions')} · CFN Admin` })
</script>

<template>
  <div class="space-y-5">
    <div>
      <NuxtLink to="/admin/roles" class="text-sm text-brand hover:underline">← {{ t('backToRoles') }}</NuxtLink>
    </div>

    <p v-if="errorMessage" role="alert" class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>
    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!role" class="card p-8 text-center text-sm text-ink-muted">{{ t('roleNotFound') }}</p>

    <template v-else>
      <header>
        <h1 class="flex flex-wrap items-center gap-2 text-xl font-bold">
          {{ role.name }}
          <code class="font-mono text-sm font-normal text-ink-muted">{{ role.slug }}</code>
          <span
            v-if="role.permissionsCustomised"
            class="rounded bg-warning/15 px-1.5 py-0.5 text-xs font-normal"
            :title="t('customisedHint')"
          >{{ t('customised') }}</span>
        </h1>
        <p class="mt-1 text-sm text-ink-muted">{{ role.description }}</p>
      </header>

      <p v-if="role.holdsEverything" class="card bg-warning/10 p-4 text-sm">{{ t('holdsEverything') }}</p>
      <p v-else-if="!canEdit" class="card p-4 text-sm text-ink-muted">{{ t('rolesReadOnly') }}</p>

      <template v-else>
        <div class="card space-y-4 p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <p class="max-w-prose text-xs text-ink-muted">{{ t('takesEffectNow', { n: role.userCount }) }}</p>
            <p class="shrink-0 text-sm font-semibold tabular-nums">{{ t('selected', { n: draft.size }) }}</p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <fieldset v-for="group in groups" :key="group.group" class="space-y-1.5">
              <legend class="mb-1 flex w-full items-center justify-between gap-2">
                <span class="text-xs font-bold uppercase tracking-wide text-ink-muted">{{ group.group }}</span>
                <button
                  type="button"
                  class="text-xs font-semibold text-brand hover:underline"
                  @click="toggleGroup(group, groupState(group) !== 'all')"
                >{{ groupState(group) === 'all' ? t('clear') : t('all') }}</button>
              </legend>

              <label
                v-for="entry in group.entries"
                :key="entry.name"
                :class="[
                  'flex items-start gap-2 rounded px-1 py-0.5 text-sm',
                  entry.name === 'roles.manage' ? 'opacity-50' : 'hover:bg-surface-muted',
                ]"
              >
                <input
                  type="checkbox"
                  class="mt-1 rounded border-line"
                  :checked="draft.has(entry.name)"
                  :disabled="entry.name === 'roles.manage'"
                  @change="toggle(entry.name)"
                >
                <span class="min-w-0">
                  <code class="text-xs text-brand">{{ entry.name }}</code>
                  <span class="block text-xs text-ink-muted">
                    {{ entry.description }}
                    <template v-if="entry.name === 'roles.manage'"> — {{ t('reservedForSuperAdmin') }}</template>
                  </span>
                </span>
              </label>
            </fieldset>
          </div>
        </div>

        <!-- The diff, before committing: a checkbox grid makes it very easy to
             revoke something by accident. -->
        <div v-if="hasChanges" class="card space-y-1 p-4 text-xs">
          <p v-if="diff.added.length">
            <span class="font-semibold text-brand">{{ t('grantLabel') }}</span>
            <code class="ml-1">{{ diff.added.join(', ') }}</code>
          </p>
          <p v-if="diff.removed.length">
            <span class="font-semibold text-breaking">{{ t('revokeLabel') }}</span>
            <code class="ml-1">{{ diff.removed.join(', ') }}</code>
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            :disabled="!hasChanges || saving"
            @click="save"
          >{{ saving ? t('saving') : t('save') }}</button>

          <NuxtLink
            to="/admin/roles"
            class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
          >{{ t('cancel') }}</NuxtLink>

          <button
            v-if="role.permissionsCustomised"
            type="button"
            class="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-surface-muted"
            :disabled="saving"
            @click="reset"
          >{{ t('resetToDefaults') }}</button>

          <p v-if="!hasChanges" class="text-xs text-ink-muted">{{ t('noChangesYet') }}</p>
        </div>
      </template>
    </template>
  </div>
</template>
