
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AdSlot: typeof import("../../components/AdSlot.vue")['default']
  AdminArticleForm: typeof import("../../components/AdminArticleForm.vue")['default']
  AdminCreativeForm: typeof import("../../components/AdminCreativeForm.vue")['default']
  AdminRichText: typeof import("../../components/AdminRichText.vue")['default']
  AdminStat: typeof import("../../components/AdminStat.vue")['default']
  AdminStatusBadge: typeof import("../../components/AdminStatusBadge.vue")['default']
  AdminVideoForm: typeof import("../../components/AdminVideoForm.vue")['default']
  AiSummary: typeof import("../../components/AiSummary.vue")['default']
  ArticleImageNotice: typeof import("../../components/ArticleImageNotice.vue")['default']
  ArticleShare: typeof import("../../components/ArticleShare.vue")['default']
  ArticleSidebarTrending: typeof import("../../components/ArticleSidebarTrending.vue")['default']
  BreakingBadge: typeof import("../../components/BreakingBadge.vue")['default']
  BreakingNewsBar: typeof import("../../components/BreakingNewsBar.vue")['default']
  CategorySection: typeof import("../../components/CategorySection.vue")['default']
  ConfirmDialog: typeof import("../../components/ConfirmDialog.vue")['default']
  CorrectionNotice: typeof import("../../components/CorrectionNotice.vue")['default']
  FileUpload: typeof import("../../components/FileUpload.vue")['default']
  FiveMinuteNews: typeof import("../../components/FiveMinuteNews.vue")['default']
  ImageField: typeof import("../../components/ImageField.vue")['default']
  ImageViewer: typeof import("../../components/ImageViewer.vue")['default']
  InfiniteFooter: typeof import("../../components/InfiniteFooter.vue")['default']
  MobileStickyAd: typeof import("../../components/MobileStickyAd.vue")['default']
  NewsCard: typeof import("../../components/NewsCard.vue")['default']
  NewsCardMeta: typeof import("../../components/NewsCardMeta.vue")['default']
  NewsPulse: typeof import("../../components/NewsPulse.vue")['default']
  OfflineBanner: typeof import("../../components/OfflineBanner.vue")['default']
  Pagination: typeof import("../../components/Pagination.vue")['default']
  PushNotificationPrompt: typeof import("../../components/PushNotificationPrompt.vue")['default']
  SearchInput: typeof import("../../components/SearchInput.vue")['default']
  SearchableSelect: typeof import("../../components/SearchableSelect.vue")['default']
  SectionHeading: typeof import("../../components/SectionHeading.vue")['default']
  SelectField: typeof import("../../components/SelectField.vue")['default']
  ShareLinks: typeof import("../../components/ShareLinks.vue")['default']
  SmartImage: typeof import("../../components/SmartImage.vue")['default']
  SponsoredBadge: typeof import("../../components/SponsoredBadge.vue")['default']
  TheFooter: typeof import("../../components/TheFooter.vue")['default']
  TheHeader: typeof import("../../components/TheHeader.vue")['default']
  TheLogo: typeof import("../../components/TheLogo.vue")['default']
  TrendingList: typeof import("../../components/TrendingList.vue")['default']
  VideoCard: typeof import("../../components/VideoCard.vue")['default']
  VideoSection: typeof import("../../components/VideoSection.vue")['default']
  YouTubeEmbed: typeof import("../../components/YouTubeEmbed.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAdSlot: LazyComponent<typeof import("../../components/AdSlot.vue")['default']>
  LazyAdminArticleForm: LazyComponent<typeof import("../../components/AdminArticleForm.vue")['default']>
  LazyAdminCreativeForm: LazyComponent<typeof import("../../components/AdminCreativeForm.vue")['default']>
  LazyAdminRichText: LazyComponent<typeof import("../../components/AdminRichText.vue")['default']>
  LazyAdminStat: LazyComponent<typeof import("../../components/AdminStat.vue")['default']>
  LazyAdminStatusBadge: LazyComponent<typeof import("../../components/AdminStatusBadge.vue")['default']>
  LazyAdminVideoForm: LazyComponent<typeof import("../../components/AdminVideoForm.vue")['default']>
  LazyAiSummary: LazyComponent<typeof import("../../components/AiSummary.vue")['default']>
  LazyArticleImageNotice: LazyComponent<typeof import("../../components/ArticleImageNotice.vue")['default']>
  LazyArticleShare: LazyComponent<typeof import("../../components/ArticleShare.vue")['default']>
  LazyArticleSidebarTrending: LazyComponent<typeof import("../../components/ArticleSidebarTrending.vue")['default']>
  LazyBreakingBadge: LazyComponent<typeof import("../../components/BreakingBadge.vue")['default']>
  LazyBreakingNewsBar: LazyComponent<typeof import("../../components/BreakingNewsBar.vue")['default']>
  LazyCategorySection: LazyComponent<typeof import("../../components/CategorySection.vue")['default']>
  LazyConfirmDialog: LazyComponent<typeof import("../../components/ConfirmDialog.vue")['default']>
  LazyCorrectionNotice: LazyComponent<typeof import("../../components/CorrectionNotice.vue")['default']>
  LazyFileUpload: LazyComponent<typeof import("../../components/FileUpload.vue")['default']>
  LazyFiveMinuteNews: LazyComponent<typeof import("../../components/FiveMinuteNews.vue")['default']>
  LazyImageField: LazyComponent<typeof import("../../components/ImageField.vue")['default']>
  LazyImageViewer: LazyComponent<typeof import("../../components/ImageViewer.vue")['default']>
  LazyInfiniteFooter: LazyComponent<typeof import("../../components/InfiniteFooter.vue")['default']>
  LazyMobileStickyAd: LazyComponent<typeof import("../../components/MobileStickyAd.vue")['default']>
  LazyNewsCard: LazyComponent<typeof import("../../components/NewsCard.vue")['default']>
  LazyNewsCardMeta: LazyComponent<typeof import("../../components/NewsCardMeta.vue")['default']>
  LazyNewsPulse: LazyComponent<typeof import("../../components/NewsPulse.vue")['default']>
  LazyOfflineBanner: LazyComponent<typeof import("../../components/OfflineBanner.vue")['default']>
  LazyPagination: LazyComponent<typeof import("../../components/Pagination.vue")['default']>
  LazyPushNotificationPrompt: LazyComponent<typeof import("../../components/PushNotificationPrompt.vue")['default']>
  LazySearchInput: LazyComponent<typeof import("../../components/SearchInput.vue")['default']>
  LazySearchableSelect: LazyComponent<typeof import("../../components/SearchableSelect.vue")['default']>
  LazySectionHeading: LazyComponent<typeof import("../../components/SectionHeading.vue")['default']>
  LazySelectField: LazyComponent<typeof import("../../components/SelectField.vue")['default']>
  LazyShareLinks: LazyComponent<typeof import("../../components/ShareLinks.vue")['default']>
  LazySmartImage: LazyComponent<typeof import("../../components/SmartImage.vue")['default']>
  LazySponsoredBadge: LazyComponent<typeof import("../../components/SponsoredBadge.vue")['default']>
  LazyTheFooter: LazyComponent<typeof import("../../components/TheFooter.vue")['default']>
  LazyTheHeader: LazyComponent<typeof import("../../components/TheHeader.vue")['default']>
  LazyTheLogo: LazyComponent<typeof import("../../components/TheLogo.vue")['default']>
  LazyTrendingList: LazyComponent<typeof import("../../components/TrendingList.vue")['default']>
  LazyVideoCard: LazyComponent<typeof import("../../components/VideoCard.vue")['default']>
  LazyVideoSection: LazyComponent<typeof import("../../components/VideoSection.vue")['default']>
  LazyYouTubeEmbed: LazyComponent<typeof import("../../components/YouTubeEmbed.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
