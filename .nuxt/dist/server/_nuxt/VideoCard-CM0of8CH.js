import { u as useLocale, _ as __nuxt_component_0 } from "../server.mjs";
import { _ as _sfc_main$1 } from "./SmartImage-D_CQTSWD.js";
import { defineComponent, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, Fragment, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VideoCard",
  __ssrInlineRender: true,
  props: {
    video: {}
  },
  setup(__props) {
    const { t } = useLocale();
    const { duration, compact, relativeKh } = useFormat();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_SmartImage = _sfc_main$1;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "group" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/video/${__props.video.slug}`,
        class: "block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_SmartImage, {
              src: __props.video.thumbnailUrl,
              alt: __props.video.thumbnailAlt || __props.video.titleKh,
              width: 640,
              height: 360,
              "img-class": "transition-transform duration-300 group-hover:scale-[1.03]",
              class: "rounded-lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="absolute inset-0 flex items-center justify-center"${_scopeId2}><span class="rounded-full bg-ink/60 p-3 backdrop-blur-sm transition-transform group-hover:scale-110"${_scopeId2}><svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"${_scopeId2}><path d="M8 5v14l11-7z"${_scopeId2}></path></svg></span></span>`);
                  if (__props.video.isLive) {
                    _push3(`<span class="absolute left-2 top-2 badge-breaking"${_scopeId2}><span class="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden="true"${_scopeId2}></span> ${ssrInterpolate(unref(t)("liveBadge"))}</span>`);
                  } else if (__props.video.durationSec) {
                    _push3(`<span class="absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"${_scopeId2}>${ssrInterpolate(unref(duration)(__props.video.durationSec))}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("span", { class: "absolute inset-0 flex items-center justify-center" }, [
                      createVNode("span", { class: "rounded-full bg-ink/60 p-3 backdrop-blur-sm transition-transform group-hover:scale-110" }, [
                        (openBlock(), createBlock("svg", {
                          class: "h-6 w-6 text-white",
                          viewBox: "0 0 24 24",
                          fill: "currentColor",
                          "aria-hidden": "true"
                        }, [
                          createVNode("path", { d: "M8 5v14l11-7z" })
                        ]))
                      ])
                    ]),
                    __props.video.isLive ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "absolute left-2 top-2 badge-breaking"
                    }, [
                      createVNode("span", {
                        class: "inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("liveBadge")), 1)
                    ])) : __props.video.durationSec ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: "absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"
                    }, toDisplayString(unref(duration)(__props.video.durationSec)), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<h3 class="mt-2.5 line-clamp-2 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand"${_scopeId}>${ssrInterpolate(__props.video.titleKh)}</h3><div class="mt-1 flex items-center gap-2 text-xs text-ink-muted"${_scopeId}>`);
            if (__props.video.category) {
              _push2(`<span${_scopeId}>${ssrInterpolate(__props.video.category.nameKh)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.video.viewCount) {
              _push2(`<!--[--><span aria-hidden="true"${_scopeId}>•</span><span${_scopeId}>${ssrInterpolate(unref(compact)(__props.video.viewCount))} ${ssrInterpolate(unref(t)("views"))}</span><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.video.publishedAt) {
              _push2(`<!--[--><span aria-hidden="true"${_scopeId}>•</span><time${ssrRenderAttr("datetime", __props.video.publishedAt)}${_scopeId}>${ssrInterpolate(unref(relativeKh)(__props.video.publishedAt))}</time><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_SmartImage, {
                src: __props.video.thumbnailUrl,
                alt: __props.video.thumbnailAlt || __props.video.titleKh,
                width: 640,
                height: 360,
                "img-class": "transition-transform duration-300 group-hover:scale-[1.03]",
                class: "rounded-lg"
              }, {
                default: withCtx(() => [
                  createVNode("span", { class: "absolute inset-0 flex items-center justify-center" }, [
                    createVNode("span", { class: "rounded-full bg-ink/60 p-3 backdrop-blur-sm transition-transform group-hover:scale-110" }, [
                      (openBlock(), createBlock("svg", {
                        class: "h-6 w-6 text-white",
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        "aria-hidden": "true"
                      }, [
                        createVNode("path", { d: "M8 5v14l11-7z" })
                      ]))
                    ])
                  ]),
                  __props.video.isLive ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute left-2 top-2 badge-breaking"
                  }, [
                    createVNode("span", {
                      class: "inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("liveBadge")), 1)
                  ])) : __props.video.durationSec ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: "absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"
                  }, toDisplayString(unref(duration)(__props.video.durationSec)), 1)) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["src", "alt"]),
              createVNode("h3", { class: "mt-2.5 line-clamp-2 text-kh-base font-semibold leading-snug khmer-wrap group-hover:text-brand" }, toDisplayString(__props.video.titleKh), 1),
              createVNode("div", { class: "mt-1 flex items-center gap-2 text-xs text-ink-muted" }, [
                __props.video.category ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.video.category.nameKh), 1)) : createCommentVNode("", true),
                __props.video.viewCount ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode("span", { "aria-hidden": "true" }, "•"),
                  createVNode("span", null, toDisplayString(unref(compact)(__props.video.viewCount)) + " " + toDisplayString(unref(t)("views")), 1)
                ], 64)) : createCommentVNode("", true),
                __props.video.publishedAt ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                  createVNode("span", { "aria-hidden": "true" }, "•"),
                  createVNode("time", {
                    datetime: __props.video.publishedAt
                  }, toDisplayString(unref(relativeKh)(__props.video.publishedAt)), 9, ["datetime"])
                ], 64)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VideoCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=VideoCard-CM0of8CH.js.map
