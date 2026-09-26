import { defineComponent, ref, watch, computed, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import { u as useAdminApi } from "./useAdminApi-SsuwQDOr.js";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
import { j as useHead } from "../server.mjs";
import "pinia";
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
  __name: "tips",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    const api = useAdminApi();
    const { dateTime } = useFormat();
    const tips = ref([]);
    const loading = ref(true);
    const filter = ref("pending");
    async function load() {
      loading.value = true;
      try {
        const result = await api.list("/api/admin/tips", { status: filter.value || void 0, limit: 50 });
        tips.value = result.data ?? [];
      } finally {
        loading.value = false;
      }
    }
    watch(filter, load);
    const filters = computed(() => [
      { value: "pending", label: t("statusPending") },
      { value: "reviewing", label: t("statusReviewing") },
      { value: "verified", label: t("verify") },
      { value: "rejected", label: t("reject") },
      { value: "", label: t("all") }
    ]);
    useHead({ title: "Reader tips — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-1 text-xl font-bold">${ssrInterpolate(unref(t)("readerTips"))}</h1><p class="mb-4 text-sm text-ink-muted">${ssrInterpolate(unref(t)("tipsIntro"))}</p><div class="mb-4 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(filters), (f) => {
        _push(`<button class="${ssrRenderClass([
          "rounded-full border px-3 py-1.5 text-sm",
          unref(filter) === f.value ? "border-brand bg-brand text-white" : "border-line hover:border-brand"
        ])}">${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(tips).length) {
        _push(`<p class="card py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("noTips"))}</p>`);
      } else {
        _push(`<ul class="space-y-3"><!--[-->`);
        ssrRenderList(unref(tips), (tip) => {
          _push(`<li class="card p-4"><div class="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted"><span class="rounded bg-ink/10 px-1.5 py-0.5 font-semibold">${ssrInterpolate(tip.status)}</span><span>${ssrInterpolate(unref(dateTime)(tip.createdAt))}</span>`);
          if (tip.location) {
            _push(`<span>· ${ssrInterpolate(tip.location)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (tip.name) {
            _push(`<span>· ${ssrInterpolate(tip.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="whitespace-pre-line text-kh-base khmer-wrap">${ssrInterpolate(tip.description)}</p>`);
          if (tip.contact) {
            _push(`<p class="mt-2 text-xs text-ink-muted">${ssrInterpolate(unref(t)("contactLabel"))} ${ssrInterpolate(tip.contact)} <span class="italic">${ssrInterpolate(unref(t)("forVerificationOnly"))}</span></p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-3 flex flex-wrap gap-2"><button class="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-muted">${ssrInterpolate(unref(t)("statusReviewing"))}</button><button class="rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">${ssrInterpolate(unref(t)("statusVerified"))}</button><button class="rounded-lg border border-breaking px-3 py-1.5 text-sm text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("reject"))}</button></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/tips.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=tips-BKn6BFiD.js.map
