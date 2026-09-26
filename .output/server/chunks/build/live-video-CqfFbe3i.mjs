import { _ as _sfc_main$1 } from './ArticleSidebarTrending-DEFecVDy.mjs';
import { u as useLocale, c as useAsyncApi, b as useSiteSeo, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import './TrendingList-BOx8JOT1.mjs';
import './NewsCard-HLdAEa9m.mjs';
import './SmartImage-D_CQTSWD.mjs';
import './BreakingBadge-BUl44HvT.mjs';
import './useFormat-DT1zbtWM.mjs';
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
  __name: "live-video",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t, title: localTitle } = useLocale();
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("live-video", "/api/live-video")), __temp = await __temp, __restore(), __temp);
    const live = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.live) != null ? _b : null;
    });
    useSiteSeo({
      title: live.value ? `\u{1F534} ${t("liveColon")} ${localTitle(live.value)}` : t("liveBroadcast"),
      description: t("liveVideoDesc"),
      path: "/live-video"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ArticleSidebarTrending = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}><header class="flex items-center gap-3 border-b-2 border-breaking pb-4"><h1 class="flex items-center gap-2 text-kh-2xl font-bold">`);
      if (unref(live)) {
        _push(`<span class="inline-block h-3 w-3 rounded-full bg-breaking animate-pulse-dot" aria-hidden="true"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(t)("liveBroadcast"))}</h1>`);
      if (unref(live)) {
        _push(`<span class="badge-breaking">LIVE</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
      if (unref(live)) {
        _push(`<div class="mt-6 grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2"><div class="overflow-hidden rounded-lg bg-ink" style="${ssrRenderStyle({ "aspect-ratio": "16 / 9" })}"><video${ssrRenderAttr("src", unref(live).hlsUrl || unref(live).sourceUrl || void 0)}${ssrRenderAttr("poster", unref(live).thumbnailUrl || void 0)} controls autoplay muted playsinline class="h-full w-full"></video></div><h2 class="mt-4 text-kh-xl font-bold khmer-wrap">${ssrInterpolate(unref(live).titleKh)}</h2>`);
        if (unref(live).descKh) {
          _push(`<p class="mt-2 text-kh-base text-ink-muted khmer-wrap">${ssrInterpolate(unref(live).descKh)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><aside class="space-y-8">`);
        _push(ssrRenderComponent(_component_ArticleSidebarTrending, null, null, _parent));
        _push(`</aside></div>`);
      } else {
        _push(`<div class="py-16 text-center"><p class="text-kh-lg font-semibold">${ssrInterpolate(unref(t)("nothingLiveNow"))}</p><p class="mt-2 text-kh-base text-ink-muted khmer-wrap">${ssrInterpolate(unref(t)("checkLatestVideos"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/video",
          class: "mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("watchVideos"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("watchVideos")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/live-video.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=live-video-CqfFbe3i.mjs.map
