import { f as useRoute, j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './AdminArticleForm-Bpscy7by.mjs';
import { defineComponent, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
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
import './AdminRichText-TekrMmFp.mjs';
import './SelectField-vCKw5R9_.mjs';
import './ImageField-BjAQOsbw.mjs';
import './SmartImage-D_CQTSWD.mjs';
import './AdminStatusBadge-Raz2wPvs.mjs';
import './SearchableSelect-BQHPC7-8.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './useMeta-DYb9wm5F.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    const route = useRoute();
    const articleId = computed(() => Number(route.params.id));
    useHead({ title: "Edit article \u2014 Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_AdminArticleForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-4 flex items-center justify-between"><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("editArticle"))}</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/news",
        class: "text-sm text-brand hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 ${ssrInterpolate(unref(t)("backToList"))}`);
          } else {
            return [
              createTextVNode("\u2190 " + toDisplayString(unref(t)("backToList")), 1)
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

export { _sfc_main as default };
//# sourceMappingURL=edit-CJarCBbo.mjs.map
