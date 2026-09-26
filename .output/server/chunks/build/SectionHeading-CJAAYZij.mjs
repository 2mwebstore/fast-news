import { u as useLocale, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionHeading",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    icon: {},
    href: {},
    accent: {}
  },
  setup(__props) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "section-rule",
        style: __props.accent ? { borderColor: __props.accent } : void 0
      }, _attrs))}><h2 class="flex items-center gap-2 text-kh-xl font-bold">`);
      if (__props.icon) {
        _push(`<span aria-hidden="true">${ssrInterpolate(__props.icon)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(__props.title)}</h2>`);
      if (__props.subtitle) {
        _push(`<span class="text-xs text-ink-muted">${ssrInterpolate(__props.subtitle)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.href) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.href,
          class: "ml-auto shrink-0 text-xs font-semibold text-brand hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("viewAll"))} \u2192 `);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("viewAll")) + " \u2192 ", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SectionHeading.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=SectionHeading-CJAAYZij.mjs.map
