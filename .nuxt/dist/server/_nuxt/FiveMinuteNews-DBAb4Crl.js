import { _ as _sfc_main$1 } from "./NewsCard-HLdAEa9m.js";
import { defineComponent, withAsyncContext, unref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { c as useAsyncApi, u as useLocale } from "../server.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FiveMinuteNews",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: articles } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("five-minute", "/api/five-minute")), __temp = await __temp, __restore(), __temp);
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NewsCard = _sfc_main$1;
      if (unref(articles)?.length) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          "aria-labelledby": "five-min-heading",
          class: "card p-5"
        }, _attrs))}><div class="mb-4 flex items-baseline gap-2 border-b-2 border-warning pb-2"><h2 id="five-min-heading" class="text-kh-xl font-bold"><span aria-hidden="true">⚡</span> ${ssrInterpolate(unref(t)("fiveMinute"))}</h2><span class="text-xs text-ink-muted">${ssrInterpolate(unref(t)("quickRead"))}</span></div><ol class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(articles), (article, i) => {
          _push(`<li class="py-3 first:pt-0 last:pb-0">`);
          _push(ssrRenderComponent(_component_NewsCard, {
            article,
            variant: "compact",
            rank: i + 1
          }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ol></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FiveMinuteNews.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=FiveMinuteNews-DBAb4Crl.js.map
