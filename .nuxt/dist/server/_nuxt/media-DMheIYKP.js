import { _ as __nuxt_component_2 } from "./ConfirmDialog-BxaeJdx9.js";
import { defineComponent, ref, watch, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import { u as useAdminApi, a as useAuthStore } from "./useAdminApi-SsuwQDOr.js";
import { j as useHead } from "../server.mjs";
import "./index-C4JB2zdt.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
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
  __name: "media",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    const api = useAdminApi();
    const auth = useAuthStore();
    const items = ref([]);
    const loading = ref(true);
    const uploading = ref(false);
    const errorMessage = ref("");
    const folder = ref("");
    const editing = ref(null);
    const pendingDelete = ref(null);
    const deleting = ref(false);
    async function load() {
      loading.value = true;
      try {
        const result = await api.list("/api/media", { folder: folder.value || void 0, limit: 60 });
        items.value = result.data ?? [];
      } finally {
        loading.value = false;
      }
    }
    watch(folder, load);
    async function confirmDelete() {
      if (!pendingDelete.value) return;
      deleting.value = true;
      errorMessage.value = "";
      try {
        await api.del(`/api/media/${pendingDelete.value.id}`);
        pendingDelete.value = null;
        await load();
      } catch (e) {
        errorMessage.value = e.data?.message || "Could not delete the file.";
      } finally {
        deleting.value = false;
      }
    }
    function sizeLabel(bytes) {
      return bytes > 1 << 20 ? `${(bytes / (1 << 20)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
    }
    useHead({ title: "Media — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-4 text-xl font-bold">${ssrInterpolate(unref(t)("mediaLibrary"))}</h1><div class="mb-4 flex flex-wrap items-center gap-3"><select class="rounded-lg border border-line px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(folder)) ? ssrLooseContain(unref(folder), "") : ssrLooseEqual(unref(folder), "")) ? " selected" : ""}>${ssrInterpolate(unref(t)("all"))}</option><option value="article"${ssrIncludeBooleanAttr(Array.isArray(unref(folder)) ? ssrLooseContain(unref(folder), "article") : ssrLooseEqual(unref(folder), "article")) ? " selected" : ""}>${ssrInterpolate(unref(t)("folderArticle"))}</option><option value="author"${ssrIncludeBooleanAttr(Array.isArray(unref(folder)) ? ssrLooseContain(unref(folder), "author") : ssrLooseEqual(unref(folder), "author")) ? " selected" : ""}>${ssrInterpolate(unref(t)("folderAuthor"))}</option><option value="ad"${ssrIncludeBooleanAttr(Array.isArray(unref(folder)) ? ssrLooseContain(unref(folder), "ad") : ssrLooseEqual(unref(folder), "ad")) ? " selected" : ""}>${ssrInterpolate(unref(t)("folderAd"))}</option><option value="video"${ssrIncludeBooleanAttr(Array.isArray(unref(folder)) ? ssrLooseContain(unref(folder), "video") : ssrLooseEqual(unref(folder), "video")) ? " selected" : ""}>${ssrInterpolate(unref(t)("folderVideo"))}</option></select><label class="cursor-pointer rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">${ssrInterpolate(unref(uploading) ? unref(t)("uploading") : unref(t)("uploadFile"))} <input type="file" multiple accept="image/*,video/*" class="hidden"${ssrIncludeBooleanAttr(unref(uploading)) ? " disabled" : ""}></label></div>`);
      if (unref(errorMessage)) {
        _push(`<p class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(items).length) {
        _push(`<p class="card py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("noFiles"))}</p>`);
      } else {
        _push(`<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(`<figure class="card overflow-hidden">`);
          if (item.mimeType.startsWith("image/")) {
            _push(`<img${ssrRenderAttr("src", item.url)}${ssrRenderAttr("alt", item.altKh || item.filename)} class="w-full bg-surface-muted object-cover" style="${ssrRenderStyle({ "aspect-ratio": "4/3" })}" loading="lazy">`);
          } else {
            _push(`<div class="flex items-center justify-center bg-surface-muted text-3xl" style="${ssrRenderStyle({ "aspect-ratio": "4/3" })}">🎬</div>`);
          }
          _push(`<figcaption class="p-2.5"><p class="truncate text-xs font-semibold"${ssrRenderAttr("title", item.filename)}>${ssrInterpolate(item.filename)}</p><p class="mt-0.5 text-[10px] text-ink-muted">${ssrInterpolate(item.width)}×${ssrInterpolate(item.height)} · ${ssrInterpolate(sizeLabel(item.sizeBytes))}</p>`);
          if (!item.altKh && !item.altEn) {
            _push(`<p class="mt-1 text-[10px] font-semibold text-warning">${ssrInterpolate(unref(t)("missingAlt"))}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (item.isAiGenerated) {
            _push(`<p class="mt-1 text-[10px] text-brand">${ssrInterpolate(unref(t)("aiImageLabel"))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-2 flex gap-1"><button class="flex-1 rounded border border-line px-2 py-1 text-[10px] hover:bg-surface-muted">${ssrInterpolate(unref(t)("edit2"))}</button>`);
          if (unref(auth).can("media.delete")) {
            _push(`<button class="rounded border border-breaking px-2 py-1 text-[10px] text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("delete"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></figcaption></figure>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(pendingDelete),
        title: "Delete this file permanently?",
        message: unref(pendingDelete)?.filename ?? "",
        "require-text": "DELETE",
        consequences: [
          "The file is removed from Cloudflare R2 and cannot be recovered.",
          "Any article still using it will show a broken image.",
          "Check where it is used before deleting."
        ],
        "confirm-label": "Delete file",
        busy: unref(deleting),
        onConfirm: confirmDelete,
        onCancel: ($event) => pendingDelete.value = null
      }, null, _parent));
      if (unref(editing)) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"><div class="w-full max-w-md rounded-xl bg-surface p-5"><h2 class="mb-3 font-bold">${ssrInterpolate(unref(t)("editFileInfo"))}</h2>`);
        if (unref(editing).mimeType.startsWith("image/")) {
          _push(`<img${ssrRenderAttr("src", unref(editing).url)} alt="" class="mb-3 w-full rounded-lg">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-3"><div><label class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("altTextKh"))}</label><input${ssrRenderAttr("value", unref(editing).altKh)} class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"></div><div><label class="mb-1 block text-sm font-semibold">ALT text (English)</label><input${ssrRenderAttr("value", unref(editing).altEn)} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div><div><label class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("imageCaption"))}</label><input${ssrRenderAttr("value", unref(editing).caption)} class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"></div><div><label class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("credit"))}</label><input${ssrRenderAttr("value", unref(editing).credit)} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div></div><div class="mt-4 flex gap-2"><button class="flex-1 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">${ssrInterpolate(unref(t)("save"))}</button><button class="rounded-lg border border-line px-4 py-2 hover:bg-surface-muted">${ssrInterpolate(unref(t)("cancel"))}</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/media.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=media-DMheIYKP.js.map
