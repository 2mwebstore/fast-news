import { j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './SmartImage-D_CQTSWD.mjs';
import { _ as _sfc_main$2 } from './SelectField-vCKw5R9_.mjs';
import { _ as __nuxt_component_2 } from './ConfirmDialog-BxaeJdx9.mjs';
import { defineComponent, ref, reactive, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useAdminApi, b as useAuthStore, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import { u as useFormat } from './useFormat-DT1zbtWM.mjs';
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
import './index-C4JB2zdt.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const api = useAdminApi();
    const auth = useAuthStore();
    const { t } = useAdminLocale();
    const { dateTime } = useFormat();
    const tab = ref("campaigns");
    const campaigns = ref([]);
    const creatives = ref([]);
    const creativeMeta = ref(null);
    const performance = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");
    const notice = ref("");
    const editingCampaign = ref(null);
    const showCampaignForm = ref(false);
    const savingCampaign = ref(false);
    const campaignForm = reactive({
      name: "",
      advertiser: "",
      contactEmail: "",
      startAt: "",
      endAt: "",
      notes: ""
    });
    const pendingDelete = ref(null);
    const deleting = ref(false);
    const creativeStatusOptions = [
      { value: "draft", label: "Draft" },
      { value: "scheduled", label: "Scheduled" },
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" }
    ];
    async function load() {
      var _a, _b, _c, _d, _e;
      loading.value = true;
      errorMessage.value = "";
      try {
        const [c, a, p] = await Promise.all([
          api.list("/api/admin/ads/campaigns", { limit: 100 }),
          api.list("/api/admin/ads", { limit: 100 }),
          api.get("/api/admin/ads/performance", { days: 30 })
        ]);
        campaigns.value = (_a = c.data) != null ? _a : [];
        creatives.value = (_b = a.data) != null ? _b : [];
        creativeMeta.value = (_c = a.meta) != null ? _c : null;
        performance.value = (_d = p.rows) != null ? _d : [];
      } catch (e) {
        errorMessage.value = ((_e = e.data) == null ? void 0 : _e.message) || "Could not load advertising data.";
      } finally {
        loading.value = false;
      }
    }
    async function setCreativeStatus(creative, status) {
      var _a;
      errorMessage.value = "";
      try {
        await api.put(`/api/ads/${creative.id}/status`, { status });
        await load();
      } catch (e) {
        errorMessage.value = ((_a = e.data) == null ? void 0 : _a.message) || "Could not change the status.";
      }
    }
    async function confirmDelete() {
      var _a;
      if (!pendingDelete.value) return;
      deleting.value = true;
      try {
        const path = pendingDelete.value.kind === "campaign" ? `/api/admin/ads/campaigns/${pendingDelete.value.id}` : `/api/ads/${pendingDelete.value.id}`;
        await api.del(path);
        pendingDelete.value = null;
        await load();
      } catch (e) {
        errorMessage.value = ((_a = e.data) == null ? void 0 : _a.message) || "Could not delete.";
      } finally {
        deleting.value = false;
      }
    }
    const tabs = [
      { key: "campaigns", label: "Campaigns" },
      { key: "creatives", label: "Creatives" },
      { key: "performance", label: "Performance" }
    ];
    useHead({ title: "Advertising \u2014 Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SmartImage = _sfc_main$1;
      const _component_SelectField = _sfc_main$2;
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("advertising"))}</h1><div class="flex gap-2">`);
      if (unref(auth).can("ads.create")) {
        _push(`<button class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted">+ Campaign</button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(auth).can("ads.create")) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/ads/creatives/create",
          class: "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`+ Creative`);
            } else {
              return [
                createTextVNode("+ Creative")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mb-4 flex gap-2"><!--[-->`);
      ssrRenderList(tabs, (item) => {
        _push(`<button class="${ssrRenderClass([
          "rounded-full border px-4 py-1.5 text-sm transition-colors",
          unref(tab) === item.key ? "border-brand bg-brand text-white" : "border-line hover:border-brand"
        ])}">${ssrInterpolate(item.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(notice)) {
        _push(`<p class="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">${ssrInterpolate(unref(notice))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(errorMessage)) {
        _push(`<p class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (unref(tab) === "campaigns") {
        _push(`<section>`);
        if (!unref(campaigns).length) {
          _push(`<p class="card p-8 text-center text-ink-muted">No campaigns yet.</p>`);
        } else {
          _push(`<ul class="space-y-3"><!--[-->`);
          ssrRenderList(unref(campaigns), (campaign) => {
            var _a2;
            _push(`<li class="card p-4"><div class="flex flex-wrap items-center gap-3"><div class="min-w-0 flex-1"><p class="font-semibold">${ssrInterpolate(campaign.name)}</p><p class="text-xs text-ink-muted">${ssrInterpolate(campaign.advertiser)} \xB7 ${ssrInterpolate(unref(dateTime)(campaign.startAt))} \u2192 ${ssrInterpolate(unref(dateTime)(campaign.endAt))}</p></div><span class="rounded bg-ink/10 px-2 py-0.5 text-xs font-semibold">${ssrInterpolate(campaign.status)}</span>`);
            if (campaign.approvedAt) {
              _push(`<span class="text-xs font-semibold text-success">\u2713 Approved</span>`);
            } else if (unref(auth).can("ads.publish")) {
              _push(`<button class="rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">Approve</button>`);
            } else {
              _push(`<span class="text-xs text-warning">Awaiting approval</span>`);
            }
            _push(`<div class="flex gap-1.5">`);
            if (unref(auth).can("ads.edit")) {
              _push(`<button class="rounded border border-line px-2 py-1 text-xs hover:bg-surface-muted">${ssrInterpolate(unref(t)("edit"))}</button>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(auth).can("ads.delete")) {
              _push(`<button class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("remove"))}</button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
            if ((_a2 = campaign.advertisements) == null ? void 0 : _a2.length) {
              _push(`<ul class="mt-2 border-t border-line pt-2 text-xs text-ink-muted"><!--[-->`);
              ssrRenderList(campaign.advertisements, (ad) => {
                _push(`<li>${ssrInterpolate(ad.name)} \xB7 ${ssrInterpolate(ad.position)} \xB7 ${ssrInterpolate(ad.status)}</li>`);
              });
              _push(`<!--]--></ul>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        }
        _push(`</section>`);
      } else if (unref(tab) === "creatives") {
        _push(`<section>`);
        if (!unref(creatives).length) {
          _push(`<p class="card p-8 text-center text-ink-muted">No creatives yet.</p>`);
        } else {
          _push(`<div class="card overflow-hidden"><ul class="divide-y divide-line"><!--[-->`);
          ssrRenderList(unref(creatives), (creative) => {
            var _a2;
            _push(`<li class="flex flex-wrap items-start gap-3 p-4">`);
            _push(ssrRenderComponent(_component_SmartImage, {
              src: creative.desktopImageUrl || creative.mobileImageUrl,
              alt: creative.name,
              ratio: creative.desktopWidth && creative.desktopHeight ? `${creative.desktopWidth} / ${creative.desktopHeight}` : "16 / 9",
              class: "w-28 shrink-0 rounded"
            }, null, _parent));
            _push(`<div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold">${ssrInterpolate(creative.name)}</p><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(creative.position)} \xB7 ${ssrInterpolate((_a2 = creative.campaign) == null ? void 0 : _a2.name)} `);
            if (creative.campaign && !creative.campaign.approvedAt) {
              _push(`<span class="text-warning"> \xB7 campaign not approved </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p><p class="text-xs text-ink-muted">${ssrInterpolate(creative.impressionCount)} impressions \xB7 ${ssrInterpolate(creative.clickCount)} clicks \xB7 ${ssrInterpolate(unref(dateTime)(creative.startAt))} \u2192 ${ssrInterpolate(unref(dateTime)(creative.endAt))}</p></div><div class="flex shrink-0 flex-wrap items-center gap-1.5">`);
            if (unref(auth).can("ads.publish")) {
              _push(ssrRenderComponent(_component_SelectField, {
                "model-value": creative.status,
                options: creativeStatusOptions,
                size: "sm",
                "onUpdate:modelValue": ($event) => setCreativeStatus(creative, String($event))
              }, null, _parent));
            } else {
              _push(`<span class="rounded bg-ink/10 px-2 py-0.5 text-xs">${ssrInterpolate(creative.status)}</span>`);
            }
            if (unref(auth).can("ads.edit")) {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/admin/ads/creatives/${creative.id}/edit`,
                class: "rounded border border-line px-2 py-1 text-xs hover:bg-surface-muted"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(unref(t)("edit"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("edit")), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            if (unref(auth).can("ads.delete")) {
              _push(`<button class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("remove"))}</button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></li>`);
          });
          _push(`<!--]--></ul></div>`);
        }
        _push(`</section>`);
      } else {
        _push(`<section>`);
        if (!unref(performance).length) {
          _push(`<p class="card p-8 text-center text-ink-muted">No data for the last 30 days.</p>`);
        } else {
          _push(`<div class="card overflow-x-auto"><table class="w-full text-sm"><thead class="border-b border-line bg-surface-muted text-left text-xs uppercase text-ink-muted"><tr><th class="px-4 py-2">Creative</th><th class="px-4 py-2">Position</th><th class="px-4 py-2 text-right">Impressions</th><th class="px-4 py-2 text-right">Clicks</th><th class="px-4 py-2 text-right">CTR</th></tr></thead><tbody class="divide-y divide-line"><!--[-->`);
          ssrRenderList(unref(performance), (row) => {
            _push(`<tr><td class="px-4 py-2"><p class="font-medium">${ssrInterpolate(row.name)}</p><p class="text-xs text-ink-muted">${ssrInterpolate(row.campaign)}</p></td><td class="px-4 py-2 text-xs">${ssrInterpolate(row.position)}</td><td class="px-4 py-2 text-right tabular-nums">${ssrInterpolate(row.impressions)}</td><td class="px-4 py-2 text-right tabular-nums">${ssrInterpolate(row.clicks)}</td><td class="px-4 py-2 text-right tabular-nums">${ssrInterpolate(row.ctr.toFixed(2))}%</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        _push(`</section>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a2;
        if (unref(showCampaignForm)) {
          _push2(`<div class="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"><form class="w-full max-w-lg rounded-xl bg-surface p-6"><h2 class="mb-4 text-lg font-bold">${ssrInterpolate(unref(editingCampaign) ? unref(t)("edit") : unref(t)("create"))} campaign </h2><div class="space-y-3"><div><label for="c-name" class="mb-1 block text-sm font-medium">Name *</label><input id="c-name"${ssrRenderAttr("value", unref(campaignForm).name)} required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div><div><label for="c-adv" class="mb-1 block text-sm font-medium">Advertiser *</label><input id="c-adv"${ssrRenderAttr("value", unref(campaignForm).advertiser)} required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div><div><label for="c-email" class="mb-1 block text-sm font-medium">Contact email</label><input id="c-email"${ssrRenderAttr("value", unref(campaignForm).contactEmail)} type="email" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div><div class="grid gap-3 sm:grid-cols-2"><div><label for="c-start" class="mb-1 block text-sm font-medium">Starts *</label><input id="c-start"${ssrRenderAttr("value", unref(campaignForm).startAt)} type="datetime-local" required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div><div><label for="c-end" class="mb-1 block text-sm font-medium">Ends *</label><input id="c-end"${ssrRenderAttr("value", unref(campaignForm).endAt)} type="datetime-local" required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div></div><div><label for="c-notes" class="mb-1 block text-sm font-medium">Notes</label><textarea id="c-notes" rows="2" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">${ssrInterpolate(unref(campaignForm).notes)}</textarea></div></div>`);
          if ((_a2 = unref(editingCampaign)) == null ? void 0 : _a2.approvedAt) {
            _push2(`<p class="mt-3 rounded-lg bg-warning/10 p-2.5 text-xs"> Changing the dates or advertiser will revoke approval, and the campaign will stop serving until it is approved again. </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mt-5 flex justify-end gap-2"><button type="button" class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted">${ssrInterpolate(unref(t)("cancel"))}</button><button type="submit"${ssrIncludeBooleanAttr(unref(savingCampaign)) ? " disabled" : ""} class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(savingCampaign) ? unref(t)("saving") : unref(t)("save"))}</button></div></form></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(pendingDelete),
        title: unref(t)("confirmDeleteTitle"),
        message: (_b = (_a = unref(pendingDelete)) == null ? void 0 : _a.label) != null ? _b : "",
        "require-text": ((_c = unref(pendingDelete)) == null ? void 0 : _c.kind) === "campaign" ? "DELETE" : void 0,
        consequences: ((_d = unref(pendingDelete)) == null ? void 0 : _d.kind) === "campaign" ? ["Every creative in this campaign is removed with it.", "Impression and click history is kept for reporting."] : ["The creative stops serving immediately.", "Its impression and click history is kept."],
        "confirm-label": unref(t)("remove"),
        busy: unref(deleting),
        onConfirm: confirmDelete,
        onCancel: ($event) => pendingDelete.value = null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/ads/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ByGQHUlZ.mjs.map
