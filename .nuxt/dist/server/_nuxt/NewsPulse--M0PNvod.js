import { _ as _sfc_main$1 } from "./SectionHeading-CJAAYZij.js";
import { c as useAsyncApi, u as useLocale, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, withAsyncContext, unref, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NewsPulse",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: pulse } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("news-pulse", "/api/pulse")), __temp = await __temp, __restore(), __temp);
    const { khNumber } = useFormat();
    const { t, isEnglish } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionHeading = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(pulse)?.entries?.length) {
        _push(`<section${ssrRenderAttrs(mergeProps({ "aria-labelledby": "pulse-heading" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_SectionHeading, {
          id: "pulse-heading",
          title: unref(t)("newsPulse"),
          icon: "🔥",
          subtitle: unref(t)("lastTwentyFourHours")
        }, null, _parent));
        _push(`<ul class="space-y-3"><!--[-->`);
        ssrRenderList(unref(pulse).entries, (entry, i) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/category/${entry.categorySlug}`,
            class: "group block"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="mb-1 flex items-center justify-between gap-2 text-kh-sm"${_scopeId}><span class="font-semibold group-hover:text-brand"${_scopeId}>${ssrInterpolate(unref(isEnglish) ? i + 1 : unref(khNumber)(i + 1))}. ${ssrInterpolate(unref(isEnglish) ? entry.categoryEn : entry.categoryKh)}</span><span class="text-xs tabular-nums text-ink-muted"${_scopeId}>${ssrInterpolate(entry.percent)}%</span></div><div class="h-2 overflow-hidden rounded-full bg-surface-muted" role="img"${ssrRenderAttr("aria-label", `${entry.categoryEn}: ${entry.percent}% of the busiest section`)}${_scopeId}><div class="h-full rounded-full transition-all duration-500" style="${ssrRenderStyle({
                  width: `${Math.max(entry.percent, 4)}%`,
                  backgroundColor: entry.color || "#1E3A8A"
                })}"${_scopeId}></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "mb-1 flex items-center justify-between gap-2 text-kh-sm" }, [
                    createVNode("span", { class: "font-semibold group-hover:text-brand" }, toDisplayString(unref(isEnglish) ? i + 1 : unref(khNumber)(i + 1)) + ". " + toDisplayString(unref(isEnglish) ? entry.categoryEn : entry.categoryKh), 1),
                    createVNode("span", { class: "text-xs tabular-nums text-ink-muted" }, toDisplayString(entry.percent) + "%", 1)
                  ]),
                  createVNode("div", {
                    class: "h-2 overflow-hidden rounded-full bg-surface-muted",
                    role: "img",
                    "aria-label": `${entry.categoryEn}: ${entry.percent}% of the busiest section`
                  }, [
                    createVNode("div", {
                      class: "h-full rounded-full transition-all duration-500",
                      style: {
                        width: `${Math.max(entry.percent, 4)}%`,
                        backgroundColor: entry.color || "#1E3A8A"
                      }
                    }, null, 4)
                  ], 8, ["aria-label"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul><p class="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-muted khmer-wrap">${ssrInterpolate(unref(isEnglish) ? unref(pulse).disclaimer : unref(pulse).disclaimerKh)}</p></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsPulse.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=NewsPulse--M0PNvod.js.map
