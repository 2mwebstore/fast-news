import { _ as _sfc_main$1 } from './SectionHeading-CJAAYZij.mjs';
import { _ as _sfc_main$2 } from './NewsCard-HLdAEa9m.mjs';
import { _ as _sfc_main$3 } from './Pagination-BJJJD7ck.mjs';
import { _ as _sfc_main$4 } from './ArticleSidebarTrending-DEFecVDy.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { f as useRoute, a as useApi, g as useAsyncData, p as pageError, h as createError, b as useSiteSeo, q as useJsonLd, e as useRuntimeConfig } from './server.mjs';
import './SmartImage-D_CQTSWD.mjs';
import './BreakingBadge-BUl44HvT.mjs';
import './useFormat-DT1zbtWM.mjs';
import './TrendingList-BOx8JOT1.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const route = useRoute();
    const config = useRuntimeConfig();
    const api = useApi();
    const slug = computed(() => String(route.params.slug));
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const { data, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `author-${slug.value}-${page.value}`,
      async () => {
        const result = await api.list(
          `/api/authors/${slug.value}`,
          { page: page.value, limit: 20 }
        );
        return { ...result.data, meta: result.meta };
      },
      { watch: [slug, page] }
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) throw pageError(error.value, "Author not found");
    if (!((_a = data.value) == null ? void 0 : _a.author)) {
      throw createError({ statusCode: 404, statusMessage: "Author not found", fatal: true });
    }
    const author = computed(() => data.value.author);
    const articles = computed(() => {
      var _a2;
      return (_a2 = data.value.articles) != null ? _a2 : [];
    });
    const meta = computed(() => data.value.meta);
    useSiteSeo({
      title: `${author.value.nameKh}${author.value.title ? ` \u2014 ${author.value.title}` : ""}`,
      description: author.value.bioKh || `\u17A2\u178F\u17D2\u1790\u1794\u1791\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB\u178A\u17C4\u1799 ${author.value.nameKh} \u1793\u17C5 Cambodia Fast News\u17D4`,
      path: `/author/${author.value.slug}`,
      image: author.value.photoUrl,
      robots: page.value > 1 ? "noindex, follow" : void 0
    });
    const profiles = computed(
      () => [author.value.facebook, author.value.telegram, author.value.x].filter(Boolean)
    );
    useJsonLd({
      "@context": "https://schema.org",
      "@type": "Person",
      name: author.value.nameKh,
      alternateName: author.value.nameEn || void 0,
      jobTitle: author.value.title || void 0,
      description: author.value.bioKh || void 0,
      image: author.value.photoUrl || void 0,
      url: `${config.public.siteUrl}/author/${author.value.slug}`,
      ...profiles.value.length ? { sameAs: profiles.value } : {},
      worksFor: { "@type": "NewsMediaOrganization", name: config.public.siteName }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionHeading = _sfc_main$1;
      const _component_NewsCard = _sfc_main$2;
      const _component_Pagination = _sfc_main$3;
      const _component_ArticleSidebarTrending = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}><header class="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start">`);
      if (unref(author).photoUrl) {
        _push(`<img${ssrRenderAttr("src", unref(author).photoUrl)}${ssrRenderAttr("alt", unref(author).nameKh)} width="96" height="96" class="h-24 w-24 shrink-0 rounded-full object-cover">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><h1 class="text-kh-2xl font-bold">${ssrInterpolate(unref(author).nameKh)}</h1>`);
      if (unref(author).title) {
        _push(`<p class="mt-1 text-kh-base text-brand">${ssrInterpolate(unref(author).title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(author).bioKh) {
        _push(`<p class="mt-2 max-w-prose text-kh-base text-ink-muted khmer-wrap">${ssrInterpolate(unref(author).bioKh)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-2 text-sm text-ink-muted">\u17A2\u178F\u17D2\u1790\u1794\u1791 ${ssrInterpolate(unref(author).articleCount)}</p>`);
      if (unref(profiles).length) {
        _push(`<ul class="mt-3 flex gap-3"><!--[-->`);
        ssrRenderList(unref(profiles), (profile) => {
          _push(`<li><a${ssrRenderAttr("href", profile)} target="_blank" rel="noopener me" class="text-sm font-medium text-brand hover:underline">${ssrInterpolate(profile.replace(/^https?:\/\/(www\.)?/, "").split("/")[0])}</a></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><div class="mt-6 grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2">`);
      _push(ssrRenderComponent(_component_SectionHeading, { title: "\u17A2\u178F\u17D2\u1790\u1794\u1791\u1785\u17BB\u1784\u1780\u17D2\u179A\u17C4\u1799" }, null, _parent));
      _push(`<ul class="divide-y divide-line"><!--[-->`);
      ssrRenderList(unref(articles), (article) => {
        _push(`<li class="py-4 first:pt-0">`);
        _push(ssrRenderComponent(_component_NewsCard, {
          article,
          variant: "list",
          "show-time": ""
        }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
      if (unref(meta)) {
        _push(ssrRenderComponent(_component_Pagination, {
          meta: unref(meta),
          "base-path": `/author/${unref(slug)}`
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><aside class="space-y-8">`);
      _push(ssrRenderComponent(_component_ArticleSidebarTrending, null, null, _parent));
      _push(`</aside></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/author/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CPSYILJD.mjs.map
