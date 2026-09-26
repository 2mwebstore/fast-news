import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminStatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useAdminLocale();
    const tone = {
      draft: "bg-ink/10 text-ink-muted",
      review: "bg-warning/15 text-warning",
      approved: "bg-brand/10 text-brand",
      scheduled: "bg-brand-accent/10 text-brand-accent",
      published: "bg-success/15 text-success",
      rejected: "bg-breaking/15 text-breaking",
      archived: "bg-ink/10 text-ink-muted"
    };
    const labelKeys = {
      draft: "statusDraft",
      review: "statusReview",
      approved: "statusApproved",
      scheduled: "statusScheduled",
      published: "statusPublished",
      rejected: "statusRejected",
      archived: "statusArchived"
    };
    const label = computed(() => {
      const key = labelKeys[props.status];
      return key ? t(key) : String(props.status);
    });
    const classes = computed(() => {
      var _a;
      return (_a = tone[props.status]) != null ? _a : "bg-ink/10 text-ink-muted";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["rounded px-1.5 py-0.5 font-semibold", unref(classes)]
      }, _attrs))}>${ssrInterpolate(unref(label))}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminStatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminStatusBadge-Raz2wPvs.mjs.map
