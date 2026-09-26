import { _ as _sfc_main$1 } from "./SelectField-vCKw5R9_.js";
import { _ as _sfc_main$2 } from "./SearchInput-BSakqtC5.js";
import { _ as __nuxt_component_2 } from "./ConfirmDialog-BxaeJdx9.js";
import { defineComponent, ref, computed, mergeProps, unref, isRef, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminApi } from "./useAdminApi-SsuwQDOr.js";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const api = useAdminApi();
    const { t, locale } = useAdminLocale();
    const categories = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");
    const notice = ref("");
    const search = ref("");
    function emptyForm() {
      return {
        nameKh: "",
        nameEn: "",
        slug: "",
        descKh: "",
        descEn: "",
        icon: "",
        color: "#C8102E",
        position: 0,
        inNav: true,
        isActive: true,
        parentId: "",
        seoTitleKh: "",
        seoDescKh: "",
        seoTitleEn: "",
        seoDescEn: ""
      };
    }
    const form = ref(emptyForm());
    const editingId = ref(null);
    const panelOpen = ref(false);
    const saving = ref(false);
    const deleteTarget = ref(null);
    const deleting = ref(false);
    function name(category) {
      return locale.value === "en" ? category.nameEn || category.nameKh : category.nameKh;
    }
    function parentName(category) {
      return locale.value === "en" ? category.parentNameEn || category.parentNameKh : category.parentNameKh;
    }
    const rows = computed(() => {
      const term = search.value.trim().toLowerCase();
      if (!term) return categories.value;
      return categories.value.filter(
        (category) => category.nameKh.toLowerCase().includes(term) || category.nameEn.toLowerCase().includes(term) || category.slug.includes(term)
      );
    });
    const parentOptions = computed(() => [
      { value: "", label: t("noParent") },
      ...categories.value.filter((category) => category.parentId === null && category.id !== editingId.value).map((category) => ({ value: category.id, label: name(category) }))
    ]);
    async function load() {
      loading.value = true;
      errorMessage.value = "";
      try {
        categories.value = await api.get("/api/admin/categories", {
          includeInactive: "true"
        });
      } catch (e) {
        errorMessage.value = e.data?.message || t("sectionsLoadFailed");
      } finally {
        loading.value = false;
      }
    }
    const canSave = computed(
      () => !saving.value && form.value.nameKh.trim() !== "" && form.value.nameEn.trim() !== ""
    );
    async function confirmDelete() {
      const target = deleteTarget.value;
      if (!target) return;
      deleting.value = true;
      errorMessage.value = "";
      try {
        await api.del(`/api/admin/categories/${target.id}`);
        deleteTarget.value = null;
        notice.value = t("saved");
        await load();
      } catch (e) {
        errorMessage.value = e.data?.message || t("sectionDeleteFailed");
        deleteTarget.value = null;
      } finally {
        deleting.value = false;
      }
    }
    useHead({ title: `${t("sections")} · CFN Admin` });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SelectField = _sfc_main$1;
      const _component_SearchInput = _sfc_main$2;
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><header class="flex flex-wrap items-start justify-between gap-3"><div><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("sections"))}</h1><p class="mt-1 max-w-2xl text-sm text-ink-muted">${ssrInterpolate(unref(t)("sectionsIntro"))}</p></div><button type="button" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"> + ${ssrInterpolate(unref(t)("newSection"))}</button></header>`);
      if (unref(errorMessage)) {
        _push(`<p class="rounded-lg bg-breaking/10 px-4 py-3 text-sm text-breaking" role="alert">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(notice)) {
        _push(`<p class="rounded-lg bg-brand/10 px-4 py-3 text-sm text-brand" role="status">${ssrInterpolate(unref(notice))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(panelOpen)) {
        _push(`<form class="card space-y-4 p-4"><h2 class="text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(editingId) ? unref(t)("editSection") : unref(t)("newSection"))}</h2><div class="grid gap-4 sm:grid-cols-2"><div><label for="c-name-kh" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("nameKhLabel"))} *</label><input id="c-name-kh"${ssrRenderAttr("value", unref(form).nameKh)} required class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"></div><div><label for="c-name-en" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("nameEnLabel"))} *</label><input id="c-name-en"${ssrRenderAttr("value", unref(form).nameEn)} required class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div><div><label for="c-slug" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("slugLabel"))}</label><div class="flex items-center gap-1"><span class="shrink-0 text-sm text-ink-muted">/category/</span><input id="c-slug"${ssrRenderAttr("value", unref(form).slug)} placeholder="business" class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand"></div><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("slugHint"))}</p></div>`);
        _push(ssrRenderComponent(_component_SelectField, {
          modelValue: unref(form).parentId,
          "onUpdate:modelValue": ($event) => unref(form).parentId = $event,
          options: unref(parentOptions),
          label: unref(t)("parentSection")
        }, null, _parent));
        _push(`<div class="grid grid-cols-3 gap-3"><div><label for="c-icon" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("iconLabel"))}</label><input id="c-icon"${ssrRenderAttr("value", unref(form).icon)} maxlength="4" placeholder="📈" class="w-full rounded-lg border border-line px-3 py-2 text-center text-sm outline-none focus:border-brand"></div><div><label for="c-color" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("colorLabel"))}</label><input id="c-color"${ssrRenderAttr("value", unref(form).color)} type="color" class="h-[42px] w-full rounded-lg border border-line px-1 outline-none focus:border-brand"></div><div><label for="c-position" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("positionLabel"))}</label><input id="c-position"${ssrRenderAttr("value", unref(form).position)} type="number" min="0" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div></div><div class="space-y-2 self-end"><label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).inNav) ? ssrLooseContain(unref(form).inNav, null) : unref(form).inNav) ? " checked" : ""} type="checkbox" class="rounded border-line"> ${ssrInterpolate(unref(t)("showInNav"))}</label><label class="flex items-start gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).isActive) ? ssrLooseContain(unref(form).isActive, null) : unref(form).isActive) ? " checked" : ""} type="checkbox" class="mt-0.5 rounded border-line"><span>${ssrInterpolate(unref(t)("activeSection"))} <span class="block text-xs text-ink-muted">${ssrInterpolate(unref(t)("activeHint"))}</span></span></label></div><div><label for="c-desc-kh" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("descKhLabel"))}</label><textarea id="c-desc-kh" rows="2" class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand">${ssrInterpolate(unref(form).descKh)}</textarea></div><div><label for="c-desc-en" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("descEnLabel"))}</label><textarea id="c-desc-en" rows="2" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(form).descEn)}</textarea></div></div><details class="rounded-lg border border-line p-3"><summary class="cursor-pointer text-sm font-medium">${ssrInterpolate(unref(t)("seoFields"))}</summary><div class="mt-3 grid gap-3 sm:grid-cols-2"><input${ssrRenderAttr("value", unref(form).seoTitleKh)}${ssrRenderAttr("placeholder", `${unref(t)("seoTitleLabel")} (ខ្មែរ)`)} class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"><input${ssrRenderAttr("value", unref(form).seoTitleEn)}${ssrRenderAttr("placeholder", `${unref(t)("seoTitleLabel")} (EN)`)} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><textarea rows="2"${ssrRenderAttr("placeholder", `${unref(t)("seoDescLabel")} (ខ្មែរ)`)} class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand">${ssrInterpolate(unref(form).seoDescKh)}</textarea><textarea rows="2"${ssrRenderAttr("placeholder", `${unref(t)("seoDescLabel")} (EN)`)} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(form).seoDescEn)}</textarea></div></details><div class="flex gap-2"><button type="submit" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(canSave)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? unref(t)("saving") : unref(t)("save"))}</button><button type="button" class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted">${ssrInterpolate(unref(t)("cancel"))}</button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_SearchInput, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: unref(t)("searchSections"),
        label: unref(t)("search")
      }, null, _parent));
      if (unref(loading)) {
        _push(`<p class="text-sm text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(rows).length) {
        _push(`<p class="card p-6 text-center text-sm text-ink-muted">${ssrInterpolate(unref(search) ? unref(t)("noResults") : unref(t)("noSections"))}</p>`);
      } else {
        _push(`<div class="card overflow-hidden"><ul class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(rows), (category, index) => {
          _push(`<li class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded text-base" style="${ssrRenderStyle({ backgroundColor: `${category.color || "#C8102E"}1A`, color: category.color || "#C8102E" })}" aria-hidden="true">${ssrInterpolate(category.icon || "⊞")}</span><div class="min-w-0 flex-1"><p class="flex flex-wrap items-center gap-2 text-kh-sm font-semibold">`);
          if (category.parentId) {
            _push(`<span class="text-ink-muted">${ssrInterpolate(parentName(category))} ›</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(name(category))} `);
          if (!category.isActive) {
            _push(`<span class="rounded bg-ink/10 px-1.5 py-0.5 text-xs font-normal text-ink-muted">${ssrInterpolate(unref(t)("hidden"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p><div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted"><code class="font-mono">/category/${ssrInterpolate(category.slug)}</code><span>· ${ssrInterpolate(category.inNav ? unref(t)("inMenu") : unref(t)("notInMenu"))}</span><span>· ${ssrInterpolate(unref(t)("articlesCount", { n: category.articleCount }))}</span>`);
          if (category.videoCount) {
            _push(`<span>· ${ssrInterpolate(unref(t)("videosCount", { n: category.videoCount }))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex shrink-0 items-center gap-1"><button type="button" class="rounded px-2 py-1 text-sm hover:bg-line disabled:opacity-30"${ssrIncludeBooleanAttr(!!unref(search) || index === 0) ? " disabled" : ""} aria-label="Move up">↑</button><button type="button" class="rounded px-2 py-1 text-sm hover:bg-line disabled:opacity-30"${ssrIncludeBooleanAttr(!!unref(search) || index === unref(rows).length - 1) ? " disabled" : ""} aria-label="Move down">↓</button><button type="button" class="rounded-lg border border-line px-3 py-1 text-sm font-semibold hover:bg-surface-muted">${ssrInterpolate(unref(t)("edit"))}</button><button type="button" class="rounded px-2 py-1 text-sm text-breaking hover:bg-breaking/10">${ssrInterpolate(unref(t)("remove"))}</button></div></li>`);
        });
        _push(`<!--]--></ul></div>`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(deleteTarget),
        title: unref(t)("deleteSectionTitle"),
        message: unref(deleteTarget) ? unref(t)("deleteSectionMessage", { name: name(unref(deleteTarget)) }) : "",
        consequences: unref(deleteTarget) && (unref(deleteTarget).articleCount || unref(deleteTarget).videoCount) ? [unref(t)("sectionHasContent")] : [],
        "confirm-label": unref(t)("remove"),
        "cancel-label": unref(t)("cancel"),
        busy: unref(deleting),
        onConfirm: confirmDelete,
        onCancel: ($event) => deleteTarget.value = null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/categories/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CBkE8nZT.js.map
