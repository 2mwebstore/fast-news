import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { u as useLocale, c as useAsyncApi, b as useSiteSeo } from "../server.mjs";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
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
  __name: "traffic",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t } = useLocale();
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("traffic", "/api/traffic-status")), __temp = await __temp, __restore(), __temp);
    const { dateTime } = useFormat();
    const levelStyles = computed(() => ({
      normal: { label: t("trafficNormal"), dot: "bg-success", text: "text-success" },
      moderate: { label: t("trafficModerate"), dot: "bg-warning", text: "text-warning" },
      heavy: { label: t("trafficHeavy"), dot: "bg-breaking", text: "text-breaking" }
    }));
    useSiteSeo({
      title: t("trafficTitle"),
      description: t("trafficIntro"),
      path: "/traffic"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content max-w-prose" }, _attrs))}><h1 class="flex items-center gap-2 text-kh-2xl font-bold"><span aria-hidden="true">🚦</span> ${ssrInterpolate(unref(t)("trafficTitle"))}</h1><div class="mt-4 rounded-lg border border-line bg-surface-muted p-4"><p class="text-kh-sm khmer-wrap">${ssrInterpolate(unref(data)?.disclaimerKh)}</p><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(data)?.disclaimer)}</p>`);
      if (unref(data)?.lastUpdated) {
        _push(`<p class="mt-2 text-xs text-ink-muted">${ssrInterpolate(unref(t)("lastAssessed"))} ${ssrInterpolate(unref(dateTime)(unref(data).lastUpdated))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><ul class="mt-6 divide-y divide-line"><!--[-->`);
      ssrRenderList(unref(data)?.routes ?? [], (route) => {
        _push(`<li class="flex items-center gap-3 py-4"><span class="${ssrRenderClass(["h-3 w-3 shrink-0 rounded-full", unref(levelStyles)[route.level]?.dot])}" aria-hidden="true"></span><div class="min-w-0 flex-1"><p class="text-kh-base font-semibold khmer-wrap">${ssrInterpolate(route.routeKh)}</p><p class="text-xs text-ink-muted">${ssrInterpolate(route.routeEn)}</p>`);
        if (route.noteKh) {
          _push(`<p class="mt-1 text-kh-sm text-ink-muted khmer-wrap">${ssrInterpolate(route.noteKh)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="shrink-0 text-right"><p class="${ssrRenderClass(["text-kh-sm font-bold", unref(levelStyles)[route.level]?.text])}">${ssrInterpolate(unref(levelStyles)[route.level]?.label)}</p><p class="text-[10px] text-ink-muted">${ssrInterpolate(route.sourceLabel)}</p></div></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/traffic.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=traffic-D_5QIvju.js.map
