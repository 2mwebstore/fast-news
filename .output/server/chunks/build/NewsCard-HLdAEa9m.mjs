import { _ as _sfc_main$4 } from './SmartImage-D_CQTSWD.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, openBlock, createBlock, createCommentVNode, createTextVNode, toDisplayString, createVNode, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as useLocale, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$5 } from './BreakingBadge-BUl44HvT.mjs';
import { u as useFormat } from './useFormat-DT1zbtWM.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ArticleImageNotice",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({ class: "absolute bottom-2 left-2 rounded bg-ink/75 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm" }, _attrs))}>${ssrInterpolate(unref(t)("aiImageNotice"))}</span>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleImageNotice.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SponsoredBadge",
  __ssrInlineRender: true,
  props: {
    sponsor: {},
    small: { type: Boolean, default: false }
  },
  setup(__props) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["badge-sponsored", __props.small ? "text-[10px]" : "text-xs"]
      }, _attrs))}>${ssrInterpolate(unref(t)("sponsored"))}`);
      if (__props.sponsor) {
        _push(`<!--[--> \xB7 ${ssrInterpolate(__props.sponsor)}<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SponsoredBadge.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NewsCardMeta",
  __ssrInlineRender: true,
  props: {
    article: {}
  },
  setup(__props) {
    const { dateTime, iso, khNumber } = useFormat();
    const { t, isEnglish } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted" }, _attrs))}>`);
      if (__props.article.author) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/author/${__props.article.author.slug}`,
          class: "font-medium text-ink hover:text-brand"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(isEnglish) && __props.article.author.nameEn ? __props.article.author.nameEn : __props.article.author.nameKh)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(isEnglish) && __props.article.author.nameEn ? __props.article.author.nameEn : __props.article.author.nameKh), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.article.author) {
        _push(`<span aria-hidden="true">\u2022</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.article.publishedAt) {
        _push(`<time${ssrRenderAttr("datetime", unref(iso)(__props.article.publishedAt))}>${ssrInterpolate(unref(dateTime)(__props.article.publishedAt))}</time>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.article.readingMinutes) {
        _push(`<!--[--><span aria-hidden="true">\u2022</span><span>${ssrInterpolate(unref(t)("readMinutes", { n: unref(isEnglish) ? __props.article.readingMinutes : unref(khNumber)(__props.article.readingMinutes) }))}</span><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsCardMeta.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const aspect = "16 / 9";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NewsCard",
  __ssrInlineRender: true,
  props: {
    article: {},
    variant: { default: "grid" },
    showTime: { type: Boolean, default: false },
    rank: {},
    priority: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const { time, relativeKh, compact } = useFormat();
    const { title, summary, categoryName } = useLocale();
    const href = computed(() => `/news/${props.article.slug}`);
    const isSponsored = computed(() => props.article.contentType !== "editorial");
    const imageAlt = computed(() => props.article.imageAlt || title(props.article));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SmartImage = _sfc_main$4;
      const _component_ArticleImageNotice = _sfc_main$3;
      const _component_BreakingBadge = _sfc_main$5;
      const _component_SponsoredBadge = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_NewsCardMeta = _sfc_main$1;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: ["group", __props.variant === "compact" ? "flex gap-3" : ""]
      }, _attrs))}>`);
      if (__props.variant === "hero") {
        _push(`<div class="relative">`);
        _push(ssrRenderComponent(_component_SmartImage, {
          src: __props.article.imageUrl,
          alt: unref(imageAlt),
          width: __props.article.imageWidth || 1200,
          height: __props.article.imageHeight || 675,
          ratio: aspect,
          priority: __props.priority,
          "img-class": "transition-transform duration-300 group-hover:scale-[1.02]",
          class: "rounded-lg"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (__props.article.imageIsAiGenerated) {
                _push2(ssrRenderComponent(_component_ArticleImageNotice, null, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                __props.article.imageIsAiGenerated ? (openBlock(), createBlock(_component_ArticleImageNotice, { key: 0 })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="mt-4 space-y-2"><div class="flex flex-wrap items-center gap-2">`);
        if (__props.article.isBreaking) {
          _push(ssrRenderComponent(_component_BreakingBadge, null, null, _parent));
        } else if (__props.article.category) {
          _push(`<span class="badge-category">${ssrInterpolate(unref(categoryName)(__props.article.category))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isSponsored)) {
          _push(ssrRenderComponent(_component_SponsoredBadge, {
            sponsor: __props.article.sponsorName
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h2 class="text-kh-2xl font-bold leading-snug khmer-wrap sm:text-kh-3xl">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(href),
          class: "after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(title)(__props.article))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(title)(__props.article)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</h2>`);
        if (unref(summary)(__props.article)) {
          _push(`<p class="line-clamp-2 text-kh-base text-ink-muted khmer-wrap">${ssrInterpolate(unref(summary)(__props.article))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NewsCardMeta, {
          article: __props.article,
          class: "relative z-10"
        }, null, _parent));
        _push(`</div></div>`);
      } else if (__props.variant === "compact") {
        _push(`<!--[-->`);
        if (__props.rank !== void 0) {
          _push(`<span class="mt-0.5 w-7 shrink-0 text-lg font-extrabold tabular-nums text-brand/40">${ssrInterpolate(String(__props.rank).padStart(2, "0"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(href),
          class: "flex min-w-0 flex-1 gap-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="min-w-0 flex-1"${_scopeId}><div class="mb-1 flex flex-wrap items-center gap-2 text-xs"${_scopeId}>`);
              if (__props.showTime && __props.article.publishedAt) {
                _push2(`<time class="font-semibold tabular-nums text-ink-muted"${_scopeId}>${ssrInterpolate(unref(time)(__props.article.publishedAt))}</time>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.article.isBreaking) {
                _push2(ssrRenderComponent(_component_BreakingBadge, { small: "" }, null, _parent2, _scopeId));
              } else if (__props.article.category) {
                _push2(`<span class="text-brand"${_scopeId}>${ssrInterpolate(unref(categoryName)(__props.article.category))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(isSponsored)) {
                _push2(ssrRenderComponent(_component_SponsoredBadge, {
                  sponsor: __props.article.sponsorName,
                  small: ""
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><h3 class="line-clamp-2 text-kh-sm font-semibold leading-snug khmer-wrap group-hover:text-brand"${_scopeId}>${ssrInterpolate(unref(title)(__props.article))}</h3></div>`);
              if (__props.article.imageUrl) {
                _push2(ssrRenderComponent(_component_SmartImage, {
                  src: __props.article.imageUrl,
                  alt: unref(imageAlt),
                  width: 96,
                  height: 54,
                  ratio: aspect,
                  class: "w-20 shrink-0 rounded sm:w-24"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("div", { class: "min-w-0 flex-1" }, [
                  createVNode("div", { class: "mb-1 flex flex-wrap items-center gap-2 text-xs" }, [
                    __props.showTime && __props.article.publishedAt ? (openBlock(), createBlock("time", {
                      key: 0,
                      class: "font-semibold tabular-nums text-ink-muted"
                    }, toDisplayString(unref(time)(__props.article.publishedAt)), 1)) : createCommentVNode("", true),
                    __props.article.isBreaking ? (openBlock(), createBlock(_component_BreakingBadge, {
                      key: 1,
                      small: ""
                    })) : __props.article.category ? (openBlock(), createBlock("span", {
                      key: 2,
                      class: "text-brand"
                    }, toDisplayString(unref(categoryName)(__props.article.category)), 1)) : createCommentVNode("", true),
                    unref(isSponsored) ? (openBlock(), createBlock(_component_SponsoredBadge, {
                      key: 3,
                      sponsor: __props.article.sponsorName,
                      small: ""
                    }, null, 8, ["sponsor"])) : createCommentVNode("", true)
                  ]),
                  createVNode("h3", { class: "line-clamp-2 text-kh-sm font-semibold leading-snug khmer-wrap group-hover:text-brand" }, toDisplayString(unref(title)(__props.article)), 1)
                ]),
                __props.article.imageUrl ? (openBlock(), createBlock(_component_SmartImage, {
                  key: 0,
                  src: __props.article.imageUrl,
                  alt: unref(imageAlt),
                  width: 96,
                  height: 54,
                  ratio: aspect,
                  class: "w-20 shrink-0 rounded sm:w-24"
                }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else if (__props.variant === "list") {
        _push(`<div class="relative flex w-full gap-3 sm:gap-4">`);
        _push(ssrRenderComponent(_component_SmartImage, {
          src: __props.article.imageUrl,
          alt: unref(imageAlt),
          width: __props.article.imageWidth || 352,
          height: __props.article.imageHeight || 198,
          ratio: aspect,
          "img-class": "transition-transform duration-300 group-hover:scale-[1.03]",
          class: "w-28 shrink-0 rounded-lg sm:w-44"
        }, null, _parent));
        _push(`<div class="min-w-0 flex-1"><div class="mb-1.5 flex flex-wrap items-center gap-2 text-xs">`);
        if (__props.showTime && __props.article.publishedAt) {
          _push(`<time class="font-semibold tabular-nums text-ink-muted">${ssrInterpolate(unref(time)(__props.article.publishedAt))}</time>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.article.isBreaking) {
          _push(ssrRenderComponent(_component_BreakingBadge, { small: "" }, null, _parent));
        } else if (__props.article.category) {
          _push(`<span class="badge-category">${ssrInterpolate(unref(categoryName)(__props.article.category))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isSponsored)) {
          _push(ssrRenderComponent(_component_SponsoredBadge, {
            sponsor: __props.article.sponsorName,
            small: ""
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h3 class="line-clamp-3 text-kh-base font-semibold leading-snug khmer-wrap sm:text-kh-lg">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(href),
          class: "after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(title)(__props.article))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(title)(__props.article)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</h3>`);
        if (unref(summary)(__props.article)) {
          _push(`<p class="mt-1 hidden line-clamp-2 text-kh-sm text-ink-muted khmer-wrap sm:block">${ssrInterpolate(unref(summary)(__props.article))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NewsCardMeta, {
          article: __props.article,
          class: "relative z-10 mt-2 hidden sm:flex"
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(href),
          class: "block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_SmartImage, {
                src: __props.article.imageUrl,
                alt: unref(imageAlt),
                width: __props.article.imageWidth || 640,
                height: __props.article.imageHeight || 360,
                ratio: aspect,
                priority: __props.priority,
                "img-class": "transition-transform duration-300 group-hover:scale-[1.03]",
                class: "rounded-lg"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (__props.article.imageIsAiGenerated) {
                      _push3(ssrRenderComponent(_component_ArticleImageNotice, null, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      __props.article.imageIsAiGenerated ? (openBlock(), createBlock(_component_ArticleImageNotice, { key: 0 })) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="mt-3 space-y-1.5"${_scopeId}><div class="flex flex-wrap items-center gap-2 text-xs"${_scopeId}>`);
              if (__props.article.isBreaking) {
                _push2(ssrRenderComponent(_component_BreakingBadge, { small: "" }, null, _parent2, _scopeId));
              } else if (__props.article.category) {
                _push2(`<span class="badge-category"${_scopeId}>${ssrInterpolate(unref(categoryName)(__props.article.category))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(isSponsored)) {
                _push2(ssrRenderComponent(_component_SponsoredBadge, {
                  sponsor: __props.article.sponsorName,
                  small: ""
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><h3 class="line-clamp-3 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand"${_scopeId}>${ssrInterpolate(unref(title)(__props.article))}</h3><div class="flex items-center gap-2 text-xs text-ink-muted"${_scopeId}>`);
              if (__props.article.publishedAt) {
                _push2(`<time${ssrRenderAttr("datetime", __props.article.publishedAt)}${_scopeId}>${ssrInterpolate(unref(relativeKh)(__props.article.publishedAt))}</time>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.article.viewCount > 0) {
                _push2(`<!--[--><span aria-hidden="true"${_scopeId}>\u2022</span><span${_scopeId}>${ssrInterpolate(unref(compact)(__props.article.viewCount))}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                createVNode(_component_SmartImage, {
                  src: __props.article.imageUrl,
                  alt: unref(imageAlt),
                  width: __props.article.imageWidth || 640,
                  height: __props.article.imageHeight || 360,
                  ratio: aspect,
                  priority: __props.priority,
                  "img-class": "transition-transform duration-300 group-hover:scale-[1.03]",
                  class: "rounded-lg"
                }, {
                  default: withCtx(() => [
                    __props.article.imageIsAiGenerated ? (openBlock(), createBlock(_component_ArticleImageNotice, { key: 0 })) : createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["src", "alt", "width", "height", "priority"]),
                createVNode("div", { class: "mt-3 space-y-1.5" }, [
                  createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs" }, [
                    __props.article.isBreaking ? (openBlock(), createBlock(_component_BreakingBadge, {
                      key: 0,
                      small: ""
                    })) : __props.article.category ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: "badge-category"
                    }, toDisplayString(unref(categoryName)(__props.article.category)), 1)) : createCommentVNode("", true),
                    unref(isSponsored) ? (openBlock(), createBlock(_component_SponsoredBadge, {
                      key: 2,
                      sponsor: __props.article.sponsorName,
                      small: ""
                    }, null, 8, ["sponsor"])) : createCommentVNode("", true)
                  ]),
                  createVNode("h3", { class: "line-clamp-3 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand" }, toDisplayString(unref(title)(__props.article)), 1),
                  createVNode("div", { class: "flex items-center gap-2 text-xs text-ink-muted" }, [
                    __props.article.publishedAt ? (openBlock(), createBlock("time", {
                      key: 0,
                      datetime: __props.article.publishedAt
                    }, toDisplayString(unref(relativeKh)(__props.article.publishedAt)), 9, ["datetime"])) : createCommentVNode("", true),
                    __props.article.viewCount > 0 ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("span", { "aria-hidden": "true" }, "\u2022"),
                      createVNode("span", null, toDisplayString(unref(compact)(__props.article.viewCount)), 1)
                    ], 64)) : createCommentVNode("", true)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, _sfc_main$2 as a, _sfc_main$3 as b };
//# sourceMappingURL=NewsCard-HLdAEa9m.mjs.map
