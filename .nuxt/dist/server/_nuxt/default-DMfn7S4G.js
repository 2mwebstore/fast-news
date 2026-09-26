import { defineComponent, ref, computed, unref, mergeProps, useSSRContext, withAsyncContext, watch, withCtx, createTextVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderSlot } from "vue/server-renderer";
import { u as useLocale, c as useAsyncApi, _ as __nuxt_component_0, a as useApi, w as _sfc_main$6, x as _sfc_main$7 } from "../server.mjs";
import { u as useBreakingStore, a as useBreakingSocket } from "./useBreakingSocket-Cp17g4So.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { _ as _sfc_main$5 } from "./AdSlot-DGDlUSRS.js";
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
import "./index-C4JB2zdt.js";
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "OfflineBanner",
  __ssrInlineRender: true,
  setup(__props) {
    const online = ref(true);
    const showRestored = ref(false);
    const { t } = useLocale();
    const visible = computed(() => !online.value || showRestored.value);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(visible)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: [
            "fixed inset-x-0 top-0 z-[90] px-4 py-2 text-center text-sm font-semibold text-white",
            "animate-slide-down",
            unref(online) ? "bg-success" : "bg-ink"
          ],
          role: "status",
          "aria-live": "polite",
          "data-testid": "offline-banner"
        }, _attrs))}>`);
        if (unref(online)) {
          _push(`<!--[-->${ssrInterpolate(unref(t)("backOnline"))}<!--]-->`);
        } else {
          _push(`<!--[-->${ssrInterpolate(unref(t)("offline"))}<!--]-->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OfflineBanner.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BreakingNewsBar",
  __ssrInlineRender: true,
  props: {
    initial: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const store = useBreakingStore();
    const { t, title: localTitle } = useLocale();
    if (props.initial?.length) {
      store.setItems(props.initial);
    } else {
      const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("breaking-bar", "/api/breaking")), __temp = await __temp, __restore(), __temp);
      if (data.value?.length) store.setItems(data.value);
    }
    const { connected } = useBreakingSocket();
    const index = ref(0);
    let rotator = null;
    const items = computed(() => store.items);
    const current = computed(() => items.value[index.value] ?? null);
    ref(false);
    function startRotation() {
      stopRotation();
      if (items.value.length < 2) return;
      rotator = setInterval();
    }
    function stopRotation() {
      if (rotator) {
        clearInterval(rotator);
        rotator = null;
      }
    }
    watch(items, () => {
      index.value = 0;
      startRotation();
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(current)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "border-b border-breaking/20 bg-breaking text-white",
          role: "region",
          "aria-label": unref(t)("breakingRegion")
        }, _attrs))}><div class="container-content flex items-center gap-3 py-2"><span class="flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide"><span class="inline-block h-2 w-2 rounded-full bg-white animate-pulse-dot" aria-hidden="true"></span> ${ssrInterpolate(unref(t)("breaking"))}</span><div class="min-w-0 flex-1" aria-live="polite" aria-atomic="true">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/news/${unref(current).slug}`,
          class: "block truncate text-kh-sm font-semibold hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(localTitle)(unref(current)))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(localTitle)(unref(current))), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(items).length > 1) {
          _push(`<div class="hidden shrink-0 items-center gap-1 sm:flex"><!--[-->`);
          ssrRenderList(unref(items).slice(0, 5), (item, i) => {
            _push(`<button class="${ssrRenderClass(["h-1.5 rounded-full transition-all", i === unref(index) ? "w-4 bg-white" : "w-1.5 bg-white/50"])}"${ssrRenderAttr("aria-label", unref(t)("breakingItemAria", { n: i + 1 }))}></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/live",
          class: "hidden shrink-0 text-xs font-semibold underline underline-offset-2 sm:block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("viewAll"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("viewAll")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!unref(connected)) {
          _push(`<span class="hidden shrink-0 text-[10px] opacity-70 lg:block" title="Live updates unavailable; refreshing periodically">offline</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreakingNewsBar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MobileStickyAd",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const dismissed = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdSlot = _sfc_main$5;
      if (!unref(dismissed)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden",
          style: { "padding-bottom": "env(safe-area-inset-bottom)" }
        }, _attrs))}><div class="relative flex justify-center py-1"><button class="absolute -top-7 right-2 rounded-full bg-ink/80 p-1.5 text-white"${ssrRenderAttr("aria-label", unref(t)("closeAd"))}><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"></path></svg></button>`);
        _push(ssrRenderComponent(_component_AdSlot, {
          position: "MOBILE_STICKY",
          "collapse-when-empty": "",
          class: "!my-0"
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MobileStickyAd.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
function usePush() {
  const api = useApi();
  const supported = computed(
    () => false
  );
  const permission = ref("default");
  const subscribed = ref(false);
  function urlBase64ToBuffer(base64) {
    const padding = "=".repeat((4 - base64.length % 4) % 4);
    const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(normalized);
    const buffer = new ArrayBuffer(raw.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < raw.length; i += 1) view[i] = raw.charCodeAt(i);
    return buffer;
  }
  async function subscribe(topics) {
    if (!supported.value) return false;
    const { publicKey, configured } = await api.get("/api/push/key");
    if (!configured || !publicKey) return false;
    permission.value = await Notification.requestPermission();
    if (permission.value !== "granted") return false;
    const registration = await (void 0).serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToBuffer(publicKey)
    });
    const payload = subscription.toJSON();
    await api.post("/api/push/subscribe", {
      endpoint: payload.endpoint,
      keys: payload.keys,
      topics,
      lang: "km"
    });
    subscribed.value = true;
    return true;
  }
  async function unsubscribe() {
    if (!supported.value) return;
    const registration = await (void 0).serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;
    await api.post("/api/push/unsubscribe", { endpoint: subscription.endpoint });
    await subscription.unsubscribe();
    subscribed.value = false;
  }
  return { supported, permission, subscribed, subscribe, unsubscribe };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PushNotificationPrompt",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    usePush();
    const visible = ref(false);
    const selected = ref(["breaking"]);
    const busy = ref(false);
    const topics = computed(() => [
      { key: "breaking", label: t("topicBreaking") },
      { key: "cambodia", label: t("topicCambodia") },
      { key: "sports", label: t("topicSports") },
      { key: "kun-khmer", label: t("topicKunKhmer") },
      { key: "business", label: t("topicBusiness") },
      { key: "technology", label: t("topicTechnology") },
      { key: "entertainment", label: t("topicEntertainment") }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(visible)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-line bg-surface p-5 shadow-lift sm:inset-x-auto sm:right-4",
          role: "dialog",
          "aria-labelledby": "push-prompt-heading"
        }, _attrs))}><h2 id="push-prompt-heading" class="text-kh-base font-bold">${ssrInterpolate(unref(t)("notifyHeading"))}</h2><p class="mt-1 text-kh-sm text-ink-muted khmer-wrap">${ssrInterpolate(unref(t)("notifyPickTopics"))}</p><div class="mt-3 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(unref(topics), (topic) => {
          _push(`<button class="${ssrRenderClass([
            "rounded-full border px-3 py-1.5 text-kh-sm transition-colors",
            unref(selected).includes(topic.key) ? "border-brand bg-brand text-white" : "border-line hover:border-brand"
          ])}"${ssrRenderAttr("aria-pressed", unref(selected).includes(topic.key))}>${ssrInterpolate(topic.label)}</button>`);
        });
        _push(`<!--]--></div><div class="mt-4 flex gap-2"><button class="flex-1 rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"${ssrIncludeBooleanAttr(unref(busy) || !unref(selected).length) ? " disabled" : ""}>${ssrInterpolate(unref(busy) ? unref(t)("working") : unref(t)("notifyEnable"))}</button><button class="rounded-lg border border-line px-4 py-2.5 font-semibold hover:bg-surface-muted">${ssrInterpolate(unref(t)("notifyNoThanks"))}</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PushNotificationPrompt.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OfflineBanner = _sfc_main$4;
      const _component_TheHeader = _sfc_main$6;
      const _component_BreakingNewsBar = _sfc_main$3;
      const _component_TheFooter = _sfc_main$7;
      const _component_MobileStickyAd = _sfc_main$2;
      const _component_PushNotificationPrompt = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col bg-surface" }, _attrs))}><a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white">${ssrInterpolate(unref(t)("skipToContent"))}</a>`);
      _push(ssrRenderComponent(_component_OfflineBanner, null, null, _parent));
      _push(ssrRenderComponent(_component_TheHeader, null, null, _parent));
      _push(ssrRenderComponent(_component_BreakingNewsBar, null, null, _parent));
      _push(`<main id="main" class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_TheFooter, null, null, _parent));
      _push(ssrRenderComponent(_component_MobileStickyAd, null, null, _parent));
      _push(ssrRenderComponent(_component_PushNotificationPrompt, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=default-DMfn7S4G.js.map
