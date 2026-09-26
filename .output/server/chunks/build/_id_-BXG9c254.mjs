import { f as useRoute, i as useRouter, j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useAdminApi, b as useAuthStore, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';

const LOCKED = "roles.manage";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useAdminApi();
    const auth = useAuthStore();
    const route = useRoute();
    useRouter();
    const { t } = useAdminLocale();
    computed(() => Number(route.params.id));
    const role = ref(null);
    const groups = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const errorMessage = ref("");
    const draft = ref(/* @__PURE__ */ new Set());
    const canEdit = computed(() => auth.can("roles.manage"));
    function groupState(group) {
      const names = group.entries.map((e) => e.name).filter((n) => n !== LOCKED);
      const held = names.filter((n) => draft.value.has(n)).length;
      if (held === 0) return "none";
      return held === names.length ? "all" : "some";
    }
    const diff = computed(() => {
      if (!role.value) return { added: [], removed: [] };
      const before = new Set(role.value.permissions);
      return {
        added: [...draft.value].filter((n) => !before.has(n)).sort(),
        removed: [...before].filter((n) => !draft.value.has(n)).sort()
      };
    });
    const hasChanges = computed(() => diff.value.added.length > 0 || diff.value.removed.length > 0);
    useHead({ title: () => {
      var _a, _b;
      return `${(_b = (_a = role.value) == null ? void 0 : _a.name) != null ? _b : t("permissions")} \xB7 CFN Admin`;
    } });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/roles",
        class: "text-sm text-brand hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 ${ssrInterpolate(unref(t)("backToRoles"))}`);
          } else {
            return [
              createTextVNode("\u2190 " + toDisplayString(unref(t)("backToRoles")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(errorMessage)) {
        _push(`<p role="alert" class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(role)) {
        _push(`<p class="card p-8 text-center text-sm text-ink-muted">${ssrInterpolate(unref(t)("roleNotFound"))}</p>`);
      } else {
        _push(`<!--[--><header><h1 class="flex flex-wrap items-center gap-2 text-xl font-bold">${ssrInterpolate(unref(role).name)} <code class="font-mono text-sm font-normal text-ink-muted">${ssrInterpolate(unref(role).slug)}</code>`);
        if (unref(role).permissionsCustomised) {
          _push(`<span class="rounded bg-warning/15 px-1.5 py-0.5 text-xs font-normal"${ssrRenderAttr("title", unref(t)("customisedHint"))}>${ssrInterpolate(unref(t)("customised"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h1><p class="mt-1 text-sm text-ink-muted">${ssrInterpolate(unref(role).description)}</p></header>`);
        if (unref(role).holdsEverything) {
          _push(`<p class="card bg-warning/10 p-4 text-sm">${ssrInterpolate(unref(t)("holdsEverything"))}</p>`);
        } else if (!unref(canEdit)) {
          _push(`<p class="card p-4 text-sm text-ink-muted">${ssrInterpolate(unref(t)("rolesReadOnly"))}</p>`);
        } else {
          _push(`<!--[--><div class="card space-y-4 p-5"><div class="flex flex-wrap items-start justify-between gap-3"><p class="max-w-prose text-xs text-ink-muted">${ssrInterpolate(unref(t)("takesEffectNow", { n: unref(role).userCount }))}</p><p class="shrink-0 text-sm font-semibold tabular-nums">${ssrInterpolate(unref(t)("selected", { n: unref(draft).size }))}</p></div><div class="grid gap-5 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(unref(groups), (group) => {
            _push(`<fieldset class="space-y-1.5"><legend class="mb-1 flex w-full items-center justify-between gap-2"><span class="text-xs font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(group.group)}</span><button type="button" class="text-xs font-semibold text-brand hover:underline">${ssrInterpolate(groupState(group) === "all" ? unref(t)("clear") : unref(t)("all"))}</button></legend><!--[-->`);
            ssrRenderList(group.entries, (entry) => {
              _push(`<label class="${ssrRenderClass([
                "flex items-start gap-2 rounded px-1 py-0.5 text-sm",
                entry.name === "roles.manage" ? "opacity-50" : "hover:bg-surface-muted"
              ])}"><input type="checkbox" class="mt-1 rounded border-line"${ssrIncludeBooleanAttr(unref(draft).has(entry.name)) ? " checked" : ""}${ssrIncludeBooleanAttr(entry.name === "roles.manage") ? " disabled" : ""}><span class="min-w-0"><code class="text-xs text-brand">${ssrInterpolate(entry.name)}</code><span class="block text-xs text-ink-muted">${ssrInterpolate(entry.description)} `);
              if (entry.name === "roles.manage") {
                _push(`<!--[--> \u2014 ${ssrInterpolate(unref(t)("reservedForSuperAdmin"))}<!--]-->`);
              } else {
                _push(`<!---->`);
              }
              _push(`</span></span></label>`);
            });
            _push(`<!--]--></fieldset>`);
          });
          _push(`<!--]--></div></div>`);
          if (unref(hasChanges)) {
            _push(`<div class="card space-y-1 p-4 text-xs">`);
            if (unref(diff).added.length) {
              _push(`<p><span class="font-semibold text-brand">${ssrInterpolate(unref(t)("grantLabel"))}</span><code class="ml-1">${ssrInterpolate(unref(diff).added.join(", "))}</code></p>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(diff).removed.length) {
              _push(`<p><span class="font-semibold text-breaking">${ssrInterpolate(unref(t)("revokeLabel"))}</span><code class="ml-1">${ssrInterpolate(unref(diff).removed.join(", "))}</code></p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex flex-wrap items-center gap-2"><button type="button" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(hasChanges) || unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? unref(t)("saving") : unref(t)("save"))}</button>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/admin/roles",
            class: "rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("cancel"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("cancel")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(role).permissionsCustomised) {
            _push(`<button type="button" class="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-surface-muted"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(t)("resetToDefaults"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          if (!unref(hasChanges)) {
            _push(`<p class="text-xs text-ink-muted">${ssrInterpolate(unref(t)("noChangesYet"))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><!--]-->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/roles/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BXG9c254.mjs.map
