import { shallowReactive, reactive, effectScope, getCurrentScope, hasInjectionContext, getCurrentInstance, inject, toRef, shallowRef, isReadonly, isRef, isShallow, isReactive, toRaw, defineComponent, createElementBlock, provide, cloneVNode, h, computed, toValue, onServerPrefetch, ref, nextTick, unref, resolveComponent, defineAsyncComponent, Suspense, mergeProps, isVNode, createCommentVNode, Fragment, withCtx, createVNode, useSSRContext, withAsyncContext, watch, createTextVNode, toDisplayString, onErrorCaptured, resolveDynamicComponent, createApp } from "vue";
import { $fetch as $fetch$1 } from "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import { baseURL } from "#internal/nuxt/paths";
import { createHooks } from "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { getContext, executeAsync } from "/Users/sila/Desktop/fast-news/web/node_modules/unctx/dist/index.mjs";
import { sanitizeStatusCode, createError as createError$1, getRequestHeader, setCookie, getCookie, deleteCookie } from "/Users/sila/Desktop/fast-news/web/node_modules/h3/dist/index.mjs";
import { shouldHydrate, setActivePinia, createPinia } from "pinia";
import { defu } from "/Users/sila/Desktop/fast-news/web/node_modules/defu/dist/defu.mjs";
import { START_LOCATION, createMemoryHistory, createRouter, useRoute as useRoute$1, RouterView } from "vue-router";
import { hasProtocol, isScriptProtocol, joinURL, withQuery, parseURL, encodePath, decodePath, parseQuery, withTrailingSlash, withoutTrailingSlash } from "/Users/sila/Desktop/fast-news/web/node_modules/ufo/dist/index.mjs";
import { klona } from "/Users/sila/Desktop/fast-news/web/node_modules/klona/dist/index.mjs";
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderSuspense, ssrRenderVNode } from "vue/server-renderer";
import { useHead as useHead$1, useSeoMeta as useSeoMeta$1, headSymbol } from "/Users/sila/Desktop/fast-news/web/node_modules/@unhead/vue/dist/index.mjs";
import { debounce } from "/Users/sila/Desktop/fast-news/web/node_modules/perfect-debounce/dist/index.mjs";
import { parse } from "/Users/sila/Desktop/fast-news/web/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import destr from "/Users/sila/Desktop/fast-news/web/node_modules/destr/dist/index.mjs";
import { isEqual } from "/Users/sila/Desktop/fast-news/web/node_modules/ohash/dist/index.mjs";
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.11";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
import.meta.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
function isScopeWithinInstance(instance) {
  const instanceScope = instance.scope;
  let scope = getCurrentScope();
  while (scope) {
    if (scope === instanceScope) {
      return true;
    }
    scope = scope.parent;
  }
  return false;
}
const useRoute = () => {
  if (hasInjectionContext()) {
    const instance = getCurrentInstance();
    if (!instance || isScopeWithinInstance(instance)) {
      return inject(PageRouteSymbol, useNuxtApp()._route);
    }
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedHeader = encodeURL(location2, isExternalHost);
        const encodedLoc = encodeForHtmlAttr(encodedHeader);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    const pathname = url.pathname.replace(/^\/{2,}/, "/");
    return pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function useSeoMeta(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useSeoMeta$1(input, { head, ...options });
  }
}
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
function generateRouteKey$1(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey$1(to) !== generateRouteKey$1(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const VALID_TAG_RE = /^[a-z][a-z0-9-]*$/i;
function sanitizeTag(tag, fallback) {
  return tag && VALID_TAG_RE.test(tag) ? tag : fallback;
}
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
function _mergeTransitionProps(routeProps) {
  const _props = [];
  for (const prop of routeProps) {
    if (!prop) {
      continue;
    }
    _props.push({
      ...prop,
      onAfterLeave: prop.onAfterLeave ? toArray$1(prop.onAfterLeave) : void 0,
      onBeforeLeave: prop.onBeforeLeave ? toArray$1(prop.onBeforeLeave) : void 0
    });
  }
  return defu(..._props);
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const router = useRouter();
    const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve) => {
      const doScroll = () => {
        requestAnimationFrame(() => {
          if (router.currentRoute.value.fullPath !== to.fullPath) {
            resolve(false);
            return;
          }
          resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        });
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const sensitiveMatcher = /* @__PURE__ */ (() => {
  const $0 = { payload: true }, $1 = { redirect: "/video" }, $2 = { ssr: true }, $3 = { ssr: false };
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1);
    if (p === "") {
      r.push({ data: $0 });
    } else if (p === "/video/shorts") {
      r.push({ data: $1 });
    } else if (p === "/live") {
      r.push({ data: $2 });
    } else if (p === "/search") {
      r.push({ data: $2 });
    } else if (p.charCodeAt(p.length - 1) === 47) {
      if (p === "/") {
        r.push({ data: $0 });
      } else if (p === "/video/shorts/") {
        r.push({ data: $1 });
      } else if (p === "/live/") {
        r.push({ data: $2 });
      } else if (p === "/search/") {
        r.push({ data: $2 });
      }
    }
    let s = p.split("/");
    if (s.length > 1 && s[s.length - 1] === "") {
      s.pop();
      p = p.slice(0, -1);
    }
    let l = s.length;
    if (l > 1) {
      if (s[1] === "news") {
        r.push({ data: $0, params: { "_": p.slice(6) } });
      } else if (s[1] === "category") {
        r.push({ data: $0, params: { "_": p.slice(10) } });
      } else if (s[1] === "author") {
        r.push({ data: $0, params: { "_": p.slice(8) } });
      } else if (s[1] === "video") {
        r.push({ data: $0, params: { "_": p.slice(7) } });
      } else if (s[1] === "admin") {
        r.push({ data: $3, params: { "_": p.slice(7) } });
      }
    }
    return r.reverse();
  };
})();
const foldedMatcher = sensitiveMatcher;
const decodeRoutePath = function decodeRoutePath2(path) {
  if (!path.includes("%")) return path;
  const queryIndex = path.indexOf("?");
  const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
  try {
    return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
  } catch {
    return path;
  }
};
const normalizePath = (path, fold) => {
  if (typeof path !== "string") {
    return path;
  }
  const decoded = decodeRoutePath(path);
  return fold ? decoded.toLowerCase() : decoded;
};
const _routeRulesMatcher = (path) => routerOptions.sensitive ? defu({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
const interpolatePath = (route, match) => {
  return match.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
  const source = matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$p = { layout: "admin" };
const __nuxt_page_meta$o = { layout: "admin" };
const __nuxt_page_meta$n = { layout: "admin" };
const __nuxt_page_meta$m = { layout: false };
const __nuxt_page_meta$l = { layout: "admin" };
const __nuxt_page_meta$k = { layout: "admin" };
const __nuxt_page_meta$j = { layout: "admin" };
const __nuxt_page_meta$i = { layout: "admin" };
const __nuxt_page_meta$h = { layout: false };
const __nuxt_page_meta$g = { layout: "admin" };
const __nuxt_page_meta$f = { layout: "admin" };
const __nuxt_page_meta$e = { layout: "admin" };
const __nuxt_page_meta$d = { layout: "admin" };
const __nuxt_page_meta$c = { layout: "admin" };
const __nuxt_page_meta$b = { layout: "admin" };
const __nuxt_page_meta$a = { layout: "admin" };
const __nuxt_page_meta$9 = { layout: "admin" };
const __nuxt_page_meta$8 = { layout: "admin" };
const __nuxt_page_meta$7 = { layout: "admin" };
const __nuxt_page_meta$6 = { layout: "admin" };
const __nuxt_page_meta$5 = { layout: "admin" };
const __nuxt_page_meta$4 = { layout: "admin" };
const __nuxt_page_meta$3 = { layout: "admin" };
const __nuxt_page_meta$2 = { layout: "admin" };
const __nuxt_page_meta$1 = { layout: "admin" };
const __nuxt_page_meta = null;
const component_45stubX0SOMu7wJHHE5RGXGc60_3kH6yLYM94pWjrcCvQxig8 = {};
const _routes = [
  {
    name: "tip",
    path: "/tip",
    component: () => import("./_nuxt/tip-CNihb8J5.js")
  },
  {
    name: "live",
    path: "/live",
    component: () => import("./_nuxt/live-CgdOGVNz.js")
  },
  {
    name: "index",
    path: "/",
    component: () => import("./_nuxt/index-D0sRYwML.js")
  },
  {
    name: "slug",
    path: "/:slug()",
    component: () => import("./_nuxt/_slug_-DEXx1qiB.js")
  },
  {
    name: "search",
    path: "/search",
    component: () => import("./_nuxt/search-DoOtiKVB.js")
  },
  {
    name: "archive",
    path: "/archive",
    component: () => import("./_nuxt/archive-BT4H-d5L.js")
  },
  {
    name: "traffic",
    path: "/traffic",
    component: () => import("./_nuxt/traffic-D_5QIvju.js")
  },
  {
    name: "admin-seo",
    path: "/admin/seo",
    meta: { ...__nuxt_page_meta$p || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/seo-DGPGVbXT.js")
  },
  {
    name: "admin-tips",
    path: "/admin/tips",
    meta: { ...__nuxt_page_meta$o || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/tips-BKn6BFiD.js")
  },
  {
    name: "live-video",
    path: "/live-video",
    component: () => import("./_nuxt/live-video-CqfFbe3i.js")
  },
  {
    name: "admin",
    path: "/admin",
    meta: { ...__nuxt_page_meta$n || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/index-DouS-sbO.js")
  },
  {
    name: "admin-login",
    path: "/admin/login",
    meta: __nuxt_page_meta$m || {},
    component: () => import("./_nuxt/login-D3p9NMdT.js")
  },
  {
    name: "admin-media",
    path: "/admin/media",
    meta: { ...__nuxt_page_meta$l || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/media-DMheIYKP.js")
  },
  {
    name: "news-slug",
    path: "/news/:slug()",
    component: () => import("./_nuxt/_slug_-cHqMhKdD.js")
  },
  {
    name: "video",
    path: "/video",
    component: () => import("./_nuxt/index-Bew68SgV.js")
  },
  {
    name: "admin-review",
    path: "/admin/review",
    meta: { ...__nuxt_page_meta$k || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/review-Bf4Vs7hM.js")
  },
  {
    name: "video-slug",
    path: "/video/:slug()",
    component: () => import("./_nuxt/_slug_-1hEkuyWE.js")
  },
  {
    name: "admin-ai-news",
    path: "/admin/ai-news",
    meta: { ...__nuxt_page_meta$j || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/ai-news-Wg2C7-JF.js")
  },
  {
    name: "author-slug",
    path: "/author/:slug()",
    component: () => import("./_nuxt/_slug_-CPSYILJD.js")
  },
  {
    name: "admin-settings",
    path: "/admin/settings",
    meta: { ...__nuxt_page_meta$i || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/settings-DS8AXV56.js")
  },
  {
    name: "admin-telegram",
    path: "/admin/telegram",
    meta: { ...__nuxt_page_meta$h || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/telegram-d73vl1hg.js")
  },
  {
    name: "admin-ads",
    path: "/admin/ads",
    meta: { ...__nuxt_page_meta$g || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/index-ByGQHUlZ.js")
  },
  {
    name: "admin-analytics",
    path: "/admin/analytics",
    meta: { ...__nuxt_page_meta$f || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/analytics-DovyH4Ze.js")
  },
  {
    name: "category-slug",
    path: "/category/:slug()",
    component: () => import("./_nuxt/_slug_-BD1tfU7i.js")
  },
  {
    name: "admin-audit-logs",
    path: "/admin/audit-logs",
    meta: { ...__nuxt_page_meta$e || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/audit-logs-S9wVcWX_.js")
  },
  {
    name: "admin-news",
    path: "/admin/news",
    meta: { ...__nuxt_page_meta$d || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/index-g6Fl46HB.js")
  },
  {
    name: "admin-pages-id",
    path: "/admin/pages/:id()",
    meta: { ...__nuxt_page_meta$c || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/_id_-B453LwOs.js")
  },
  {
    name: "admin-roles-id",
    path: "/admin/roles/:id()",
    meta: { ...__nuxt_page_meta$b || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/_id_-BXG9c254.js")
  },
  {
    name: "admin-news-create",
    path: "/admin/news/create",
    meta: { ...__nuxt_page_meta$a || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/create-C2iasPKH.js")
  },
  {
    name: "admin-pages",
    path: "/admin/pages",
    meta: { ...__nuxt_page_meta$9 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/index-CEnW5ZPI.js")
  },
  {
    name: "admin-roles",
    path: "/admin/roles",
    meta: { ...__nuxt_page_meta$8 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/index-CQ7CIhhW.js")
  },
  {
    name: "admin-videos",
    path: "/admin/videos",
    meta: { ...__nuxt_page_meta$7 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/index-CwyaToed.js")
  },
  {
    name: "admin-videos-create",
    path: "/admin/videos/create",
    meta: { ...__nuxt_page_meta$6 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/create-DFHbtKvl.js")
  },
  {
    name: "admin-news-id-edit",
    path: "/admin/news/:id()/edit",
    meta: { ...__nuxt_page_meta$5 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/edit-CJarCBbo.js")
  },
  {
    name: "admin-categories",
    path: "/admin/categories",
    meta: { ...__nuxt_page_meta$4 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/index-CBkE8nZT.js")
  },
  {
    name: "admin-videos-id-edit",
    path: "/admin/videos/:id()/edit",
    meta: { ...__nuxt_page_meta$3 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/edit-BBzFPSte.js")
  },
  {
    name: "admin-ads-creatives-create",
    path: "/admin/ads/creatives/create",
    meta: { ...__nuxt_page_meta$2 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/create-jROgFMw1.js")
  },
  {
    name: "admin-ads-creatives-id-edit",
    path: "/admin/ads/creatives/:id()/edit",
    meta: { ...__nuxt_page_meta$1 || {}, ...{ "middleware": "admin" } },
    component: () => import("./_nuxt/edit-JHa60Z1W.js")
  },
  {
    name: __nuxt_page_meta?.name,
    path: "/video/shorts",
    component: component_45stubX0SOMu7wJHHE5RGXGc60_3kH6yLYM94pWjrcCvQxig8
  }
];
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {
  admin: () => import("./_nuxt/admin-BSOu7ZWu.js")
};
Object.assign(/* @__PURE__ */ Object.create(null), {});
const pageIslandRoutes = Object.assign(/* @__PURE__ */ Object.create(null), {});
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      const lastTo = to.matched.at(-1)?.components?.default;
      const lastFrom = from.matched.at(-1)?.components?.default;
      if (lastTo === lastFrom) {
        const toKey = generateRouteKey({ route: to, Component: { type: lastTo } });
        const fromKey = generateRouteKey({ route: from, Component: { type: lastFrom } });
        if (toKey === fromKey) {
          syncCurrentRoute();
        }
        return;
      }
      if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
    if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        {
          delete nuxtApp._middlewareTo;
        }
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext && !isServerPage) {
      return { provide: { router } };
    }
    function pushErroredRoute(to) {
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      {
        nuxtApp._middlewareTo = to;
      }
      if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
                pushErroredRoute(to);
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    if (isServerPage) {
      router.beforeResolve((to) => {
        const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
        const actual = to.matched.find((m) => m.components?.default?.__nuxt_island)?.components?.default;
        if (!expected || expected !== actual?.__nuxt_island) {
          nuxtApp.ssrContext["~renderResponse"] = {
            statusCode: 400,
            statusMessage: "Invalid island request path"
          };
          return false;
        }
      });
    }
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      {
        delete nuxtApp._middlewareTo;
      }
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        const pluginNavigatedAway = false;
        if (pluginNavigatedAway) ;
        else if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry2 = nuxtApp._asyncData[key.value];
      if (entry2?._abortController) {
        try {
          entry2._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry2._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  Object.defineProperties(asyncDataPromise, {
    then: { enumerable: true, value: asyncDataPromise.then.bind(asyncDataPromise) },
    catch: { enumerable: true, value: asyncDataPromise.catch.bind(asyncDataPromise) },
    finally: { enumerable: true, value: asyncDataPromise.finally.bind(asyncDataPromise) }
  });
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    {
      nuxtApp._asyncData[key].pending.value = false;
    }
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= asyncDataDefaults.errorValue;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = !import.meta.prerender || !nuxtApp.ssrContext?.["~sharedPrerenderCache"] ? _handler : (nuxtApp2, options2) => {
    const value = nuxtApp2.ssrContext["~sharedPrerenderCache"].get(key);
    if (value) {
      return value;
    }
    const promise = Promise.resolve().then(() => nuxtApp2.runWithContext(() => _handler(nuxtApp2, options2)));
    nuxtApp2.ssrContext["~sharedPrerenderCache"].set(key, promise);
    return promise;
  };
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData != null;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: shallowRef(!hasCachedData),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer(opts.dedupe ?? options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData != null) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = asyncDataDefaults.errorValue;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      {
        asyncData.pending.value = true;
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return;
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = asyncDataDefaults.errorValue;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (asyncData._abortController?.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        if (nuxtApp._asyncDataPromises[key] === promise) {
          {
            asyncData.pending.value = false;
          }
          delete nuxtApp._asyncDataPromises[key];
        }
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (nuxtApp._asyncDataPromises[key]) {
        asyncData._abortController?.abort(new DOMException("AsyncData request cancelled by unmount", "AbortError"));
        delete nuxtApp._asyncDataPromises[key];
        if (asyncData.status.value === "pending") {
          asyncData.status.value = "idle";
        }
        {
          asyncData.pending.value = false;
        }
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
            asyncData.data.value = asyncDataDefaults.value;
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => asyncDataDefaults.value;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
function sanitizeExternalHref(value) {
  let candidate = value.replace(/[\u0000-\u001f\s]+/g, "");
  while (candidate.toLowerCase().startsWith("view-source:")) {
    candidate = candidate.slice("view-source:".length);
  }
  const colon = candidate.indexOf(":");
  if (colon > 0 && isScriptProtocol(candidate.slice(0, colon + 1))) {
    return null;
  }
  return value;
}
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        const raw = to.value;
        return typeof raw === "string" ? sanitizeExternalHref(raw) : raw;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        const safe = typeof href2 === "string" ? sanitizeExternalHref(href2) : href2;
        return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        if (href.value === null) {
          return;
        }
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath(href.value ?? "");
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  if (trailingSlash !== "append" && trailingSlash !== "remove") {
    return to;
  }
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia;
    }
    return {
      provide: {
        pinia
      }
    };
  },
  hooks: {
    "app:rendered"() {
      const nuxtApp = useNuxtApp();
      nuxtApp.payload.pinia = toRaw(nuxtApp.$pinia).state.value;
      setActivePinia(void 0);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const reveal_snmQhZfipqSXKAciJSK6gyqNJnfbBUO5IgmKus35Q5c = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", {
    // getSSRProps must exist for server rendering; the effect is client-only.
    getSSRProps: () => ({}),
    mounted(el) {
      {
        el.classList.add("is-revealed");
        return;
      }
    },
    unmounted(el) {
    }
  });
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  reveal_snmQhZfipqSXKAciJSK6gyqNJnfbBUO5IgmKus35Q5c
];
const layouts = {
  admin: defineAsyncComponent(() => import("./_nuxt/admin-Dbg82b2b.js").then((m) => m.default || m)),
  default: defineAsyncComponent(() => import("./_nuxt/default-DMfn7S4G.js").then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = !!layout.value && layout.value in layouts;
      const hasTransition = hasLayout && !!(route?.meta.layoutTransition ?? appLayoutTransition);
      const transitionProps = hasTransition && _mergeTransitionProps([
        route?.meta.layoutTransition,
        appLayoutTransition,
        {
          onBeforeLeave() {
            nuxtApp["~transitionPromise"] = new Promise((resolve) => {
              nuxtApp["~transitionFinish"] = resolve;
            });
          },
          onAfterLeave() {
            nuxtApp["~transitionFinish"]?.();
            delete nuxtApp["~transitionFinish"];
            delete nuxtApp["~transitionPromise"];
          }
        }
      ]);
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(transitionProps, {
        default: () => h(
          Suspense,
          {
            suspensible: true,
            onResolve: async () => {
              await nextTick(done);
            }
          },
          {
            default: () => h(
              LayoutProvider,
              {
                layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
                key: layout.value || void 0,
                name: layout.value,
                shouldProvide: !props.name,
                isRenderingNewLayout: (name) => {
                  return name !== previouslyRenderedLayout && name === layout.value;
                },
                hasTransition
              },
              context.slots
            )
          }
        )
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route) => name === false || name === (route.meta.layout ?? routeRulesMatcher(route.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    const enclosingLayout = inject(LayoutMetaSymbol, null);
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            const useEagerRoute = props.isRenderingNewLayout(props.name) && (!enclosingLayout || enclosingLayout.isCurrent(vueRouterRoute));
            return useEagerRoute ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: markStableSlot((routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        })
      });
    };
  }
});
function markStableSlot(fn) {
  const wrapped = ((routeProps) => {
    const result = fn(routeProps);
    if (Array.isArray(result)) {
      return result;
    }
    if (result == null || !isVNode(result)) {
      return [createCommentVNode()];
    }
    return [result];
  });
  wrapped._n = true;
  return wrapped;
}
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const config = /* @__PURE__ */ useRuntimeConfig();
    useHead({
      titleTemplate: (title) => {
        if (!title) return config.public.siteName;
        const brand = config.public.siteName;
        const brandKh = config.public.siteNameKh;
        if (title.includes(brand) || title.includes(brandKh)) return title;
        return `${title} | ${brand}`;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "TheLogo",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        viewBox: "0 0 240 40",
        role: "img",
        "aria-label": "Cambodia Fast News",
        fill: "none"
      }, _attrs))}><rect x="0" y="4" width="32" height="32" rx="6" fill="#1E3A8A"></rect><path d="M9 20h14M16 13l7 7-7 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><text x="40" y="19" font-family="Manrope, sans-serif" font-size="15" font-weight="800" fill="#0F172A"> CAMBODIA </text><text x="40" y="34" font-family="Manrope, sans-serif" font-size="15" font-weight="800" fill="#1E3A8A" letter-spacing="0.5"> FAST NEWS </text></svg>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TheLogo.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
function forwardedClientHeaders() {
  const event = useRequestEvent();
  if (!event) return {};
  const headers = event.node.req.headers;
  const forwardedFor = headers["x-forwarded-for"];
  const ip = headers["cf-connecting-ip"] || (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(",")[0]?.trim() || event.node.req.socket?.remoteAddress || "";
  return ip ? { "X-CFN-Client-IP": ip } : {};
}
function useApi() {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const base = config.apiInternalBase;
  async function request(path, options = {}) {
    const response = await $fetch(path, {
      baseURL: base,
      ...options,
      headers: {
        ...forwardedClientHeaders(),
        ...options.headers ?? {}
      }
    });
    return { data: response.data, meta: response.meta };
  }
  return {
    base,
    /** GET a resource, returning just its data. */
    async get(path, query) {
      const { data } = await request(path, { method: "GET", query });
      return data;
    },
    /** GET a list, returning data and pagination together. */
    async list(path, query) {
      return request(path, { method: "GET", query });
    },
    async post(path, body) {
      const { data } = await request(path, { method: "POST", body });
      return data;
    },
    /**
     * Fire-and-forget beacon for analytics. Failures are swallowed: a dropped
     * view count must never surface as an error to the reader.
     */
    beacon(path, body) {
      return;
    }
  };
}
function useAsyncApi(key, path, query) {
  const api = useApi();
  return useAsyncData(key, () => api.get(path, query), {
    // A failed module should leave a gap, not blank the whole page.
    default: () => null
  });
}
function pageError(error, notFoundMessage) {
  const status = statusOf(error);
  if (status === 404) {
    return createError({ statusCode: 404, statusMessage: notFoundMessage, fatal: true });
  }
  if (status === 429) {
    return createError({
      statusCode: 429,
      statusMessage: "Too many requests — please wait a moment and reload",
      fatal: true
    });
  }
  return createError({
    statusCode: status && status >= 400 ? status : 500,
    statusMessage: "This page could not be loaded",
    fatal: true
  });
}
function statusOf(error) {
  if (!error || typeof error !== "object") return void 0;
  const e = error;
  return e.statusCode ?? e.status ?? e.response?.status;
}
const MONTH_NAMES = {
  km: [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ"
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
const messages = {
  km: {
    home: "ទំព័រដើម",
    latestNews: "ព័ត៌មានថ្មីៗ",
    breaking: "បន្ទាន់",
    live: "ព័ត៌មានផ្ទាល់",
    trending: "កំពុងពេញនិយម",
    fiveMinute: "ព័ត៌មាន ៥ នាទី",
    newsPulse: "ចលនាព័ត៌មាន",
    videoNews: "វីដេអូព័ត៌មាន",
    relatedNews: "ព័ត៌មានពាក់ព័ន្ធ",
    search: "ស្វែងរក",
    searchPlaceholder: "ស្វែងរកព័ត៌មាន...",
    viewAll: "មើលទាំងអស់",
    loadMore: "មើលព័ត៌មានបន្ថែម",
    loading: "កំពុងផ្ទុក...",
    noResults: "រកមិនឃើញលទ្ធផលទេ។",
    endOfList: "អ្នកបានមើលដល់ចុងបញ្ចប់ហើយ",
    readMinutes: "អាន {n} នាទី",
    published: "ផ្សាយ",
    updated: "កែសម្រួល",
    share: "ចែករំលែក",
    menu: "ម៉ឺនុយ",
    sections: "ផ្នែកព័ត៌មាន",
    skipToContent: "រំលងទៅមាតិកាចម្បង",
    sponsored: "ខ្លឹមសារឧបត្ថម្ភ",
    aiSummary: "សង្ខេបព័ត៌មាន",
    correction: "កែតម្រូវ",
    // Shown when a reader picks English on a story that has none.
    noTranslation: "អត្ថបទនេះមានជាភាសាខ្មែរប៉ុណ្ណោះ។",
    shareLabel: "ចែករំលែក៖",
    shareVia: "ចែករំលែកតាម {network}",
    copyLink: "ចម្លងតំណ",
    copied: "បានចម្លង",
    linkCopied: "បានចម្លងតំណ",
    footerMore: "ព័ត៌មានបន្ថែម",
    footerPolicies: "គោលការណ៍",
    footerFollow: "តាមដានយើង",
    footerContact: "ទំនាក់ទំនង",
    allRightsReserved: "រក្សាសិទ្ធិគ្រប់យ៉ាង។",
    archive: "បណ្ណសារ",
    trafficStatus: "ស្ថានភាពចរាចរណ៍",
    sendUsNews: "ផ្ញើព័ត៌មានមកយើង",
    aboutUs: "អំពីយើង",
    editorialPolicy: "គោលការណ៍វិចារណកថា",
    correctionPolicy: "គោលការណ៍កែតម្រូវ",
    privacyPolicy: "គោលការណ៍ឯកជនភាព",
    termsOfUse: "លក្ខខណ្ឌប្រើប្រាស់",
    views: "ទស្សនា",
    moreVideos: "វីដេអូផ្សេងទៀត",
    noVideos: "មិនទាន់មានវីដេអូទេ។",
    liveNow: "ផ្សាយផ្ទាល់ឥឡូវ",
    notLive: "មិនមានការផ្សាយផ្ទាល់ទេ។",
    playVideo: "លេងវីដេអូ",
    searchResultsFor: "លទ្ធផលសម្រាប់ “{q}”",
    searchPrompt: "បញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក។",
    resultsCount: "លទ្ធផល {n}",
    inSections: "ផ្នែក",
    inAuthors: "អ្នកសារព័ត៌មាន",
    inVideos: "វីដេអូ",
    inArticles: "អត្ថបទ",
    browseArchive: "រុករកបណ្ណសារ",
    year: "ឆ្នាំ",
    month: "ខែ",
    allYears: "គ្រប់ឆ្នាំ",
    allMonths: "គ្រប់ខែ",
    previous: "មុន",
    next: "បន្ទាប់",
    page: "ទំព័រ {n}",
    pageOf: "ទំព័រ {n} ក្នុងចំណោម {total}",
    offline: "អ្នកកំពុងគ្មានអ៊ីនធឺណិត។ កំពុងបង្ហាញអ្វីដែលបានផ្ទុករួច។",
    backOnline: "មានអ៊ីនធឺណិតវិញហើយ។",
    retry: "ព្យាយាមម្តងទៀត",
    notifyTitle: "ទទួលការជូនដំណឹងព័ត៌មានបន្ទាន់",
    notifyBody: "យើងនឹងជូនដំណឹងតែព័ត៌មានបន្ទាន់។ អ្នកអាចបិទបានពេលណាក៏បាន។",
    notifyAllow: "បើក",
    notifyDismiss: "មិនឥឡូវទេ",
    notifyBlocked: "ការជូនដំណឹងត្រូវបានបិទក្នុងការកំណត់កម្មវិធីរុករក។",
    aiSummaryNote: "សង្ខេបដោយស្វ័យប្រវត្តិ។ អត្ថបទពេញលេញនៅខាងក្រោម។",
    imageIllustration: "រូបភាពឧទាហរណ៍",
    advertisement: "ពាណិជ្ជកម្ម",
    closeAd: "បិទការផ្សាយពាណិជ្ជកម្ម",
    pagination: "ទំព័រ",
    aiImageNotice: "រូបភាពបង្កើតដោយ AI",
    liveBadge: "ផ្ទាល់",
    closeViewer: "បិទ",
    zoomIn: "ពង្រីក",
    zoomOut: "បង្រួម",
    openImage: "បើករូបភាព",
    trafficIntro: "ស្ថានភាពផ្លូវធំៗ។ ធ្វើបច្ចុប្បន្នភាពដោយបន្ទប់ព័ត៌មានរបស់យើង។",
    noTrafficData: "មិនមានរបាយការណ៍ចរាចរណ៍ទេ។",
    lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ",
    policyOnlyKhmer: "ឯកសារនេះផ្សាយជាភាសាខ្មែរ។ មិនទាន់មានការបកប្រែជាភាសាអង់គ្លេសទេ។",
    topicBreaking: "ព័ត៌មានបន្ទាន់",
    topicCambodia: "កម្ពុជា",
    topicSports: "កីឡា",
    topicKunKhmer: "គុនខ្មែរ",
    topicBusiness: "សេដ្ឋកិច្ច",
    topicTechnology: "បច្ចេកវិទ្យា",
    topicEntertainment: "កម្សាន្ត",
    notifyPickTopics: "ជ្រើសរើសប្រធានបទដែលអ្នកចាប់អារម្មណ៍។ យើងមិនផ្ញើការជូនដំណឹងសម្រាប់អត្ថបទគ្រប់ៗទេ។",
    notifyHeading: "ទទួលការជូនដំណឹងព័ត៌មានបន្ទាន់?",
    notifyEnable: "បើកការជូនដំណឹង",
    notifyNoThanks: "មិនអីទេ",
    working: "កំពុងដំណើរការ...",
    aiSummaryFootnote: "សង្ខេបនេះបង្កើតដោយ AI ហើយពិនិត្យដោយអ្នកកែសម្រួល។ សូមអានអត្ថបទពេញលេញសម្រាប់ព័ត៌មានទាំងស្រុង។",
    enlargeImage: "ពង្រីករូបភាព — {alt}",
    close: "បិទ",
    aiImageIllustration: "រូបភាពបង្កើតដោយ AI សម្រាប់ជាឧទាហរណ៍",
    lastTwentyFourHours: "២៤ ម៉ោងចុងក្រោយ",
    correctionLabel: "កែតម្រូវ",
    playVideoAria: "ចាក់វីដេអូ — {title}",
    noVideoAttached: "មិនទាន់មានវីដេអូភ្ជាប់ទេ។",
    breakingRegion: "ព័ត៌មានបន្ទាន់",
    breakingItemAria: "ព័ត៌មានបន្ទាន់ទី {n}",
    policyUpdated: "ធ្វើបច្ចុប្បន្នភាព៖",
    language: "ភាសា",
    searching: "កំពុងស្វែងរក...",
    searchMinChars: "សូមវាយបញ្ចូលពាក្យគន្លឹះយ៉ាងតិច ២ តួអក្សរ។",
    searchKeyword: "វាយបញ្ចូលពាក្យគន្លឹះ...",
    foundResults: "រកឃើញ {n} លទ្ធផលសម្រាប់ “{q}”",
    noArticlesFound: "រកមិនឃើញអត្ថបទទេ។",
    authors: "អ្នកសរសេរ",
    archiveTitle: "បណ្ណសារព័ត៌មាន",
    byMonth: "តាមខែ",
    bySection: "តាមផ្នែក",
    all: "ទាំងអស់",
    noArticlesForSelection: "មិនមានអត្ថបទសម្រាប់ជម្រើសនេះទេ។",
    liveUpdating: "កំពុងធ្វើបច្ចុប្បន្នភាពផ្ទាល់",
    refreshingEachMinute: "ធ្វើបច្ចុប្បន្នភាពរៀងរាល់នាទី",
    liveBroadcast: "ផ្សាយផ្ទាល់",
    nothingLiveNow: "មិនមានការផ្សាយផ្ទាល់ទេឥឡូវនេះ",
    checkLatestVideos: "សូមពិនិត្យមើលវីដេអូព័ត៌មានចុងក្រោយរបស់យើង។",
    watchVideos: "មើលវីដេអូ",
    trafficTitle: "ស្ថានភាពចរាចរណ៍",
    trafficNormal: "ធម្មតា",
    trafficModerate: "មធ្យម",
    trafficHeavy: "កកស្ទះ",
    lastAssessed: "វាយតម្លៃចុងក្រោយ៖",
    breadcrumb: "ផ្លូវរុករក",
    subsections: "ផ្នែករង",
    noArticlesInSection: "មិនទាន់មានព័ត៌មានក្នុងផ្នែកនេះទេ។",
    sponsoredBy: "ខ្លឹមសារនេះត្រូវបានឧបត្ថម្ភដោយ",
    sponsoredDisclaimer: "វាមិនមែនជាការរាយការណ៍ព័ត៌មានឯករាជ្យរបស់ {site} ទេ។",
    quickRead: "អានឆាប់រហ័ស",
    archiveDesc: "បណ្ណសារព័ត៌មានទាំងអស់របស់ Cambodia Fast News តាមឆ្នាំ និងខែ។",
    homeDesc: "ព័ត៌មានទាន់ហេតុការណ៍ពីកម្ពុជា និងពិភពលោក — នយោបាយ សេដ្ឋកិច្ច កីឡា គុនខ្មែរ បច្ចេកវិទ្យា និងកម្សាន្ត។",
    liveVideoDesc: "ការផ្សាយផ្ទាល់ពី Cambodia Fast News។",
    liveDesc: "ព័ត៌មានបន្ទាន់ និងថ្មីបំផុតពី Cambodia Fast News ផ្សាយផ្ទាល់។",
    searchDesc: "ស្វែងរកព័ត៌មាន វីដេអូ និងអ្នកសរសេរនៅ Cambodia Fast News។",
    videoDesc: "វីដេអូព័ត៌មានថ្មីៗពី Cambodia Fast News។",
    searchNews: "ស្វែងរកព័ត៌មាន",
    archiveFor: "បណ្ណសារ {month} {year}",
    liveColon: "ផ្សាយផ្ទាល់៖",
    searchColon: "ស្វែងរក៖",
    tipTitle: "ផ្ញើព័ត៌មានមកយើង",
    tipDesc: "ផ្ញើព័ត៌មាន រូបភាព ឬវីដេអូមកកាន់បន្ទប់ព័ត៌មាន Cambodia Fast News។",
    tipIntro: "រាល់ព័ត៌មានដែលផ្ញើមកនឹងត្រូវបានពិនិត្យ និងផ្ទៀងផ្ទាត់ដោយអ្នកកែសម្រួលជាមុនសិន។ គ្មានអ្វីត្រូវបានផ្សាយដោយស្វ័យប្រវត្តិទេ។",
    tipThanks: "សូមអរគុណ!",
    tipReceived: "ព័ត៌មានរបស់អ្នកបានមកដល់បន្ទប់ព័ត៌មានហើយ។ អ្នកកែសម្រួលនឹងពិនិត្យវា។",
    tipWhatHappened: "តើមានអ្វីកើតឡើង?",
    tipDetailPlaceholder: "ពណ៌នាអំពីអ្វីដែលអ្នកបានឃើញ កន្លែង និងពេលវេលា...",
    tipLocation: "ទីកន្លែង",
    tipLocationPlaceholder: "ឧ. ផ្លូវ ២៧១ ភ្នំពេញ",
    tipName: "ឈ្មោះ (ស្រេចចិត្ត)",
    tipContact: "ទំនាក់ទំនង (ស្រេចចិត្ត)",
    tipContactPlaceholder: "អ៊ីមែល ឬលេខទូរស័ព្ទ",
    tipContactNote: "ព័ត៌មានទំនាក់ទំនងត្រូវប្រើសម្រាប់ផ្ទៀងផ្ទាត់តែប៉ុណ្ណោះ ហើយមិនត្រូវបានផ្សាយទេ។",
    tipSubmit: "ផ្ញើព័ត៌មាន",
    tipSending: "កំពុងផ្ញើ...",
    tipTooShort: "សូមពណ៌នាឱ្យបានលម្អិតបន្តិច (យ៉ាងតិច ១០ តួអក្សរ)។",
    tipFailed: "មិនអាចផ្ញើបានទេ។ សូមព្យាយាមម្តងទៀត។"
  },
  en: {
    home: "Home",
    latestNews: "Latest news",
    breaking: "Breaking",
    live: "Live",
    trending: "Trending",
    fiveMinute: "5-minute news",
    newsPulse: "News pulse",
    videoNews: "Video news",
    relatedNews: "Related news",
    search: "Search",
    searchPlaceholder: "Search news...",
    viewAll: "View all",
    loadMore: "Load more",
    loading: "Loading...",
    noResults: "No results found.",
    endOfList: "You've reached the end",
    readMinutes: "{n} min read",
    published: "Published",
    updated: "Updated",
    share: "Share",
    menu: "Menu",
    sections: "News sections",
    skipToContent: "Skip to main content",
    sponsored: "Sponsored",
    aiSummary: "Summary",
    correction: "Correction",
    noTranslation: "This article is available in Khmer only.",
    shareLabel: "Share:",
    shareVia: "Share on {network}",
    copyLink: "Copy link",
    copied: "Copied",
    linkCopied: "Link copied",
    footerMore: "More",
    footerPolicies: "Policies",
    footerFollow: "Follow us",
    footerContact: "Contact",
    allRightsReserved: "All rights reserved.",
    archive: "Archive",
    trafficStatus: "Traffic",
    sendUsNews: "Send us a tip",
    aboutUs: "About",
    editorialPolicy: "Editorial Policy",
    correctionPolicy: "Correction Policy",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    views: "views",
    moreVideos: "More videos",
    noVideos: "No videos yet.",
    liveNow: "Live now",
    notLive: "Nothing is live right now.",
    playVideo: "Play video",
    searchResultsFor: "Results for “{q}”",
    searchPrompt: "Type a keyword to search the archive.",
    resultsCount: "{n} results",
    inSections: "Sections",
    inAuthors: "Journalists",
    inVideos: "Videos",
    inArticles: "Articles",
    browseArchive: "Browse the archive",
    year: "Year",
    month: "Month",
    allYears: "All years",
    allMonths: "All months",
    previous: "Previous",
    next: "Next",
    page: "Page {n}",
    pageOf: "Page {n} of {total}",
    offline: "You are offline. Showing what was already loaded.",
    backOnline: "Back online.",
    retry: "Retry",
    notifyTitle: "Get breaking news alerts",
    notifyBody: "We will only notify you about breaking news. You can turn this off at any time.",
    notifyAllow: "Turn on",
    notifyDismiss: "Not now",
    notifyBlocked: "Notifications are blocked in your browser settings.",
    aiSummaryNote: "Summarised automatically. The full article is below.",
    imageIllustration: "Illustration",
    advertisement: "Advertisement",
    closeAd: "Close advertisement",
    pagination: "Pagination",
    aiImageNotice: "AI-generated image",
    liveBadge: "LIVE",
    closeViewer: "Close",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    openImage: "Open image",
    trafficIntro: "Reported conditions on main routes. Updated by our newsroom.",
    noTrafficData: "No traffic reports right now.",
    lastUpdated: "Last updated",
    policyOnlyKhmer: "This document is published in Khmer. An English translation is not available yet.",
    topicBreaking: "Breaking news",
    topicCambodia: "Cambodia",
    topicSports: "Sports",
    topicKunKhmer: "Kun Khmer",
    topicBusiness: "Business",
    topicTechnology: "Technology",
    topicEntertainment: "Entertainment",
    notifyPickTopics: "Choose the topics you care about. We do not notify you about every article.",
    notifyHeading: "Get breaking news alerts?",
    notifyEnable: "Turn on notifications",
    notifyNoThanks: "No thanks",
    working: "Working…",
    aiSummaryFootnote: "This summary was generated by AI and checked by an editor. Read the full article for the complete picture.",
    enlargeImage: "Enlarge image — {alt}",
    close: "Close",
    aiImageIllustration: "AI-generated image, for illustration",
    lastTwentyFourHours: "Last 24 hours",
    correctionLabel: "Correction",
    playVideoAria: "Play video — {title}",
    noVideoAttached: "No video has been attached to this item yet.",
    breakingRegion: "Breaking news",
    breakingItemAria: "Breaking news item {n}",
    policyUpdated: "Updated:",
    language: "Language",
    searching: "Searching…",
    searchMinChars: "Please enter at least 2 characters.",
    searchKeyword: "Type a keyword…",
    foundResults: "Found {n} results for “{q}”",
    noArticlesFound: "No articles found.",
    authors: "Journalists",
    archiveTitle: "News archive",
    byMonth: "By month",
    bySection: "By section",
    all: "All",
    noArticlesForSelection: "No articles for this selection.",
    liveUpdating: "Updating live",
    refreshingEachMinute: "Refreshing every minute",
    liveBroadcast: "Live broadcast",
    nothingLiveNow: "Nothing is live right now",
    checkLatestVideos: "Have a look at our latest videos instead.",
    watchVideos: "Watch videos",
    trafficTitle: "Traffic status",
    trafficNormal: "Normal",
    trafficModerate: "Moderate",
    trafficHeavy: "Heavy",
    lastAssessed: "Last assessed:",
    breadcrumb: "Breadcrumb",
    subsections: "Subsections",
    noArticlesInSection: "No articles in this section yet.",
    sponsoredBy: "This content is sponsored by",
    sponsoredDisclaimer: "It is not independent reporting by {site}.",
    quickRead: "Quick read",
    archiveDesc: "Every Cambodia Fast News story, by year and month.",
    homeDesc: "Breaking news from Cambodia and the world — politics, business, sport, Kun Khmer, technology and entertainment.",
    liveVideoDesc: "Live broadcasts from Cambodia Fast News.",
    liveDesc: "Breaking and latest news from Cambodia Fast News, live.",
    searchDesc: "Search articles, videos and journalists at Cambodia Fast News.",
    videoDesc: "The latest news video from Cambodia Fast News.",
    searchNews: "Search news",
    archiveFor: "Archive {month} {year}",
    liveColon: "Live:",
    searchColon: "Search:",
    tipTitle: "Send us a tip",
    tipDesc: "Send news, photos or video to the Cambodia Fast News newsroom.",
    tipIntro: "Every submission is reviewed and verified by an editor first. Nothing is published automatically.",
    tipThanks: "Thank you!",
    tipReceived: "Your tip has reached the newsroom. An editor will review it.",
    tipWhatHappened: "What happened?",
    tipDetailPlaceholder: "Describe what you saw, where, and when…",
    tipLocation: "Location",
    tipLocationPlaceholder: "e.g. Street 271, Phnom Penh",
    tipName: "Name (optional)",
    tipContact: "Contact (optional)",
    tipContactPlaceholder: "Email or phone number",
    tipContactNote: "Contact details are used for verification only and are never published.",
    tipSubmit: "Send tip",
    tipSending: "Sending…",
    tipTooShort: "Please add a little more detail (at least 10 characters).",
    tipFailed: "Could not send. Please try again."
  }
};
function useLocale() {
  const cookie = useCookie("cfn_locale", {
    default: () => "km",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/"
  });
  const locale = computed(() => cookie.value === "en" ? "en" : "km");
  const isEnglish = computed(() => locale.value === "en");
  function setLocale(next) {
    cookie.value = next;
  }
  function t(key, params) {
    let value = messages[locale.value][key] ?? messages.km[key] ?? key;
    if (params) {
      for (const [name, replacement] of Object.entries(params)) {
        value = value.replace(`{${name}}`, String(replacement));
      }
    }
    return value;
  }
  function title(item) {
    return isEnglish.value && item.titleEn ? item.titleEn : item.titleKh;
  }
  function summary(article) {
    if (isEnglish.value) {
      const en = article.summaryEn;
      if (en) return en;
    }
    return article.summaryKh ?? "";
  }
  function body(article) {
    return isEnglish.value && article.contentEn ? article.contentEn : article.contentKh;
  }
  function missingTranslation(article) {
    return isEnglish.value && !article.hasEnglish;
  }
  function categoryName(category) {
    if (!category) return "";
    return isEnglish.value && category.nameEn ? category.nameEn : category.nameKh;
  }
  return {
    locale,
    isEnglish,
    setLocale,
    t,
    title,
    summary,
    body,
    missingTranslation,
    categoryName
  };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TheHeader",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("nav-categories", "/api/categories")), __temp = await __temp, __restore(), __temp);
    const { locale, t, categoryName } = useLocale();
    const mobileOpen = ref(false);
    const searchOpen = ref(false);
    const searchTerm = ref("");
    const route = useRoute();
    watch(() => route.fullPath, () => {
      mobileOpen.value = false;
      searchOpen.value = false;
    });
    watch(mobileOpen, (open) => {
    });
    const navItems = computed(() => [
      { path: "/", label: t("home"), alt: locale.value === "km" ? "Home" : "ទំព័រដើម" },
      ...(categories.value ?? []).map((c) => ({
        path: `/category/${c.slug}`,
        label: categoryName(c),
        alt: locale.value === "km" ? c.nameEn : c.nameKh
      }))
    ]);
    function isActive(path) {
      return path === "/" ? route.path === "/" : route.path.startsWith(path);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_TheLogo = _sfc_main$4;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80" }, _attrs))}><div class="container-content"><div class="flex h-14 items-center justify-between gap-3 lg:h-16"><button class="-ml-2 rounded p-2 text-ink lg:hidden"${ssrRenderAttr("aria-expanded", unref(mobileOpen))} aria-controls="mobile-nav"${ssrRenderAttr("aria-label", unref(t)("menu"))}><svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">`);
      if (!unref(mobileOpen)) {
        _push(`<path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"></path>`);
      } else {
        _push(`<path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"></path>`);
      }
      _push(`</svg></button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex shrink-0 items-center gap-2",
        "aria-label": "Cambodia Fast News"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_TheLogo, { class: "h-8 w-auto lg:h-9" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_TheLogo, { class: "h-8 w-auto lg:h-9" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-1"><button class="rounded p-2 text-ink hover:bg-surface-muted"${ssrRenderAttr("aria-label", unref(t)("search"))}><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5" stroke-linecap="round"></path></svg></button><div class="flex items-center overflow-hidden rounded border border-line text-xs font-semibold" role="group"${ssrRenderAttr("aria-label", unref(t)("language"))}><button type="button" class="${ssrRenderClass(["px-2 py-1 transition-colors", unref(locale) === "km" ? "bg-brand text-white" : "text-ink-muted hover:bg-surface-muted"])}"${ssrRenderAttr("aria-pressed", unref(locale) === "km")}>ខ្មែរ</button><button type="button" class="${ssrRenderClass(["px-2 py-1 transition-colors", unref(locale) === "en" ? "bg-brand text-white" : "text-ink-muted hover:bg-surface-muted"])}"${ssrRenderAttr("aria-pressed", unref(locale) === "en")}>EN</button></div></div></div>`);
      if (unref(searchOpen)) {
        _push(`<div class="pb-3"><form class="flex gap-2"><input${ssrRenderAttr("value", unref(searchTerm))} type="search" name="q"${ssrRenderAttr("placeholder", unref(t)("searchPlaceholder"))} class="w-full rounded-lg border border-line bg-surface-muted px-4 py-2.5 text-kh-base outline-none focus:border-brand" autofocus><button type="submit" class="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">${ssrInterpolate(unref(t)("search"))}</button></form></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<nav class="hidden border-t border-line lg:block"${ssrRenderAttr("aria-label", unref(t)("sections"))}><ul class="flex items-center gap-1 overflow-x-auto py-1"><!--[-->`);
      ssrRenderList(unref(navItems), (item) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.path,
          class: [
            "block whitespace-nowrap rounded px-3 py-2 text-kh-sm font-semibold transition-colors",
            isActive(item.path) ? "bg-brand text-white" : "text-ink hover:bg-surface-muted hover:text-brand"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/video",
        class: "block whitespace-nowrap rounded px-3 py-2 text-kh-sm font-semibold text-ink hover:bg-surface-muted hover:text-brand"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("videoNews"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("videoNews")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></nav></div>`);
      if (unref(mobileOpen)) {
        _push(`<nav id="mobile-nav" class="border-t border-line bg-surface lg:hidden"${ssrRenderAttr("aria-label", unref(t)("sections"))}><ul class="container-content max-h-[70vh] divide-y divide-line overflow-y-auto py-1"><!--[-->`);
        ssrRenderList(unref(navItems), (item) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: item.path,
            class: [
              "flex items-center justify-between py-3 text-kh-base font-semibold",
              isActive(item.path) ? "text-brand" : "text-ink"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.label)} <span class="text-xs font-normal text-ink-muted"${_scopeId}>${ssrInterpolate(item.alt)}</span>`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.label) + " ", 1),
                  createVNode("span", { class: "text-xs font-normal text-ink-muted" }, toDisplayString(item.alt), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--><li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/video",
          class: "flex items-center justify-between py-3 text-kh-base font-semibold text-ink"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("videoNews"))}<span class="text-xs font-normal text-ink-muted"${_scopeId}>${ssrInterpolate(unref(locale) === "km" ? "Video" : "វីដេអូ")}</span>`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("videoNews")), 1),
                createVNode("span", { class: "text-xs font-normal text-ink-muted" }, toDisplayString(unref(locale) === "km" ? "Video" : "វីដេអូ"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/live",
          class: "flex items-center justify-between py-3 text-kh-base font-semibold text-breaking"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("liveBadge"))}<span class="text-xs font-normal text-ink-muted"${_scopeId}>${ssrInterpolate(unref(locale) === "km" ? "Live" : "ផ្ទាល់")}</span>`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("liveBadge")), 1),
                createVNode("span", { class: "text-xs font-normal text-ink-muted" }, toDisplayString(unref(locale) === "km" ? "Live" : "ផ្ទាល់"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li></ul></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TheHeader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TheFooter",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t, locale } = useLocale();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("nav-categories", "/api/categories")), __temp = await __temp, __restore(), __temp);
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("site-info", "/api/site")), __temp = await __temp, __restore(), __temp);
    const { data: pages } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("footer-pages", "/api/pages")), __temp = await __temp, __restore(), __temp);
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const tagline = computed(
      () => locale.value === "en" ? site.value?.taglineEn || site.value?.taglineKh || "" : site.value?.taglineKh || ""
    );
    const address = computed(
      () => locale.value === "en" ? site.value?.addressEn || site.value?.addressKh || "" : site.value?.addressKh || ""
    );
    function categoryName(category) {
      return locale.value === "en" && category.nameEn ? category.nameEn : category.nameKh;
    }
    const moreLinks = computed(() => [
      { path: "/live", label: t("live") },
      { path: "/video", label: t("videoNews") },
      { path: "/archive", label: t("archive") },
      { path: "/traffic", label: t("trafficStatus") },
      { path: "/tip", label: t("sendUsNews") }
    ]);
    const policyLinks = computed(
      () => (pages.value ?? []).map((p) => ({
        path: `/${p.slug}`,
        label: locale.value === "en" && p.titleEn ? p.titleEn : p.titleKh
      }))
    );
    const siteName = computed(
      () => locale.value === "en" ? config.public.siteName : config.public.siteNameKh
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TheLogo = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "mt-12 border-t border-line bg-surface-muted" }, _attrs))}><div class="container-content py-10"><div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"><div class="lg:col-span-1">`);
      _push(ssrRenderComponent(_component_TheLogo, { class: "h-9 w-auto" }, null, _parent));
      if (unref(tagline)) {
        _push(`<p class="mt-3 text-kh-sm text-ink-muted khmer-wrap">${ssrInterpolate(unref(tagline))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(site)?.social?.length) {
        _push(`<ul class="mt-4 flex flex-wrap gap-3"><!--[-->`);
        ssrRenderList(unref(site).social, (link) => {
          _push(`<li><a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener me" class="text-sm font-medium text-brand hover:underline">${ssrInterpolate(link.label)}</a></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(site)?.contactEmail || unref(site)?.contactPhone || unref(address)) {
        _push(`<address class="mt-4 space-y-1 text-xs not-italic text-ink-muted">`);
        if (unref(address)) {
          _push(`<p class="khmer-wrap">${ssrInterpolate(unref(address))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(site)?.contactEmail) {
          _push(`<p><a${ssrRenderAttr("href", `mailto:${unref(site).contactEmail}`)} class="hover:text-brand">${ssrInterpolate(unref(site).contactEmail)}</a></p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(site)?.contactPhone) {
          _push(`<p><a${ssrRenderAttr("href", `tel:${unref(site).contactPhone.replace(/\s/g, "")}`)} class="hover:text-brand">${ssrInterpolate(unref(site).contactPhone)}</a></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</address>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><nav aria-labelledby="footer-sections"><h2 id="footer-sections" class="mb-3 text-kh-sm font-bold uppercase tracking-wide">${ssrInterpolate(unref(t)("sections"))}</h2><ul class="space-y-2"><!--[-->`);
      ssrRenderList((unref(categories) ?? []).slice(0, 7), (c) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category/${c.slug}`,
          class: "text-kh-sm text-ink-muted hover:text-brand"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(categoryName(c))}`);
            } else {
              return [
                createTextVNode(toDisplayString(categoryName(c)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav><nav aria-labelledby="footer-more"><h2 id="footer-more" class="mb-3 text-kh-sm font-bold uppercase tracking-wide">${ssrInterpolate(unref(t)("footerMore"))}</h2><ul class="space-y-2"><!--[-->`);
      ssrRenderList(unref(moreLinks), (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.path,
          class: "text-kh-sm text-ink-muted hover:text-brand"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav>`);
      if (unref(policyLinks).length) {
        _push(`<nav aria-labelledby="footer-policy"><h2 id="footer-policy" class="mb-3 text-kh-sm font-bold uppercase tracking-wide">${ssrInterpolate(unref(t)("footerPolicies"))}</h2><ul class="space-y-2"><!--[-->`);
        ssrRenderList(unref(policyLinks), (link) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.path,
            class: "text-kh-sm text-ink-muted hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between"><p>© ${ssrInterpolate(unref(year))} ${ssrInterpolate(unref(config).public.siteName)}. ${ssrInterpolate(unref(t)("allRightsReserved"))}</p><p class="khmer-wrap">${ssrInterpolate(unref(siteName))}</p></div></div></footer>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TheFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
function resolveCanonical(siteUrl, path, override) {
  const derived = `${siteUrl}${path}`;
  const value = override?.trim();
  if (!value) return derived;
  if (value.startsWith("/")) return `${siteUrl}${value}`;
  if (/^https?:\/\//i.test(value)) {
    try {
      return new URL(value).toString();
    } catch {
      return derived;
    }
  }
  return derived;
}
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 675;
function useSiteSeo(input) {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const { locale } = useLocale();
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  const canonical = resolveCanonical(siteUrl, input.path, input.canonical);
  const image = input.image || `${siteUrl}/og-default.png`;
  const lang = computed(() => input.lang || locale.value);
  useHead({
    htmlAttrs: { lang },
    title: input.title,
    link: [{ rel: "canonical", href: canonical }]
  });
  useSeoMeta({
    title: input.title,
    description: input.description,
    robots: input.robots || "index, follow, max-image-preview:large, max-snippet:-1",
    // Google ignores this, but Bing and several regional crawlers still read it,
    // and it costs one tag.
    keywords: input.keywords?.length ? input.keywords.join(", ") : void 0,
    ogTitle: input.ogTitle || input.title,
    ogDescription: input.ogDescription || input.description,
    ogUrl: canonical,
    ogType: input.type || "website",
    ogImage: image,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
    ogImageAlt: input.imageAlt || input.title,
    ogSiteName: config.public.siteName,
    ogLocale: () => lang.value === "km" ? "km_KH" : "en_US",
    twitterCard: "summary_large_image",
    twitterTitle: input.twitterTitle || input.ogTitle || input.title,
    twitterDescription: input.twitterDescription || input.ogDescription || input.description,
    twitterImage: input.twitterImage || image,
    articlePublishedTime: input.publishedAt || void 0,
    articleModifiedTime: input.modifiedAt || void 0
  });
  return { canonical, siteUrl };
}
function useJsonLd(schema) {
  useHead({
    script: [
      {
        type: "application/ld+json",
        // JSON.stringify escapes the payload; Nuxt does not re-escape script
        // contents, so this is where injection would happen if we interpolated.
        innerHTML: JSON.stringify(schema)
      }
    ]
  });
}
function useOrganizationSchema(socialProfiles = []) {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  const organization = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: config.public.siteName,
    alternateName: config.public.siteNameKh,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 600,
      height: 60
    }
  };
  if (socialProfiles.length > 0) organization.sameAs = socialProfiles;
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.public.siteName,
    url: siteUrl,
    inLanguage: "km",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string"
    }
  };
  useJsonLd([organization, website]);
}
function useArticleSchema(article) {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  const url = `${siteUrl}/news/${article.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.titleKh,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "km",
    publisher: {
      "@type": "NewsMediaOrganization",
      name: config.public.siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png`, width: 600, height: 60 }
    }
  };
  if (article.summaryKh) schema.description = article.summaryKh;
  if (article.publishedAt) schema.datePublished = article.publishedAt;
  schema.dateModified = article.updatedContentAt || article.publishedAt || article.updatedAt;
  if (article.imageUrl) {
    schema.image = [
      {
        "@type": "ImageObject",
        url: article.imageUrl,
        width: article.imageWidth || void 0,
        height: article.imageHeight || void 0
      }
    ];
  }
  if (article.author) {
    schema.author = {
      "@type": "Person",
      name: article.author.nameKh,
      url: `${siteUrl}/author/${article.author.slug}`
    };
  }
  if (article.category) schema.articleSection = article.category.nameEn;
  if (article.wordCount) schema.wordCount = article.wordCount;
  if (article.tags?.length) schema.keywords = article.tags.map((t) => t.nameEn || t.nameKh).join(", ");
  if (article.contentType !== "editorial") {
    schema["@type"] = "Article";
    schema.isAccessibleForFree = true;
    if (article.sponsorName) {
      schema.sponsor = { "@type": "Organization", name: article.sponsorName };
    }
  }
  useJsonLd(schema);
}
function useBreadcrumbSchema(trail) {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`
    }))
  });
}
function useHreflang(path, hasEnglish) {
  if (!hasEnglish) return;
  const config = /* @__PURE__ */ useRuntimeConfig();
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  useHead({
    link: [
      { rel: "alternate", hreflang: "km", href: `${siteUrl}${path}` },
      { rel: "alternate", hreflang: "en", href: `${siteUrl}/en${path}` },
      { rel: "alternate", hreflang: "x-default", href: `${siteUrl}${path}` }
    ]
  });
}
function useCategorySeo(category, page) {
  const title = category.seoTitleKh || `${category.nameKh} | ព័ត៌មានលឿនរហ័សកម្ពុជា`;
  const description = category.seoDescKh || category.descKh || `ព័ត៌មាន${category.nameKh}ថ្មីៗ និងរហ័សបំផុតពី Cambodia Fast News`;
  return useSiteSeo({
    title: page > 1 ? `${title} — ទំព័រ ${page}` : title,
    description,
    path: `/category/${category.slug}`,
    // Paginated pages beyond the first are followed but not indexed, so page 2
    // does not compete with page 1 for the same section.
    robots: page > 1 ? "noindex, follow" : void 0
  });
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const route = useRoute();
    const checking = ref(props.error.statusCode === 404);
    if (props.error.statusCode === 404) {
      const api = useApi();
      try {
        const result = ([__temp, __restore] = withAsyncContext(() => api.get(
          "/api/redirects/resolve",
          { path: route.path }
        )), __temp = await __temp, __restore(), __temp);
        if (result?.redirect) {
          [__temp, __restore] = withAsyncContext(() => navigateTo(result.redirect.toPath, {
            redirectCode: result.redirect.statusCode,
            external: false,
            replace: true
          })), await __temp, __restore();
        }
      } catch {
      } finally {
        checking.value = false;
      }
    }
    const is404 = computed(() => props.error.statusCode === 404);
    const online = ref(true);
    const isOffline = computed(() => !online.value && !is404.value);
    useSiteSeo({
      title: is404.value ? "រកមិនឃើញទំព័រ" : "មានបញ្ហាបច្ចេកទេស",
      description: is404.value ? "ទំព័រដែលអ្នកស្វែងរកមិនមានទេ។" : "សូមអភ័យទោស មានបញ្ហាបច្ចេកទេស។",
      path: route.path,
      // An error page must never be indexed, whatever it is standing in for.
      robots: "noindex, follow"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TheHeader = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_TheFooter = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col bg-surface" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_TheHeader, null, null, _parent));
      _push(`<main class="container-content flex flex-1 flex-col items-center justify-center py-20 text-center">`);
      if (!unref(isOffline)) {
        _push(`<p class="text-6xl font-extrabold text-brand/20">${ssrInterpolate(__props.error.statusCode)}</p>`);
      } else {
        _push(`<p class="text-5xl" aria-hidden="true">📡</p>`);
      }
      _push(`<h1 class="mt-4 text-kh-2xl font-bold">`);
      if (unref(isOffline)) {
        _push(`<!--[-->គ្មានការតភ្ជាប់អ៊ីនធឺណិត<!--]-->`);
      } else if (unref(is404)) {
        _push(`<!--[-->រកមិនឃើញទំព័រនេះទេ<!--]-->`);
      } else {
        _push(`<!--[-->មានបញ្ហាបច្ចេកទេស<!--]-->`);
      }
      _push(`</h1><p class="mt-2 max-w-prose text-kh-base text-ink-muted khmer-wrap">`);
      if (unref(isOffline)) {
        _push(`<!--[--> សូមពិនិត្យការតភ្ជាប់របស់អ្នក រួចព្យាយាមម្តងទៀត។ — You appear to be offline. <!--]-->`);
      } else if (unref(is404)) {
        _push(`<!--[--> ទំព័រដែលអ្នកស្វែងរកអាចត្រូវបានផ្លាស់ប្តូរ ឬលុបចោល។ <!--]-->`);
      } else {
        _push(`<!--[--> សូមព្យាយាមម្តងទៀតក្នុងពេលបន្តិចទៀត។ <!--]-->`);
      }
      _push(`</p><div class="mt-6 flex flex-wrap justify-center gap-3">`);
      if (unref(isOffline)) {
        _push(`<button class="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"> ព្យាយាមម្តងទៀត </button>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ត្រឡប់ទៅទំព័រដើម `);
            } else {
              return [
                createTextVNode(" ត្រឡប់ទៅទំព័រដើម ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/search",
        class: "rounded-lg border border-line px-5 py-2.5 font-semibold hover:bg-surface-muted"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ស្វែងរកព័ត៌មាន `);
          } else {
            return [
              createTextVNode(" ស្វែងរកព័ត៌មាន ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></main>`);
      _push(ssrRenderComponent(_component_TheFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$5), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));
export {
  MONTH_NAMES as M,
  __nuxt_component_0$1 as _,
  useApi as a,
  useSiteSeo as b,
  useAsyncApi as c,
  useOrganizationSchema as d,
  entry_default as default,
  useRuntimeConfig as e,
  useRoute as f,
  useAsyncData as g,
  createError as h,
  useRouter as i,
  useHead as j,
  useSeoMeta as k,
  _sfc_main$4 as l,
  useArticleSchema as m,
  useHreflang as n,
  useBreadcrumbSchema as o,
  pageError as p,
  useJsonLd as q,
  navigateTo as r,
  useCategorySeo as s,
  useCookie as t,
  useLocale as u,
  defineNuxtRouteMiddleware as v,
  _sfc_main$3 as w,
  _sfc_main$2 as x
};
//# sourceMappingURL=server.mjs.map
