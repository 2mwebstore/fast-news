import { j as useHead, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, watch, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import { u as useAdminApi } from "./useAdminApi-SsuwQDOr.js";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/sila/Desktop/fast-news/web/node_modules/unctx/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/sila/Desktop/fast-news/web/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/sila/Desktop/fast-news/web/node_modules/ufo/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/klona/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/@unhead/vue/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/perfect-debounce/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/destr/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/ohash/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analytics",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    const api = useAdminApi();
    const { compact } = useFormat();
    const data = ref(null);
    const days = ref(7);
    const loading = ref(true);
    async function load() {
      loading.value = true;
      try {
        data.value = await api.get("/api/admin/analytics", { days: days.value });
      } finally {
        loading.value = false;
      }
    }
    watch(days, load);
    const peak = computed(() => Math.max(1, ...(data.value?.daily ?? []).map((d) => d.views)));
    useHead({ title: "Analytics — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("analytics"))}</h1><div class="flex gap-2"><!--[-->`);
      ssrRenderList([1, 7, 30], (d) => {
        _push(`<button class="${ssrRenderClass(["rounded-full border px-3 py-1.5 text-sm", unref(days) === d ? "border-brand bg-brand text-white" : "border-line"])}">${ssrInterpolate(d === 1 ? unref(t)("today") : unref(t)("days", { n: d }))}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (unref(data)) {
        _push(`<div class="space-y-6"><p class="text-xs text-ink-muted">${ssrInterpolate(unref(data).note)}</p><section class="card p-5"><h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("viewsByDay"))}</h2><div class="flex h-40 items-end gap-1"><!--[-->`);
        ssrRenderList(unref(data).daily || [], (row) => {
          _push(`<div class="flex-1 rounded-t bg-brand/80 transition-all hover:bg-brand" style="${ssrRenderStyle({ height: `${Math.max(2, row.views / unref(peak) * 100)}%` })}"${ssrRenderAttr("title", `${row.day}: ${row.views} views, ${row.uniqueViews} unique`)}></div>`);
        });
        _push(`<!--]--></div>`);
        if (!unref(data).daily?.length) {
          _push(`<p class="py-8 text-center text-sm text-ink-muted">${ssrInterpolate(unref(t)("noData"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section><div class="grid gap-6 lg:grid-cols-3"><section class="card p-5 lg:col-span-2"><h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("topArticles"))}</h2><ol class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(data).topArticles || [], (article, i) => {
          _push(`<li class="flex items-center gap-3 py-2"><span class="w-6 text-sm font-bold text-ink-muted">${ssrInterpolate(i + 1)}</span>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/news/${article.slug}`,
            target: "_blank",
            class: "min-w-0 flex-1 truncate text-kh-sm hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(article.titleKh)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(article.titleKh), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<span class="shrink-0 text-sm font-semibold tabular-nums">${ssrInterpolate(unref(compact)(article.views))}</span></li>`);
        });
        _push(`<!--]--></ol>`);
        if (!unref(data).topArticles?.length) {
          _push(`<p class="py-8 text-center text-sm text-ink-muted">${ssrInterpolate(unref(t)("noData"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section><section class="card p-5"><h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("shares"))}</h2><ul class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(data).shares || [], (row) => {
          _push(`<li class="flex items-center justify-between py-2 text-sm"><span class="capitalize">${ssrInterpolate(row.network)}</span><span class="font-semibold tabular-nums">${ssrInterpolate(row.count)}</span></li>`);
        });
        _push(`<!--]--></ul>`);
        if (!unref(data).shares?.length) {
          _push(`<p class="py-8 text-center text-sm text-ink-muted">${ssrInterpolate(unref(t)("noData"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/analytics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=analytics-DovyH4Ze.js.map
