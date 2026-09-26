import { _ as __nuxt_component_0 } from './SearchableSelect-BQHPC7-8.mjs';
import { _ as _sfc_main$1 } from './ImageField-BjAQOsbw.mjs';
import { i as useRouter, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$2 } from './SelectField-vCKw5R9_.mjs';
import { defineComponent, reactive, ref, computed, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useAdminApi, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import { u as useMeta } from './useMeta-DYb9wm5F.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminCreativeForm",
  __ssrInlineRender: true,
  props: {
    creativeId: {}
  },
  setup(__props) {
    const props = __props;
    useAdminApi();
    useRouter();
    const { t } = useAdminLocale();
    const { meta: platformMeta, toOptions } = useMeta();
    const form = reactive({
      campaignId: "",
      name: "",
      position: "",
      desktopImageUrl: "",
      desktopWidth: 0,
      desktopHeight: 0,
      mobileImageUrl: "",
      mobileWidth: 0,
      mobileHeight: 0,
      htmlSnippet: "",
      targetUrl: "",
      altText: "",
      startAt: "",
      endAt: "",
      priority: 0,
      weight: 1,
      targetDevice: "all",
      targetCategories: []
    });
    const campaigns = ref([]);
    const loading = ref(Boolean(props.creativeId));
    const saving = ref(false);
    const message = ref("");
    const errorMessage = ref("");
    ref(props.creativeId);
    const positionOptions = computed(() => {
      var _a;
      return toOptions((_a = platformMeta.value) == null ? void 0 : _a.adPositions, "en");
    });
    const campaignOptions = computed(
      () => campaigns.value.map((c) => ({
        value: c.id,
        label: c.name,
        // Flagging unapproved campaigns here saves the puzzle of a creative that
        // is "active" but never appears.
        sub: c.approvedAt ? c.advertiser : `${c.advertiser} \xB7 not approved`
      }))
    );
    const deviceOptions = [
      { value: "all", label: "All devices" },
      { value: "desktop", label: "Desktop only" },
      { value: "mobile", label: "Mobile only" }
    ];
    function applyNatural(target, size) {
      if (target === "desktop") {
        form.desktopWidth = size.width;
        form.desktopHeight = size.height;
      } else {
        form.mobileWidth = size.width;
        form.mobileHeight = size.height;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SearchableSelect = __nuxt_component_0;
      const _component_ImageField = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SelectField = _sfc_main$2;
      if (unref(loading)) {
        _push(`<p${ssrRenderAttrs(mergeProps({ class: "py-12 text-center text-ink-muted" }, _attrs))}>${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else {
        _push(`<form${ssrRenderAttrs(mergeProps({ class: "grid gap-6 lg:grid-cols-3" }, _attrs))}><div class="space-y-4 lg:col-span-2"><div class="card space-y-4 p-5"><div><label for="ad-name" class="mb-1 block text-sm font-medium">Name *</label><input id="ad-name"${ssrRenderAttr("value", unref(form).name)} required class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div>`);
        _push(ssrRenderComponent(_component_SearchableSelect, {
          modelValue: unref(form).campaignId,
          "onUpdate:modelValue": ($event) => unref(form).campaignId = $event,
          options: unref(campaignOptions),
          label: "Campaign",
          required: "",
          clearable: false,
          placeholder: "Choose a campaign"
        }, null, _parent));
        _push(ssrRenderComponent(_component_SearchableSelect, {
          modelValue: unref(form).position,
          "onUpdate:modelValue": ($event) => unref(form).position = $event,
          options: unref(positionOptions),
          label: "Slot",
          required: "",
          clearable: false,
          placeholder: "Choose a slot"
        }, null, _parent));
        _push(`<div><label for="ad-url" class="mb-1 block text-sm font-medium">Click-through URL</label><input id="ad-url"${ssrRenderAttr("value", unref(form).targetUrl)} placeholder="https://\u2026" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div><div><label for="ad-alt" class="mb-1 block text-sm font-medium">ALT text</label><input id="ad-alt"${ssrRenderAttr("value", unref(form).altText)} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div></div><div class="card space-y-5 p-5"><h2 class="font-bold">Creatives</h2><div>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(form).desktopImageUrl,
          "onUpdate:modelValue": ($event) => unref(form).desktopImageUrl = $event,
          folder: "ad",
          label: "Desktop",
          ratio: unref(form).desktopWidth && unref(form).desktopHeight ? `${unref(form).desktopWidth} / ${unref(form).desktopHeight}` : "16 / 9",
          onNatural: ($event) => applyNatural("desktop", $event),
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`<div class="mt-2 grid grid-cols-2 gap-2"><input${ssrRenderAttr("value", unref(form).desktopWidth)} type="number" min="0" placeholder="width" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><input${ssrRenderAttr("value", unref(form).desktopHeight)} type="number" min="0" placeholder="height" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div></div><div>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(form).mobileImageUrl,
          "onUpdate:modelValue": ($event) => unref(form).mobileImageUrl = $event,
          folder: "ad",
          label: "Mobile",
          ratio: unref(form).mobileWidth && unref(form).mobileHeight ? `${unref(form).mobileWidth} / ${unref(form).mobileHeight}` : "16 / 9",
          onNatural: ($event) => applyNatural("mobile", $event),
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`<div class="mt-2 grid grid-cols-2 gap-2"><input${ssrRenderAttr("value", unref(form).mobileWidth)} type="number" min="0" placeholder="width" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><input${ssrRenderAttr("value", unref(form).mobileHeight)} type="number" min="0" placeholder="height" class="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div><p class="mt-1.5 text-xs text-ink-muted"> Width and height are required with an image \u2014 they reserve the slot&#39;s space so the ad cannot shift the page. </p></div><div><label for="ad-tag" class="mb-1 block text-sm font-medium">Third-party ad tag</label><textarea id="ad-tag" rows="3" class="w-full rounded-lg border border-line px-3 py-2 font-mono text-xs outline-none focus:border-brand">${ssrInterpolate(unref(form).htmlSnippet)}</textarea><p class="mt-1 text-xs text-ink-muted">Rendered in a sandboxed iframe, never injected into the page.</p></div></div></div><aside class="space-y-4"><div class="card space-y-3 p-5"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(saving) ? unref(t)("saving") : unref(t)("save"))}</button>`);
        if (unref(message)) {
          _push(`<p class="rounded bg-success/10 p-2 text-sm text-success">${ssrInterpolate(unref(message))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorMessage)) {
          _push(`<p class="rounded bg-breaking/10 p-2 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/ads",
          class: "block text-center text-sm text-brand hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u2190 ${ssrInterpolate(unref(t)("advertising"))}`);
            } else {
              return [
                createTextVNode("\u2190 " + toDisplayString(unref(t)("advertising")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="card space-y-3 p-5"><div class="grid grid-cols-2 gap-2"><div><label for="ad-start" class="mb-1 block text-sm font-medium">Starts *</label><input id="ad-start"${ssrRenderAttr("value", unref(form).startAt)} type="datetime-local" required class="w-full rounded-lg border border-line px-2 py-2 text-sm outline-none focus:border-brand"></div><div><label for="ad-end" class="mb-1 block text-sm font-medium">Ends *</label><input id="ad-end"${ssrRenderAttr("value", unref(form).endAt)} type="datetime-local" required class="w-full rounded-lg border border-line px-2 py-2 text-sm outline-none focus:border-brand"></div></div>`);
        _push(ssrRenderComponent(_component_SelectField, {
          modelValue: unref(form).targetDevice,
          "onUpdate:modelValue": ($event) => unref(form).targetDevice = $event,
          options: deviceOptions,
          label: "Devices"
        }, null, _parent));
        _push(`<div class="grid grid-cols-2 gap-2"><div><label for="ad-priority" class="mb-1 block text-sm font-medium">Priority</label><input id="ad-priority"${ssrRenderAttr("value", unref(form).priority)} type="number" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div><div><label for="ad-weight" class="mb-1 block text-sm font-medium">Weight</label><input id="ad-weight"${ssrRenderAttr("value", unref(form).weight)} type="number" min="1" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div></div><p class="text-xs text-ink-muted"> Highest priority wins. Creatives tied on priority share the slot in proportion to their weight. </p></div></aside></form>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminCreativeForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminCreativeForm-BesEg_Gf.mjs.map
