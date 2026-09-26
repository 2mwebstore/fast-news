import { j as useHead, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminApi } from "./useAdminApi-SsuwQDOr.js";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/sila/Desktop/fast-news/web/node_modules/unctx/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/h3/dist/index.mjs";
import "pinia";
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
  __name: "review",
  __ssrInlineRender: true,
  setup(__props) {
    useAdminApi();
    const { dateTime } = useFormat();
    const { t, contentTitle } = useAdminLocale();
    const articles = ref([]);
    const loading = ref(true);
    useHead({ title: "Review queue — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-1 text-xl font-bold">${ssrInterpolate(unref(t)("reviewQueue"))}</h1><p class="mb-4 text-sm text-ink-muted">${ssrInterpolate(unref(t)("reviewQueueIntro"))}</p>`);
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(articles).length) {
        _push(`<p class="card py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("nothingToReview"))}</p>`);
      } else {
        _push(`<ul class="space-y-3"><!--[-->`);
        ssrRenderList(unref(articles), (article) => {
          _push(`<li class="card flex flex-wrap items-center gap-3 p-4"><div class="min-w-0 flex-1">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/news/${article.id}/edit`,
            class: "block truncate text-kh-base font-semibold hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(contentTitle)(article))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(contentTitle)(article)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<p class="mt-1 text-xs text-ink-muted">`);
          if (article.category) {
            _push(`<span>${ssrInterpolate(article.category.nameKh)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (article.author) {
            _push(`<span> · ${ssrInterpolate(article.author.nameKh)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` · ${ssrInterpolate(unref(dateTime)(article.updatedAt))} · ${ssrInterpolate(article.wordCount)} ${ssrInterpolate(unref(t)("words"))} `);
          if (article.aiAssisted) {
            _push(`<span class="ml-1 rounded bg-brand/10 px-1.5 py-0.5 text-brand">AI draft</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div><div class="flex gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/news/${article.id}/edit`,
            class: "rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-muted"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("read"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("read")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button class="rounded-lg border border-breaking px-3 py-1.5 text-sm text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("reject"))}</button><button class="rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">${ssrInterpolate(unref(t)("approve"))}</button></div></li>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/review.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=review-Bf4Vs7hM.js.map
