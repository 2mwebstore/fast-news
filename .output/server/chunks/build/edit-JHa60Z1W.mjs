import { _ as _sfc_main$1 } from './AdminCreativeForm-BesEg_Gf.mjs';
import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { f as useRoute, j as useHead } from './server.mjs';
import { u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import './SearchableSelect-BQHPC7-8.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './ImageField-BjAQOsbw.mjs';
import './SmartImage-D_CQTSWD.mjs';
import './SelectField-vCKw5R9_.mjs';
import './useMeta-DYb9wm5F.mjs';
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
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t } = useAdminLocale();
    const creativeId = computed(() => Number(route.params.id));
    useHead({ title: "Edit creative \u2014 Newsroom" });
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

export { _sfc_main as default };
//# sourceMappingURL=edit-JHa60Z1W.mjs.map
