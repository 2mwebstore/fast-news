import { _ as _sfc_main$1 } from './AdminVideoForm-BfH4VZzr.mjs';
import { defineComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import { j as useHead } from './server.mjs';
import './YouTubeEmbed-Dg97tQgT.mjs';
import './SelectField-vCKw5R9_.mjs';
import './ImageField-BjAQOsbw.mjs';
import './SmartImage-D_CQTSWD.mjs';
import './SearchableSelect-BQHPC7-8.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'pinia';
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
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    useHead({ title: "New video \u2014 Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminVideoForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-4 text-xl font-bold">${ssrInterpolate(unref(t)("create"))} \u2014 ${ssrInterpolate(unref(t)("videos"))}</h1>`);
      _push(ssrRenderComponent(_component_AdminVideoForm, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/videos/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-DFHbtKvl.mjs.map
