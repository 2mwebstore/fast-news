import { _ as _sfc_main$1 } from './NewsCard-HLdAEa9m.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useLocale } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TrendingList",
  __ssrInlineRender: true,
  props: {
    articles: {}
  },
  setup(__props) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NewsCard = _sfc_main$1;
      if (__props.articles.length) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          "aria-labelledby": "trending-heading",
          class: "card p-5"
        }, _attrs))}><div class="mb-4 flex items-baseline gap-2 border-b-2 border-breaking pb-2"><h2 id="trending-heading" class="text-kh-xl font-bold"><span aria-hidden="true">\u{1F525}</span> ${ssrInterpolate(unref(t)("trending"))}</h2></div><ol class="divide-y divide-line"><!--[-->`);
        ssrRenderList(__props.articles, (article, i) => {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrendingList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=TrendingList-BOx8JOT1.mjs.map
