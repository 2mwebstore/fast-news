import { _ as _sfc_main$5 } from './AdSlot-DGDlUSRS.mjs';
import { f as useRoute, a as useApi, u as useLocale, g as useAsyncData, p as pageError, h as createError, b as useSiteSeo, m as useArticleSchema, n as useHreflang, o as useBreadcrumbSchema, _ as __nuxt_component_0$1, e as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$6 } from './BreakingBadge-BUl44HvT.mjs';
import { a as _sfc_main$2$1, b as _sfc_main$3$1, _ as _sfc_main$9 } from './NewsCard-HLdAEa9m.mjs';
import { defineComponent, computed, withAsyncContext, ref, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, createVNode, mergeProps, useSSRContext, watch } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderSlot, ssrRenderTeleport } from 'vue/server-renderer';
import { o as onKeyStroke } from './index-C4JB2zdt.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as _sfc_main$7 } from './SmartImage-D_CQTSWD.mjs';
import { u as useFormat } from './useFormat-DT1zbtWM.mjs';
import { _ as _sfc_main$c } from './ShareLinks-D6Mi_PUz.mjs';
import { _ as _sfc_main$8 } from './SectionHeading-CJAAYZij.mjs';
import { _ as _sfc_main$a } from './ArticleSidebarTrending-DEFecVDy.mjs';
import { _ as _sfc_main$b } from './FiveMinuteNews-DBAb4Crl.mjs';
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
import './TrendingList-BOx8JOT1.mjs';

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ImageViewer",
  __ssrInlineRender: true,
  props: {
    src: {},
    alt: {},
    caption: {},
    aiGenerated: { type: Boolean }
  },
  setup(__props) {
    const { t } = useLocale();
    const open = ref(false);
    ref(null);
    function hide() {
      open.value = false;
    }
    watch(open, async (isOpen) => {
      return;
    });
    onKeyStroke("Escape", () => {
      if (open.value) hide();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-30e6965c>`);
      if (__props.src) {
        _push(`<button type="button" class="group/zoom relative block w-full cursor-zoom-in"${ssrRenderAttr("aria-label", unref(t)("enlargeImage", { alt: __props.alt }))} data-v-30e6965c>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`<span class="pointer-events-none absolute right-2 top-2 rounded-full bg-ink/60 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover/zoom:opacity-100" aria-hidden="true" data-v-30e6965c><svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-30e6965c><circle cx="11" cy="11" r="7" data-v-30e6965c></circle><path d="M20 20l-3.5-3.5M11 8v6M8 11h6" stroke-linecap="round" data-v-30e6965c></path></svg></span></button>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(open)) {
          _push2(`<div class="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm" role="dialog" aria-modal="true"${ssrRenderAttr("aria-label", __props.alt)} tabindex="-1" data-v-30e6965c><div class="flex justify-end p-4" data-v-30e6965c><button type="button" class="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"${ssrRenderAttr("aria-label", unref(t)("close"))} data-v-30e6965c><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-30e6965c><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" data-v-30e6965c></path></svg></button></div><div class="flex min-h-0 flex-1 items-center justify-center px-4" data-v-30e6965c><img${ssrRenderAttr("src", __props.src)}${ssrRenderAttr("alt", __props.alt)} class="max-h-full max-w-full object-contain" data-v-30e6965c></div>`);
          if (__props.caption || __props.aiGenerated) {
            _push2(`<div class="px-6 py-5 text-center" data-v-30e6965c>`);
            if (__props.caption) {
              _push2(`<p class="mx-auto max-w-prose text-kh-sm text-white/80 khmer-wrap" data-v-30e6965c>${ssrInterpolate(__props.caption)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.aiGenerated) {
              _push2(`<p class="mt-2 text-xs text-white/60" data-v-30e6965c>${ssrInterpolate(unref(t)("aiImageIllustration"))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageViewer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-30e6965c"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AiSummary",
  __ssrInlineRender: true,
  props: {
    points: {},
    generatedAt: {}
  },
  setup(__props) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: "mt-6 rounded-lg border border-brand/25 bg-brand/5 p-5",
        "aria-labelledby": "ai-summary-heading"
      }, _attrs))}><h2 id="ai-summary-heading" class="mb-3 flex items-center gap-2 text-kh-lg font-bold text-brand"><span aria-hidden="true">\u26A1</span> ${ssrInterpolate(unref(t)("aiSummary"))}</h2><ul class="space-y-2"><!--[-->`);
      ssrRenderList(__props.points, (point, i) => {
        _push(`<li class="flex gap-2 text-kh-base khmer-wrap"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true"></span><span>${ssrInterpolate(point)}</span></li>`);
      });
      _push(`<!--]--></ul><p class="mt-4 border-t border-brand/20 pt-3 text-xs text-ink-muted khmer-wrap">${ssrInterpolate(unref(t)("aiSummaryFootnote"))}</p></aside>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AiSummary.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CorrectionNotice",
  __ssrInlineRender: true,
  props: {
    corrections: {}
  },
  setup(__props) {
    const { t } = useLocale();
    const { dateTime, iso } = useFormat();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: "mt-6 rounded-lg border-l-4 border-warning bg-warning/5 p-4",
        "aria-labelledby": "correction-heading"
      }, _attrs))}><h2 id="correction-heading" class="mb-2 flex items-center gap-2 text-kh-base font-bold"><span aria-hidden="true">\u270F\uFE0F</span> ${ssrInterpolate(unref(t)("correctionLabel"))}</h2><ul class="space-y-3"><!--[-->`);
      ssrRenderList(__props.corrections, (correction, i) => {
        _push(`<li><p class="text-kh-sm khmer-wrap">${ssrInterpolate(correction.noteKh)}</p><p class="mt-1 text-xs text-ink-muted"><time${ssrRenderAttr("datetime", unref(iso)(correction.correctedAt))}>${ssrInterpolate(unref(dateTime)(correction.correctedAt))}</time>`);
        if (correction.editorName) {
          _push(`<!--[--> \xB7 ${ssrInterpolate(correction.editorName)}<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></li>`);
      });
      _push(`<!--]--></ul></aside>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CorrectionNotice.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ArticleShare",
  __ssrInlineRender: true,
  props: {
    article: {},
    expanded: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const { title } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ShareLinks = _sfc_main$c;
      _push(ssrRenderComponent(_component_ShareLinks, mergeProps({
        path: `/news/${props.article.slug}`,
        title: unref(title)(props.article),
        "track-path": `/api/news/${props.article.slug}/share`,
        expanded: props.expanded
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleShare.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b;
    let __temp, __restore;
    const route = useRoute();
    const config = useRuntimeConfig();
    const api = useApi();
    const { dateTime, iso, khNumber } = useFormat();
    const { t, title, summary, body, missingTranslation, categoryName, isEnglish } = useLocale();
    const slug = computed(() => String(route.params.slug));
    const { data, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `article-${slug.value}`,
      () => api.get(`/api/news/${slug.value}`)
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) throw pageError(error.value, "Article not found");
    if (!((_a = data.value) == null ? void 0 : _a.article)) {
      throw createError({ statusCode: 404, statusMessage: "Article not found", fatal: true });
    }
    const article = computed(() => data.value.article);
    const related = computed(() => {
      var _a2;
      return (_a2 = data.value.related) != null ? _a2 : [];
    });
    const isSponsored = computed(() => article.value.contentType !== "editorial");
    const path = computed(() => `/news/${article.value.slug}`);
    const seoTitle = computed(() => {
      var _a2;
      return ((_a2 = article.value.seo) == null ? void 0 : _a2.seoTitle) || title(article.value);
    });
    const seoDescription = computed(
      () => {
        var _a2;
        return ((_a2 = article.value.seo) == null ? void 0 : _a2.seoDescription) || summary(article.value) || title(article.value);
      }
    );
    const ogImage = computed(() => {
      var _a2;
      return ((_a2 = article.value.seo) == null ? void 0 : _a2.ogImage) || article.value.imageUrl || void 0;
    });
    useSiteSeo({
      title: seoTitle.value,
      description: seoDescription.value,
      path: path.value,
      image: ogImage.value,
      imageAlt: article.value.imageAlt,
      type: "article",
      robots: (_b = article.value.seo) == null ? void 0 : _b.robots,
      publishedAt: article.value.publishedAt,
      modifiedAt: article.value.updatedContentAt || article.value.publishedAt
    });
    useArticleSchema(article.value);
    useHreflang(path.value, article.value.hasEnglish);
    useBreadcrumbSchema([
      { name: t("home"), path: "/" },
      ...article.value.category ? [{ name: article.value.category.nameKh, path: `/category/${article.value.category.slug}` }] : [],
      { name: article.value.titleKh, path: path.value }
    ]);
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c, _d;
      const _component_AdSlot = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_BreakingBadge = _sfc_main$6;
      const _component_SponsoredBadge = _sfc_main$2$1;
      const _component_ImageViewer = __nuxt_component_4;
      const _component_SmartImage = _sfc_main$7;
      const _component_ArticleImageNotice = _sfc_main$3$1;
      const _component_AiSummary = _sfc_main$3;
      const _component_CorrectionNotice = _sfc_main$2;
      const _component_ArticleShare = _sfc_main$1;
      const _component_SectionHeading = _sfc_main$8;
      const _component_NewsCard = _sfc_main$9;
      const _component_ArticleSidebarTrending = _sfc_main$a;
      const _component_FiveMinuteNews = _sfc_main$b;
      if (unref(article)) {
        _push(`<article${ssrRenderAttrs(_attrs)}><div class="container-content">`);
        _push(ssrRenderComponent(_component_AdSlot, {
          position: "ARTICLE_TOP",
          "collapse-when-empty": ""
        }, null, _parent));
        _push(`</div><div class="container-content grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2"><nav${ssrRenderAttr("aria-label", unref(t)("breadcrumb"))} class="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "hover:text-brand"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("home"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("home")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(article).category) {
          _push(`<!--[--><span aria-hidden="true">\u203A</span>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/category/${unref(article).category.slug}`,
            class: "hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(categoryName)(unref(article).category))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(categoryName)(unref(article).category)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</nav><header><div class="mb-3 flex flex-wrap items-center gap-2">`);
        if (unref(article).isBreaking) {
          _push(ssrRenderComponent(_component_BreakingBadge, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(isSponsored)) {
          _push(ssrRenderComponent(_component_SponsoredBadge, {
            sponsor: unref(article).sponsorName
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-kh-2xl font-bold leading-snug khmer-wrap sm:text-kh-3xl lg:text-kh-4xl">${ssrInterpolate(unref(title)(unref(article)))}</h1>`);
        if (unref(summary)(unref(article))) {
          _push(`<p class="mt-4 text-kh-lg text-ink-muted khmer-wrap">${ssrInterpolate(unref(summary)(unref(article)))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(missingTranslation)(unref(article))) {
          _push(`<p class="mt-3 rounded-lg border border-line bg-surface-muted px-3 py-2 text-sm text-ink-muted">${ssrInterpolate(unref(t)("noTranslation"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isSponsored)) {
          _push(`<div class="mt-4 rounded-lg border border-warning/40 bg-warning/5 p-3 text-kh-sm khmer-wrap">${ssrInterpolate(unref(t)("sponsoredBy"))}`);
          if (unref(article).sponsorName) {
            _push(`<strong>${ssrInterpolate(unref(article).sponsorName)}</strong>`);
          } else {
            _push(`<!---->`);
          }
          _push(`\u17D4 ${ssrInterpolate(unref(t)("sponsoredDisclaimer", { site: unref(config).public.siteName }))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 text-sm">`);
        if (unref(article).author) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/author/${unref(article).author.slug}`,
            class: "flex items-center gap-2 font-semibold hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (unref(article).author.photoUrl) {
                  _push2(`<img${ssrRenderAttr("src", unref(article).author.photoUrl)}${ssrRenderAttr("alt", unref(article).author.nameKh)} width="32" height="32" class="h-8 w-8 rounded-full object-cover" loading="lazy"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(unref(article).author.nameKh)}`);
              } else {
                return [
                  unref(article).author.photoUrl ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: unref(article).author.photoUrl,
                    alt: unref(article).author.nameKh,
                    width: "32",
                    height: "32",
                    class: "h-8 w-8 rounded-full object-cover",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(unref(article).author.nameKh), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col gap-0.5 text-xs text-ink-muted">`);
        if (unref(article).publishedAt) {
          _push(`<time${ssrRenderAttr("datetime", unref(iso)(unref(article).publishedAt))}>${ssrInterpolate(unref(t)("published"))}: ${ssrInterpolate(unref(dateTime)(unref(article).publishedAt))}</time>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(article).updatedContentAt) {
          _push(`<time${ssrRenderAttr("datetime", unref(iso)(unref(article).updatedContentAt))}>${ssrInterpolate(unref(t)("updated"))}: ${ssrInterpolate(unref(dateTime)(unref(article).updatedContentAt))}</time>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(article).readingMinutes) {
          _push(`<span class="text-xs text-ink-muted">${ssrInterpolate(unref(t)("readMinutes", { n: unref(isEnglish) ? unref(article).readingMinutes : unref(khNumber)(unref(article).readingMinutes) }))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (unref(article).imageUrl) {
          _push(`<figure class="mt-6">`);
          _push(ssrRenderComponent(_component_ImageViewer, {
            src: unref(article).imageUrl,
            alt: unref(article).imageAlt || unref(title)(unref(article)),
            caption: unref(article).imageCaption,
            "ai-generated": unref(article).imageIsAiGenerated
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_SmartImage, {
                  src: unref(article).imageUrl,
                  alt: unref(article).imageAlt || unref(title)(unref(article)),
                  width: unref(article).imageWidth || 1200,
                  height: unref(article).imageHeight || 675,
                  priority: "",
                  class: "rounded-lg"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (unref(article).imageIsAiGenerated) {
                        _push3(ssrRenderComponent(_component_ArticleImageNotice, null, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        unref(article).imageIsAiGenerated ? (openBlock(), createBlock(_component_ArticleImageNotice, { key: 0 })) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_SmartImage, {
                    src: unref(article).imageUrl,
                    alt: unref(article).imageAlt || unref(title)(unref(article)),
                    width: unref(article).imageWidth || 1200,
                    height: unref(article).imageHeight || 675,
                    priority: "",
                    class: "rounded-lg"
                  }, {
                    default: withCtx(() => [
                      unref(article).imageIsAiGenerated ? (openBlock(), createBlock(_component_ArticleImageNotice, { key: 0 })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }, 8, ["src", "alt", "width", "height"])
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(article).imageCaption) {
            _push(`<figcaption class="mt-2 text-sm text-ink-muted khmer-wrap">${ssrInterpolate(unref(article).imageCaption)}</figcaption>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</figure>`);
        } else {
          _push(`<!---->`);
        }
        if ((_a2 = unref(article).aiSummary) == null ? void 0 : _a2.length) {
          _push(ssrRenderComponent(_component_AiSummary, {
            points: unref(article).aiSummary,
            "generated-at": unref(article).aiSummaryAt
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if ((_b2 = unref(article).corrections) == null ? void 0 : _b2.length) {
          _push(ssrRenderComponent(_component_CorrectionNotice, {
            corrections: unref(article).corrections
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="article-body mt-6">${(_c = unref(body)(unref(article))) != null ? _c : ""}</div>`);
        if ((_d = unref(article).tags) == null ? void 0 : _d.length) {
          _push(`<div class="mt-8 flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(article).tags, (tag) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: tag.slug,
              to: { path: "/search", query: { tag: tag.slug } },
              class: "rounded-full border border-line px-3 py-1 text-kh-sm hover:border-brand hover:text-brand"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` #${ssrInterpolate(tag.nameKh)}`);
                } else {
                  return [
                    createTextVNode(" #" + toDisplayString(tag.nameKh), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_AdSlot, {
          position: "ARTICLE_MIDDLE",
          "collapse-when-empty": ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_ArticleShare, {
          article: unref(article),
          class: "mt-6 border-t border-line pt-5",
          expanded: ""
        }, null, _parent));
        if (unref(related).length) {
          _push(`<section class="mt-10" aria-labelledby="related-heading">`);
          _push(ssrRenderComponent(_component_SectionHeading, {
            id: "related-heading",
            title: unref(t)("relatedNews")
          }, null, _parent));
          _push(`<div class="grid gap-5 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(unref(related), (item) => {
            _push(ssrRenderComponent(_component_NewsCard, {
              key: item.id,
              article: item,
              variant: "grid"
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_AdSlot, {
          position: "ARTICLE_BOTTOM",
          "collapse-when-empty": ""
        }, null, _parent));
        _push(`</div><aside class="space-y-8">`);
        _push(ssrRenderComponent(_component_AdSlot, {
          position: "ARTICLE_SIDEBAR",
          "collapse-when-empty": ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_ArticleSidebarTrending, null, null, _parent));
        _push(ssrRenderComponent(_component_FiveMinuteNews, null, null, _parent));
        _push(`</aside></div></article>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-cHqMhKdD.mjs.map
