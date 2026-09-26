import { j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './AdminStat-DhS7zDkE.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useAdminApi();
    const auth = useAuthStore();
    const { dateTime, compact } = useFormat();
    const { t } = useAdminLocale();
    const dashboard = ref(null);
    const loading = ref(true);
    const loadError = ref("");
    const quickActions = computed(() => [
      { label: "+ " + t("write"), path: "/admin/news/create", permission: "news.create" },
      { label: "+ " + t("aiAssistant"), path: "/admin/ai-news", permission: "ai.use" },
      { label: "+ " + t("uploadMedia"), path: "/admin/media", permission: "media.upload" },
      { label: "+ " + t("newAd"), path: "/admin/ads", permission: "ads.view" }
    ].filter((a) => auth.can(a.permission)));
    useHead({ title: "Dashboard \u2014 Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_AdminStat = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("dashboard"))}</h1><p class="text-sm text-ink-muted">${ssrInterpolate(unref(t)("greeting"))} ${ssrInterpolate((_a = unref(auth).user) == null ? void 0 : _a.name)}</p></div><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(quickActions), (action) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: action.path,
          to: action.path,
          class: "rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(action.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(action.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (unref(loadError)) {
        _push(`<p class="rounded-lg bg-breaking/10 p-4 text-breaking">${ssrInterpolate(unref(loadError))}</p>`);
      } else if (unref(dashboard)) {
        _push(`<div class="space-y-6"><section><h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("newsroom"))}</h2><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">`);
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("todayPublished"),
          value: unref(dashboard).news.todayPublished
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("breakingNow"),
          value: unref(dashboard).news.breaking,
          accent: "breaking"
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("drafts"),
          value: unref(dashboard).news.drafts,
          to: "/admin/news?status=draft"
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("reviewQueue"),
          value: unref(dashboard).news.reviewQueue,
          to: "/admin/review",
          accent: "warning"
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("scheduled"),
          value: unref(dashboard).news.scheduled,
          to: "/admin/news?status=scheduled"
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("totalPublished"),
          value: unref(dashboard).news.totalPublished
        }, null, _parent));
        _push(`</div></section><section><h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("readers"))}</h2><div class="grid gap-3 sm:grid-cols-3">`);
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("viewsToday"),
          value: unref(compact)(unref(dashboard).traffic.viewsToday)
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("uniqueVisitors"),
          value: unref(compact)(unref(dashboard).traffic.uniqueVisitorsToday)
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("videoViews"),
          value: unref(compact)(unref(dashboard).traffic.videoViews)
        }, null, _parent));
        _push(`</div></section>`);
        if (unref(auth).can("ads.view")) {
          _push(`<section><h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("advertising"))}</h2><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">`);
          _push(ssrRenderComponent(_component_AdminStat, {
            label: unref(t)("activeAds"),
            value: unref(dashboard).ads.activeAds
          }, null, _parent));
          _push(ssrRenderComponent(_component_AdminStat, {
            label: unref(t)("activeCampaigns"),
            value: unref(dashboard).ads.activeCampaigns
          }, null, _parent));
          _push(ssrRenderComponent(_component_AdminStat, {
            label: unref(t)("pendingApproval"),
            value: unref(dashboard).ads.pendingApproval,
            accent: "warning",
            to: "/admin/ads"
          }, null, _parent));
          _push(ssrRenderComponent(_component_AdminStat, {
            label: unref(t)("expired"),
            value: unref(dashboard).ads.expiredCampaigns
          }, null, _parent));
          _push(ssrRenderComponent(_component_AdminStat, {
            label: unref(t)("impressionsToday"),
            value: unref(compact)(unref(dashboard).ads.impressionsToday)
          }, null, _parent));
          _push(ssrRenderComponent(_component_AdminStat, {
            label: unref(t)("ctrToday"),
            value: `${unref(dashboard).ads.ctrToday.toFixed(2)}%`
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section><h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("distribution"))}</h2><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div class="card p-4"><p class="text-xs text-ink-muted">Telegram</p><p class="mt-1 flex items-center gap-2 font-semibold"><span class="${ssrRenderClass(["h-2 w-2 rounded-full", unref(dashboard).distribution.telegramConfigured ? "bg-success" : "bg-ink-muted"])}" aria-hidden="true"></span> ${ssrInterpolate(unref(dashboard).distribution.telegramConfigured ? unref(t)("connected") : unref(t)("notConfigured"))}</p><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("todayPublished"))} ${ssrInterpolate(unref(dashboard).distribution.telegramPostsToday)} `);
        if (unref(dashboard).distribution.telegramFailed) {
          _push(`<span class="text-breaking"> \xB7 ${ssrInterpolate(unref(t)("failed"))} ${ssrInterpolate(unref(dashboard).distribution.telegramFailed)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div>`);
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("pushSubscribers"),
          value: unref(compact)(unref(dashboard).distribution.pushSubscribers)
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("liveConnections"),
          value: unref(dashboard).distribution.websocketClients
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("readerTips"),
          value: unref(dashboard).moderation.pendingTips,
          accent: "warning",
          to: "/admin/tips"
        }, null, _parent));
        _push(`</div></section><p class="text-xs text-ink-muted">${ssrInterpolate(unref(t)("environment"))}: ${ssrInterpolate(unref(dashboard).system.environment)} \xB7 ${ssrInterpolate(unref(t)("serverTime"))}: ${ssrInterpolate(unref(dateTime)(unref(dashboard).system.serverTime))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DouS-sbO.mjs.map
