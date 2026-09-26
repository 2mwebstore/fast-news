import { _ as _sfc_main$1 } from "./VideoCard-CM0of8CH.js";
import { _ as _sfc_main$2 } from "./Pagination-BJJJD7ck.js";
import { defineComponent, computed, withAsyncContext, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { u as useLocale, f as useRoute, a as useApi, g as useAsyncData, b as useSiteSeo } from "../server.mjs";
import "./SmartImage-D_CQTSWD.js";
import "./useFormat-DT1zbtWM.js";
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t } = useLocale();
    const route = useRoute();
    const api = useApi();
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `videos-${page.value}`,
      async () => {
        const result = await api.list("/api/video", { page: page.value, limit: 24 });
        return { videos: result.data, meta: result.meta };
      },
      { watch: [page] }
    )), __temp = await __temp, __restore(), __temp);
    const videos = computed(() => data.value?.videos ?? []);
    const meta = computed(() => data.value?.meta);
    useSiteSeo({
      title: t("videoNews"),
      description: t("videoDesc"),
      path: "/video",
      robots: page.value > 1 ? "noindex, follow" : void 0
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VideoCard = _sfc_main$1;
      const _component_Pagination = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}><header class="border-b-2 border-brand pb-4"><h1 class="flex items-center gap-2 text-kh-2xl font-bold sm:text-kh-3xl"><span aria-hidden="true">🎥</span> ${ssrInterpolate(unref(t)("videoNews"))}</h1></header>`);
      if (!unref(videos).length) {
        _push(`<p class="py-12 text-center text-kh-base text-ink-muted">${ssrInterpolate(unref(t)("noVideos"))}</p>`);
      } else {
        _push(`<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(videos), (video) => {
          _push(ssrRenderComponent(_component_VideoCard, {
            key: video.id,
            video
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (unref(meta)) {
        _push(ssrRenderComponent(_component_Pagination, {
          meta: unref(meta),
          "base-path": "/video"
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/video/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-Bew68SgV.js.map
