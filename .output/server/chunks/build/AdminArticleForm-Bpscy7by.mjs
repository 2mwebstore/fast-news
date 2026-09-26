import { _ as _sfc_main$1 } from './AdminRichText-TekrMmFp.mjs';
import { _ as _sfc_main$2 } from './SelectField-vCKw5R9_.mjs';
import { _ as _sfc_main$3 } from './ImageField-BjAQOsbw.mjs';
import { _ as _sfc_main$4 } from './AdminStatusBadge-Raz2wPvs.mjs';
import { i as useRouter, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as __nuxt_component_0 } from './SearchableSelect-BQHPC7-8.mjs';
import { defineComponent, reactive, computed, ref, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrLooseContain } from 'vue/server-renderer';
import { a as useAdminApi, b as useAuthStore, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import { u as useMeta } from './useMeta-DYb9wm5F.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminArticleForm",
  __ssrInlineRender: true,
  props: {
    articleId: {}
  },
  setup(__props) {
    const props = __props;
    useAdminApi();
    const auth = useAuthStore();
    useRouter();
    const { locale, t } = useAdminLocale();
    const { meta, toOptions, requiresDisclosure, transitionsFrom, statusLabel } = useMeta();
    const form = reactive({
      titleKh: "",
      titleEn: "",
      slug: "",
      summaryKh: "",
      summaryEn: "",
      contentKh: "",
      contentEn: "",
      categoryId: 0,
      authorId: null,
      imageUrl: "",
      imageAltKh: "",
      imageAltEn: "",
      imageCaption: "",
      imageWidth: 0,
      imageHeight: 0,
      imageIsAiGenerated: false,
      contentType: "editorial",
      sponsorName: "",
      sponsorUrl: "",
      isBreaking: false,
      isFeatured: false,
      isPinned: false,
      scheduledAt: null,
      aiAssisted: false
    });
    const seo = reactive({
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      seoKeywords: [],
      robots: ""
    });
    const keywordText = computed({
      get: () => seo.seoKeywords.join(", "),
      set: (value) => {
        seo.seoKeywords = value.split(",").map((k) => k.trim()).filter(Boolean);
      }
    });
    const robotsOptions = computed(() => [
      { value: "", label: t("robotsDefault") },
      { value: "index,follow", label: "index, follow" },
      { value: "noindex,follow", label: "noindex, follow" },
      { value: "index,nofollow", label: "index, nofollow" },
      { value: "noindex,nofollow", label: "noindex, nofollow" }
    ]);
    const categories = ref([]);
    const status = ref("draft");
    const checklist = ref(null);
    const currentId = ref(props.articleId);
    const currentSlug = ref("");
    const loading = ref(Boolean(props.articleId));
    const saving = ref(false);
    const message = ref("");
    const errorMessage = ref("");
    const aiBusy = ref(false);
    const isPublished = computed(() => status.value === "published");
    function onImageNatural(size) {
      form.imageWidth = size.width;
      form.imageHeight = size.height;
    }
    const permissionForStatus = {
      review: "news.edit",
      approved: "news.review",
      rejected: "news.review",
      published: "news.publish",
      scheduled: "news.publish",
      archived: "news.publish",
      draft: "news.edit"
    };
    const primaryStatus = {
      draft: "review",
      rejected: "review",
      review: "approved",
      approved: "published",
      scheduled: "published",
      published: ""
    };
    const availableTransitions = computed(
      () => transitionsFrom(status.value).filter((target) => {
        var _a;
        return auth.can((_a = permissionForStatus[target]) != null ? _a : "news.edit");
      }).map((target) => ({
        target,
        label: statusLabel(target, locale.value),
        primary: primaryStatus[status.value] === target
      }))
    );
    const contentTypeOptions = computed(() => {
      var _a;
      return toOptions((_a = meta.value) == null ? void 0 : _a.contentTypes, locale.value);
    });
    const contentTypeHint = computed(
      () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = meta.value) == null ? void 0 : _a.contentTypes) == null ? void 0 : _b.find((o) => o.value === form.contentType)) == null ? void 0 : _c.hint) != null ? _d : "";
      }
    );
    const needsSponsor = computed(() => requiresDisclosure(form.contentType));
    const categoryOptions = computed(
      () => categories.value.map((c) => ({
        value: c.id,
        // Show the parent so a subsection does not read like a top-level one.
        label: c.parentNameKh ? `${c.parentNameKh} \u203A ${c.nameKh}` : c.nameKh,
        sub: c.inNav ? c.nameEn : `${c.nameEn} \xB7 hidden from nav`
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminRichText = _sfc_main$1;
      const _component_SelectField = _sfc_main$2;
      const _component_ImageField = _sfc_main$3;
      const _component_AdminStatusBadge = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SearchableSelect = __nuxt_component_0;
      if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 text-center text-ink-muted" }, _attrs))}>${ssrInterpolate(unref(t)("loading"))}</div>`);
      } else {
        _push(`<form${ssrRenderAttrs(mergeProps({ class: "grid gap-6 lg:grid-cols-3" }, _attrs))}><div class="space-y-4 lg:col-span-2"><div class="card space-y-4 p-5"><div><label for="titleKh" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("headlineKh"))} *</label><input id="titleKh"${ssrRenderAttr("value", unref(form).titleKh)} required class="w-full rounded-lg border border-line px-3 py-2.5 text-kh-lg outline-none focus:border-brand"></div><div><label for="titleEn" class="mb-1 block text-sm font-semibold">Headline (English)</label><input id="titleEn"${ssrRenderAttr("value", unref(form).titleEn)} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("slugHintArticle"))}</p></div><div><label for="summaryKh" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("summaryKh"))}</label><textarea id="summaryKh" rows="3" class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand">${ssrInterpolate(unref(form).summaryKh)}</textarea></div><div><label for="contentKh" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("bodyKh"))} *</label>`);
        _push(ssrRenderComponent(_component_AdminRichText, {
          modelValue: unref(form).contentKh,
          "onUpdate:modelValue": ($event) => unref(form).contentKh = $event
        }, null, _parent));
        _push(`</div></div><div class="card space-y-4 p-5"><div class="flex items-center justify-between"><h2 class="font-bold">SEO</h2>`);
        if (unref(auth).can("ai.use")) {
          _push(`<button type="button"${ssrIncludeBooleanAttr(unref(aiBusy)) ? " disabled" : ""} class="rounded-lg border border-brand px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-50">${ssrInterpolate(unref(aiBusy) ? unref(t)("processing") : unref(t)("suggestWithAiShort"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label for="seoTitle" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("seoTitleLabel"))} <span class="font-normal text-ink-muted">(${ssrInterpolate(unref(seo).seoTitle.length)}/60)</span></label><input id="seoTitle"${ssrRenderAttr("value", unref(seo).seoTitle)} maxlength="120"${ssrRenderAttr("placeholder", unref(form).titleKh || unref(t)("seoFallbackTitle"))} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("seoOverrideHint"))}</p></div><div><label for="seoDescription" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("seoDescLabel"))} <span class="font-normal text-ink-muted">(${ssrInterpolate(unref(seo).seoDescription.length)}/155)</span></label><textarea id="seoDescription" rows="2" maxlength="320"${ssrRenderAttr("placeholder", unref(form).summaryKh || unref(t)("seoFallbackDesc"))} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand">${ssrInterpolate(unref(seo).seoDescription)}</textarea></div><div><label for="seoKeywords" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("seoKeywords"))}</label><input id="seoKeywords"${ssrRenderAttr("value", unref(keywordText))} placeholder="kun khmer, phnom penh" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("seoKeywordsHint"))}</p></div><div><label for="canonicalUrl" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("canonicalUrl"))}</label><input id="canonicalUrl"${ssrRenderAttr("value", unref(seo).canonicalUrl)} type="url" class="w-full rounded-lg border border-line px-3 py-2 font-mono text-xs outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("canonicalHint"))}</p></div>`);
        _push(ssrRenderComponent(_component_SelectField, {
          modelValue: unref(seo).robots,
          "onUpdate:modelValue": ($event) => unref(seo).robots = $event,
          options: unref(robotsOptions),
          label: unref(t)("robotsLabel")
        }, null, _parent));
        _push(`<details class="rounded-lg border border-line p-3"><summary class="cursor-pointer text-sm font-medium">${ssrInterpolate(unref(t)("socialCards"))}</summary><div class="mt-3 space-y-3"><input${ssrRenderAttr("value", unref(seo).ogTitle)}${ssrRenderAttr("placeholder", unref(t)("ogTitle"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><textarea rows="2"${ssrRenderAttr("placeholder", unref(t)("ogDescription"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(seo).ogDescription)}</textarea>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(seo).ogImage,
          "onUpdate:modelValue": ($event) => unref(seo).ogImage = $event,
          folder: "article",
          label: unref(t)("ogImage"),
          hint: unref(t)("ogImageHint"),
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(seo).twitterTitle)}${ssrRenderAttr("placeholder", unref(t)("twitterTitle"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><textarea rows="2"${ssrRenderAttr("placeholder", unref(t)("twitterDescription"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(seo).twitterDescription)}</textarea>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(seo).twitterImage,
          "onUpdate:modelValue": ($event) => unref(seo).twitterImage = $event,
          folder: "article",
          label: unref(t)("twitterImage"),
          hint: unref(t)("twitterImageHint"),
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`</div></details><button type="button"${ssrIncludeBooleanAttr(!unref(currentId)) ? " disabled" : ""} class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted disabled:opacity-50">${ssrInterpolate(unref(t)("saveSeoLabel"))}</button></div></div><aside class="space-y-4"><div class="card space-y-3 p-5"><div class="flex items-center justify-between"><span class="text-sm font-semibold">${ssrInterpolate(unref(t)("status"))}</span>`);
        _push(ssrRenderComponent(_component_AdminStatusBadge, { status: unref(status) }, null, _parent));
        _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(saving) ? unref(t)("saving") : unref(t)("save"))}</button><!--[-->`);
        ssrRenderList(unref(availableTransitions), (option) => {
          _push(`<button type="button" class="${ssrRenderClass([
            "w-full rounded-lg px-4 py-2.5 font-semibold",
            option.primary ? "bg-success text-white hover:opacity-90" : "border border-line hover:bg-surface-muted"
          ])}">${ssrInterpolate(option.label)}</button>`);
        });
        _push(`<!--]-->`);
        if (unref(message)) {
          _push(`<p class="rounded bg-success/10 p-2 text-sm text-success">${ssrInterpolate(unref(message))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorMessage)) {
          _push(`<p class="rounded bg-breaking/10 p-2 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isPublished) && unref(currentSlug)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/news/${unref(currentSlug)}`,
            target: "_blank",
            class: "block rounded-lg border border-line px-4 py-2 text-center text-sm hover:bg-surface-muted"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("viewOnSite"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("viewOnSite")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(checklist)) {
          _push(`<div class="card p-5"><h2 class="mb-2 text-sm font-bold">${ssrInterpolate(unref(t)("publishChecklist"))}</h2><p class="${ssrRenderClass([unref(checklist).readyToPublish ? "text-success" : "text-warning", "mb-3 text-xs"])}">${ssrInterpolate(unref(checklist).completed)}/${ssrInterpolate(unref(checklist).total)} \xB7 ${ssrInterpolate(unref(checklist).readyToPublish ? unref(t)("readyToPublish") : unref(t)("missingRequired"))}</p><ul class="space-y-1.5"><!--[-->`);
          ssrRenderList(unref(checklist).items, (item) => {
            _push(`<li class="flex items-center gap-2 text-sm"><span class="${ssrRenderClass(item.done ? "text-success" : "text-ink-muted")}" aria-hidden="true">${ssrInterpolate(item.done ? "\u2713" : "\u25CB")}</span><span class="${ssrRenderClass(item.done ? "" : "text-ink-muted")}">${ssrInterpolate(item.label)}`);
            if (item.required && !item.done) {
              _push(`<span class="text-breaking"> *</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span></li>`);
          });
          _push(`<!--]--></ul><p class="mt-3 border-t border-line pt-2 text-xs text-ink-muted">${ssrInterpolate(unref(checklist).note)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="card space-y-3 p-5">`);
        _push(ssrRenderComponent(_component_SearchableSelect, {
          modelValue: unref(form).categoryId,
          "onUpdate:modelValue": ($event) => unref(form).categoryId = $event,
          options: unref(categoryOptions),
          label: unref(t)("section"),
          required: "",
          clearable: false,
          placeholder: unref(t)("chooseSection"),
          "search-placeholder": unref(t)("searchSection")
        }, null, _parent));
        _push(ssrRenderComponent(_component_SelectField, {
          modelValue: unref(form).contentType,
          "onUpdate:modelValue": ($event) => unref(form).contentType = $event,
          options: unref(contentTypeOptions),
          label: unref(t)("contentTypeLabel")
        }, null, _parent));
        if (unref(contentTypeHint)) {
          _push(`<p class="-mt-1 text-xs text-ink-muted khmer-wrap">${ssrInterpolate(unref(contentTypeHint))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(needsSponsor)) {
          _push(`<div><label for="sponsorName" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("sponsorName"))} *</label><input id="sponsorName"${ssrRenderAttr("value", unref(form).sponsorName)} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).isFeatured) ? ssrLooseContain(unref(form).isFeatured, null) : unref(form).isFeatured) ? " checked" : ""} type="checkbox" class="rounded border-line"> ${ssrInterpolate(unref(t)("featureArticle"))}</label>`);
        if (unref(auth).can("news.publish")) {
          _push(`<label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).isBreaking) ? ssrLooseContain(unref(form).isBreaking, null) : unref(form).isBreaking) ? " checked" : ""} type="checkbox" class="rounded border-line"><span class="font-semibold text-breaking">${ssrInterpolate(unref(t)("breakingArticle"))}</span></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label for="scheduledAt" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("scheduleAt"))}</label><input id="scheduledAt"${ssrRenderAttr("value", unref(form).scheduledAt)} type="datetime-local" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div></div><div class="card space-y-3 p-5"><h2 class="text-sm font-bold">${ssrInterpolate(unref(t)("mainImage"))}</h2>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(form).imageUrl,
          "onUpdate:modelValue": ($event) => unref(form).imageUrl = $event,
          folder: "article",
          "max-size-mb": 10,
          ratio: "16 / 9",
          onNatural: onImageNatural,
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`<div><label for="imageAltKh" class="mb-1 block text-sm font-semibold">ALT text *</label><input id="imageAltKh"${ssrRenderAttr("value", unref(form).imageAltKh)} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("altRequired"))}</p></div><label class="flex items-start gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).imageIsAiGenerated) ? ssrLooseContain(unref(form).imageIsAiGenerated, null) : unref(form).imageIsAiGenerated) ? " checked" : ""} type="checkbox" class="mt-0.5 rounded border-line"><span>${ssrInterpolate(unref(t)("aiImage"))} <span class="block text-xs text-ink-muted">${ssrInterpolate(unref(t)("aiImageHint"))}</span></span></label></div></aside></form>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminArticleForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminArticleForm-Bpscy7by.mjs.map
