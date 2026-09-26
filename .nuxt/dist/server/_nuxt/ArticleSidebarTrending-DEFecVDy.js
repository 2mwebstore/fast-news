import { _ as _sfc_main$1 } from "./TrendingList-BOx8JOT1.js";
import { defineComponent, withAsyncContext, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { c as useAsyncApi } from "../server.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ArticleSidebarTrending",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: trending } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("article-trending", "/api/trending", { limit: 6 })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TrendingList = _sfc_main$1;
      _push(ssrRenderComponent(_component_TrendingList, mergeProps({
        articles: unref(trending) ?? []
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleSidebarTrending.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=ArticleSidebarTrending-DEFecVDy.js.map
