import { _ as _sfc_main$1 } from "./AdminCreativeForm-BesEg_Gf.js";
import { defineComponent, computed, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { f as useRoute, j as useHead } from "../server.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import "./SearchableSelect-BQHPC7-8.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./ImageField-BjAQOsbw.js";
import "./SmartImage-D_CQTSWD.js";
import "./useAdminApi-SsuwQDOr.js";
import "pinia";
import "./SelectField-vCKw5R9_.js";
import "./useMeta-DYb9wm5F.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/sila/Desktop/fast-news/web/node_modules/unctx/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/h3/dist/index.mjs";
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
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t } = useAdminLocale();
    const creativeId = computed(() => Number(route.params.id));
    useHead({ title: "Edit creative — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminCreativeForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-4 text-xl font-bold">${ssrInterpolate(unref(t)("edit"))} creative</h1>`);
      _push(ssrRenderComponent(_component_AdminCreativeForm, { "creative-id": unref(creativeId) }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/ads/creatives/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=edit-JHa60Z1W.js.map
