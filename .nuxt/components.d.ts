
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


export const AdSlot: typeof import("../components/AdSlot.vue")['default']
export const AdminArticleForm: typeof import("../components/AdminArticleForm.vue")['default']
export const AdminCreativeForm: typeof import("../components/AdminCreativeForm.vue")['default']
export const AdminRichText: typeof import("../components/AdminRichText.vue")['default']
export const AdminStat: typeof import("../components/AdminStat.vue")['default']
export const AdminStatusBadge: typeof import("../components/AdminStatusBadge.vue")['default']
export const AdminVideoForm: typeof import("../components/AdminVideoForm.vue")['default']
export const AiSummary: typeof import("../components/AiSummary.vue")['default']
export const ArticleImageNotice: typeof import("../components/ArticleImageNotice.vue")['default']
export const ArticleShare: typeof import("../components/ArticleShare.vue")['default']
export const ArticleSidebarTrending: typeof import("../components/ArticleSidebarTrending.vue")['default']
export const BreakingBadge: typeof import("../components/BreakingBadge.vue")['default']
export const BreakingNewsBar: typeof import("../components/BreakingNewsBar.vue")['default']
export const CategorySection: typeof import("../components/CategorySection.vue")['default']
export const ConfirmDialog: typeof import("../components/ConfirmDialog.vue")['default']
export const CorrectionNotice: typeof import("../components/CorrectionNotice.vue")['default']
export const FileUpload: typeof import("../components/FileUpload.vue")['default']
export const FiveMinuteNews: typeof import("../components/FiveMinuteNews.vue")['default']
export const ImageField: typeof import("../components/ImageField.vue")['default']
export const ImageViewer: typeof import("../components/ImageViewer.vue")['default']
export const InfiniteFooter: typeof import("../components/InfiniteFooter.vue")['default']
export const MobileStickyAd: typeof import("../components/MobileStickyAd.vue")['default']
export const NewsCard: typeof import("../components/NewsCard.vue")['default']
export const NewsCardMeta: typeof import("../components/NewsCardMeta.vue")['default']
export const NewsPulse: typeof import("../components/NewsPulse.vue")['default']
export const OfflineBanner: typeof import("../components/OfflineBanner.vue")['default']
export const Pagination: typeof import("../components/Pagination.vue")['default']
export const PushNotificationPrompt: typeof import("../components/PushNotificationPrompt.vue")['default']
export const SearchInput: typeof import("../components/SearchInput.vue")['default']
export const SearchableSelect: typeof import("../components/SearchableSelect.vue")['default']
export const SectionHeading: typeof import("../components/SectionHeading.vue")['default']
export const SelectField: typeof import("../components/SelectField.vue")['default']
export const ShareLinks: typeof import("../components/ShareLinks.vue")['default']
export const SmartImage: typeof import("../components/SmartImage.vue")['default']
export const SponsoredBadge: typeof import("../components/SponsoredBadge.vue")['default']
export const TheFooter: typeof import("../components/TheFooter.vue")['default']
export const TheHeader: typeof import("../components/TheHeader.vue")['default']
export const TheLogo: typeof import("../components/TheLogo.vue")['default']
export const TrendingList: typeof import("../components/TrendingList.vue")['default']
export const VideoCard: typeof import("../components/VideoCard.vue")['default']
export const VideoSection: typeof import("../components/VideoSection.vue")['default']
export const YouTubeEmbed: typeof import("../components/YouTubeEmbed.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAdSlot: LazyComponent<typeof import("../components/AdSlot.vue")['default']>
export const LazyAdminArticleForm: LazyComponent<typeof import("../components/AdminArticleForm.vue")['default']>
export const LazyAdminCreativeForm: LazyComponent<typeof import("../components/AdminCreativeForm.vue")['default']>
export const LazyAdminRichText: LazyComponent<typeof import("../components/AdminRichText.vue")['default']>
export const LazyAdminStat: LazyComponent<typeof import("../components/AdminStat.vue")['default']>
export const LazyAdminStatusBadge: LazyComponent<typeof import("../components/AdminStatusBadge.vue")['default']>
export const LazyAdminVideoForm: LazyComponent<typeof import("../components/AdminVideoForm.vue")['default']>
export const LazyAiSummary: LazyComponent<typeof import("../components/AiSummary.vue")['default']>
export const LazyArticleImageNotice: LazyComponent<typeof import("../components/ArticleImageNotice.vue")['default']>
export const LazyArticleShare: LazyComponent<typeof import("../components/ArticleShare.vue")['default']>
export const LazyArticleSidebarTrending: LazyComponent<typeof import("../components/ArticleSidebarTrending.vue")['default']>
export const LazyBreakingBadge: LazyComponent<typeof import("../components/BreakingBadge.vue")['default']>
export const LazyBreakingNewsBar: LazyComponent<typeof import("../components/BreakingNewsBar.vue")['default']>
export const LazyCategorySection: LazyComponent<typeof import("../components/CategorySection.vue")['default']>
export const LazyConfirmDialog: LazyComponent<typeof import("../components/ConfirmDialog.vue")['default']>
export const LazyCorrectionNotice: LazyComponent<typeof import("../components/CorrectionNotice.vue")['default']>
export const LazyFileUpload: LazyComponent<typeof import("../components/FileUpload.vue")['default']>
export const LazyFiveMinuteNews: LazyComponent<typeof import("../components/FiveMinuteNews.vue")['default']>
export const LazyImageField: LazyComponent<typeof import("../components/ImageField.vue")['default']>
export const LazyImageViewer: LazyComponent<typeof import("../components/ImageViewer.vue")['default']>
export const LazyInfiniteFooter: LazyComponent<typeof import("../components/InfiniteFooter.vue")['default']>
export const LazyMobileStickyAd: LazyComponent<typeof import("../components/MobileStickyAd.vue")['default']>
export const LazyNewsCard: LazyComponent<typeof import("../components/NewsCard.vue")['default']>
export const LazyNewsCardMeta: LazyComponent<typeof import("../components/NewsCardMeta.vue")['default']>
export const LazyNewsPulse: LazyComponent<typeof import("../components/NewsPulse.vue")['default']>
export const LazyOfflineBanner: LazyComponent<typeof import("../components/OfflineBanner.vue")['default']>
export const LazyPagination: LazyComponent<typeof import("../components/Pagination.vue")['default']>
export const LazyPushNotificationPrompt: LazyComponent<typeof import("../components/PushNotificationPrompt.vue")['default']>
export const LazySearchInput: LazyComponent<typeof import("../components/SearchInput.vue")['default']>
export const LazySearchableSelect: LazyComponent<typeof import("../components/SearchableSelect.vue")['default']>
export const LazySectionHeading: LazyComponent<typeof import("../components/SectionHeading.vue")['default']>
export const LazySelectField: LazyComponent<typeof import("../components/SelectField.vue")['default']>
export const LazyShareLinks: LazyComponent<typeof import("../components/ShareLinks.vue")['default']>
export const LazySmartImage: LazyComponent<typeof import("../components/SmartImage.vue")['default']>
export const LazySponsoredBadge: LazyComponent<typeof import("../components/SponsoredBadge.vue")['default']>
export const LazyTheFooter: LazyComponent<typeof import("../components/TheFooter.vue")['default']>
export const LazyTheHeader: LazyComponent<typeof import("../components/TheHeader.vue")['default']>
export const LazyTheLogo: LazyComponent<typeof import("../components/TheLogo.vue")['default']>
export const LazyTrendingList: LazyComponent<typeof import("../components/TrendingList.vue")['default']>
export const LazyVideoCard: LazyComponent<typeof import("../components/VideoCard.vue")['default']>
export const LazyVideoSection: LazyComponent<typeof import("../components/VideoSection.vue")['default']>
export const LazyYouTubeEmbed: LazyComponent<typeof import("../components/YouTubeEmbed.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
