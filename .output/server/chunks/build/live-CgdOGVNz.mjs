import { _ as _sfc_main$1 } from './BreakingBadge-BUl44HvT.mjs';
import { u as useLocale, c as useAsyncApi, b as useSiteSeo, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$2 } from './AdSlot-DGDlUSRS.mjs';
import { _ as _sfc_main$3 } from './FiveMinuteNews-DBAb4Crl.mjs';
import { _ as _sfc_main$4 } from './NewsPulse--M0PNvod.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useBreakingStore, a as useBreakingSocket } from './useBreakingSocket-Cp17g4So.mjs';
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
import './NewsCard-HLdAEa9m.mjs';
import './SmartImage-D_CQTSWD.mjs';
import './SectionHeading-CJAAYZij.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "live",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t } = useLocale();
    const { data: initial } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("live-feed", "/api/live", { limit: 30 })), __temp = await __temp, __restore(), __temp);
    const store = useBreakingStore();
    const { connected } = useBreakingSocket();
    const { time, relativeKh } = useFormat();
    const items = computed(() => {
      var _a;
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      for (const article of [...store.items, ...(_a = initial.value) != null ? _a : []]) {
        if (seen.has(article.id)) continue;
        seen.add(article.id);
        out.push(article);
      }
      return out;
    });
    useSiteSeo({
      title: `${t("live")} \u2014 LIVE`,
      description: t("liveDesc"),
      path: "/live"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BreakingBadge = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_AdSlot = _sfc_main$2;
      const _component_FiveMinuteNews = _sfc_main$3;
      const _component_NewsPulse = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}><header class="flex flex-wrap items-center gap-3 border-b-2 border-breaking pb-4"><h1 class="flex items-center gap-2 text-kh-2xl font-bold sm:text-kh-3xl"><span class="inline-block h-3 w-3 rounded-full bg-breaking animate-pulse-dot" aria-hidden="true"></span> ${ssrInterpolate(unref(t)("live"))}</h1><span class="text-sm text-ink-muted">LIVE NOW</span><span class="${ssrRenderClass([
        "ml-auto rounded-full px-2.5 py-1 text-xs font-semibold",
        unref(connected) ? "bg-success/10 text-success" : "bg-ink/10 text-ink-muted"
      ])}">${ssrInterpolate(unref(connected) ? unref(t)("liveUpdating") : unref(t)("refreshingEachMinute"))}</span></header><div class="mt-6 grid gap-8 lg:grid-cols-3"><ol class="lg:col-span-2" aria-live="polite"><!--[-->`);
      ssrRenderList(unref(items), (article) => {
        _push(`<li class="relative flex gap-4 border-l-2 border-line pb-6 pl-5 last:pb-0"><span class="${ssrRenderClass([
          "absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-4 ring-surface",
          article.isBreaking ? "bg-breaking" : "bg-brand"
        ])}" aria-hidden="true"></span><div class="min-w-0 flex-1"><div class="mb-1 flex flex-wrap items-center gap-2 text-xs">`);
        if (article.publishedAt) {
          _push(`<time${ssrRenderAttr("datetime", article.publishedAt)} class="font-bold tabular-nums text-ink">${ssrInterpolate(unref(time)(article.publishedAt))}</time>`);
        } else {
          _push(`<!---->`);
        }
        if (article.isBreaking) {
          _push(ssrRenderComponent(_component_BreakingBadge, { small: "" }, null, _parent));
        } else if (article.category) {
          _push(`<span class="text-brand">${ssrInterpolate(article.category.nameKh)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-ink-muted">${ssrInterpolate(unref(relativeKh)(article.publishedAt))}</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/news/${article.slug}`,
          class: "group flex gap-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="min-w-0 flex-1 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand"${_scopeId}>${ssrInterpolate(article.titleKh)}</h2>`);
              if (article.imageUrl) {
                _push2(`<img${ssrRenderAttr("src", article.imageUrl)}${ssrRenderAttr("alt", article.imageAlt || article.titleKh)} width="96" height="54" class="h-auto w-20 shrink-0 rounded object-cover sm:w-24" loading="lazy" decoding="async"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("h2", { class: "min-w-0 flex-1 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand" }, toDisplayString(article.titleKh), 1),
                article.imageUrl ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: article.imageUrl,
                  alt: article.imageAlt || article.titleKh,
                  width: "96",
                  height: "54",
                  class: "h-auto w-20 shrink-0 rounded object-cover sm:w-24",
                  loading: "lazy",
                  decoding: "async"
                }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></li>`);
      });
      _push(`<!--]--></ol><aside class="space-y-8">`);
      _push(ssrRenderComponent(_component_AdSlot, {
        position: "HOME_SIDEBAR",
        "collapse-when-empty": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_FiveMinuteNews, null, null, _parent));
      _push(ssrRenderComponent(_component_NewsPulse, null, null, _parent));
      _push(`</aside></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/live.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=live-CgdOGVNz.mjs.map
