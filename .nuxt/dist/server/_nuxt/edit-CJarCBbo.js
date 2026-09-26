import { f as useRoute, j as useHead, _ as __nuxt_component_0 } from "../server.mjs";
import { _ as _sfc_main$1 } from "./AdminArticleForm-Bpscy7by.js";
import { defineComponent, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
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
import "./AdminRichText-TekrMmFp.js";
import "./SelectField-vCKw5R9_.js";
import "./ImageField-BjAQOsbw.js";
import "./SmartImage-D_CQTSWD.js";
import "./useAdminApi-SsuwQDOr.js";
import "./AdminStatusBadge-Raz2wPvs.js";
import "./SearchableSelect-BQHPC7-8.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useMeta-DYb9wm5F.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    const route = useRoute();
    const articleId = computed(() => Number(route.params.id));
    useHead({ title: "Edit article — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AdminArticleForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-4 flex items-center justify-between"><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("editArticle"))}</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/news",
        class: "text-sm text-brand hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← ${ssrInterpolate(unref(t)("backToList"))}`);
          } else {
            return [
              createTextVNode("← " + toDisplayString(unref(t)("backToList")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_AdminArticleForm, { "article-id": unref(articleId) }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=edit-CJarCBbo.js.map
