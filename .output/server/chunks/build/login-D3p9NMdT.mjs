import { f as useRoute, j as useHead, k as useSeoMeta, l as _sfc_main$4 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAdminLocale, b as useAuthStore } from './useAdminApi-SsuwQDOr.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    useAuthStore();
    useRoute();
    const email = ref("");
    const password = ref("");
    const busy = ref(false);
    const errorMessage = ref("");
    useHead({ title: "Sign in \u2014 Newsroom" });
    useSeoMeta({ robots: "noindex, nofollow" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TheLogo = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen items-center justify-center bg-surface-muted px-4" }, _attrs))}><div class="w-full max-w-sm"><div class="mb-6 text-center">`);
      _push(ssrRenderComponent(_component_TheLogo, { class: "mx-auto h-10 w-auto" }, null, _parent));
      _push(`<p class="mt-2 text-xs uppercase tracking-widest text-ink-muted">Newsroom sign in</p></div><form class="card space-y-4 p-6"><div><label for="email" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("email"))}</label><input id="email"${ssrRenderAttr("value", unref(email))} type="email" required autocomplete="username" class="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-brand"></div><div><label for="password" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("password"))}</label><input id="password"${ssrRenderAttr("value", unref(password))} type="password" required autocomplete="current-password" class="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-brand"></div>`);
      if (unref(errorMessage)) {
        _push(`<p class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(busy)) ? " disabled" : ""} class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(busy) ? unref(t)("loading") : unref(t)("signIn"))}</button></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-D3p9NMdT.mjs.map
