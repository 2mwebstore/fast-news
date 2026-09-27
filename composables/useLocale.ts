import type { ArticleCard, ArticleDetail, CategoryRef } from '~/types'

export type Locale = 'km' | 'en'

/**
 * Month names per language. Not in `messages` because callers want the whole
 * array to build a picker, not twelve separate keys.
 */
export const MONTH_NAMES: Record<Locale, string[]> = {
  km: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
       'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'],
  en: ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'],
}

/**
 * UI strings for the site chrome.
 *
 * Article text is not translated here — it comes from the database, where an
 * English version exists only if a journalist wrote one. Chrome that has no
 * translation would be worse than none, so every key carries both languages.
 */
const messages = {
  km: {
    home: 'ទំព័រដើម',
    latestNews: 'ព័ត៌មានថ្មីៗ',
    breaking: 'បន្ទាន់',
    live: 'ព័ត៌មានផ្ទាល់',
    trending: 'កំពុងពេញនិយម',
    fiveMinute: 'ព័ត៌មាន ៥ នាទី',
    newsPulse: 'ចលនាព័ត៌មាន',
    videoNews: 'វីដេអូព័ត៌មាន',
    relatedNews: 'ព័ត៌មានពាក់ព័ន្ធ',
    search: 'ស្វែងរក',
    searchPlaceholder: 'ស្វែងរកព័ត៌មាន...',
    viewAll: 'មើលទាំងអស់',
    loadMore: 'មើលព័ត៌មានបន្ថែម',
    loading: 'កំពុងផ្ទុក...',
    noResults: 'រកមិនឃើញលទ្ធផលទេ។',
    endOfList: 'អ្នកបានមើលដល់ចុងបញ្ចប់ហើយ',
    readMinutes: 'អាន {n} នាទី',
    published: 'ផ្សាយ',
    updated: 'កែសម្រួល',
    share: 'ចែករំលែក',
    menu: 'ម៉ឺនុយ',
    sections: 'ផ្នែកព័ត៌មាន',
    skipToContent: 'រំលងទៅមាតិកាចម្បង',
    sponsored: 'ខ្លឹមសារឧបត្ថម្ភ',
    aiSummary: 'សង្ខេបព័ត៌មាន',
    correction: 'កែតម្រូវ',
    // Shown when a reader picks English on a story that has none.
    noTranslation: 'អត្ថបទនេះមានជាភាសាខ្មែរប៉ុណ្ណោះ។',

    shareLabel: 'ចែករំលែក៖',
    shareVia: 'ចែករំលែកតាម {network}',
    copyLink: 'ចម្លងតំណ',
    copied: 'បានចម្លង',
    linkCopied: 'បានចម្លងតំណ',
    footerMore: 'ព័ត៌មានបន្ថែម',
    footerPolicies: 'គោលការណ៍',
    footerFollow: 'តាមដានយើង',
    footerContact: 'ទំនាក់ទំនង',
    allRightsReserved: 'រក្សាសិទ្ធិគ្រប់យ៉ាង។',
    archive: 'បណ្ណសារ',
    trafficStatus: 'ស្ថានភាពចរាចរណ៍',
    sendUsNews: 'ផ្ញើព័ត៌មានមកយើង',
    aboutUs: 'អំពីយើង',
    editorialPolicy: 'គោលការណ៍វិចារណកថា',
    correctionPolicy: 'គោលការណ៍កែតម្រូវ',
    privacyPolicy: 'គោលការណ៍ឯកជនភាព',
    termsOfUse: 'លក្ខខណ្ឌប្រើប្រាស់',
    views: 'ទស្សនា',
    moreVideos: 'វីដេអូផ្សេងទៀត',
    noVideos: 'មិនទាន់មានវីដេអូទេ។',
    liveNow: 'ផ្សាយផ្ទាល់ឥឡូវ',
    notLive: 'មិនមានការផ្សាយផ្ទាល់ទេ។',
    playVideo: 'លេងវីដេអូ',
    searchResultsFor: 'លទ្ធផលសម្រាប់ “{q}”',
    searchPrompt: 'បញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក។',
    resultsCount: 'លទ្ធផល {n}',
    inSections: 'ផ្នែក',
    inAuthors: 'អ្នកសារព័ត៌មាន',
    inVideos: 'វីដេអូ',
    inArticles: 'អត្ថបទ',
    browseArchive: 'រុករកបណ្ណសារ',
    year: 'ឆ្នាំ',
    month: 'ខែ',
    allYears: 'គ្រប់ឆ្នាំ',
    allMonths: 'គ្រប់ខែ',
    previous: 'មុន',
    next: 'បន្ទាប់',
    page: 'ទំព័រ {n}',
    pageOf: 'ទំព័រ {n} ក្នុងចំណោម {total}',
    offline: 'អ្នកកំពុងគ្មានអ៊ីនធឺណិត។ កំពុងបង្ហាញអ្វីដែលបានផ្ទុករួច។',
    backOnline: 'មានអ៊ីនធឺណិតវិញហើយ។',
    retry: 'ព្យាយាមម្តងទៀត',
    notifyTitle: 'ទទួលការជូនដំណឹងព័ត៌មានបន្ទាន់',
    notifyBody: 'យើងនឹងជូនដំណឹងតែព័ត៌មានបន្ទាន់។ អ្នកអាចបិទបានពេលណាក៏បាន។',
    notifyAllow: 'បើក',
    notifyDismiss: 'មិនឥឡូវទេ',
    notifyBlocked: 'ការជូនដំណឹងត្រូវបានបិទក្នុងការកំណត់កម្មវិធីរុករក។',
    aiSummaryNote: 'សង្ខេបដោយស្វ័យប្រវត្តិ។ អត្ថបទពេញលេញនៅខាងក្រោម។',
    imageIllustration: 'រូបភាពឧទាហរណ៍',
    advertisement: 'ពាណិជ្ជកម្ម',
    closeAd: 'បិទការផ្សាយពាណិជ្ជកម្ម',
    pagination: 'ទំព័រ',
    aiImageNotice: 'រូបភាពបង្កើតដោយ AI',
    liveBadge: 'ផ្ទាល់',
    closeViewer: 'បិទ',
    zoomIn: 'ពង្រីក',
    zoomOut: 'បង្រួម',
    openImage: 'បើករូបភាព',
    trafficIntro: 'ស្ថានភាពផ្លូវធំៗ។ ធ្វើបច្ចុប្បន្នភាពដោយបន្ទប់ព័ត៌មានរបស់យើង។',
    noTrafficData: 'មិនមានរបាយការណ៍ចរាចរណ៍ទេ។',
    lastUpdated: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ',
    policyOnlyKhmer: 'ឯកសារនេះផ្សាយជាភាសាខ្មែរ។ មិនទាន់មានការបកប្រែជាភាសាអង់គ្លេសទេ។',
    topicBreaking: 'ព័ត៌មានបន្ទាន់',
    topicCambodia: 'កម្ពុជា',
    topicSports: 'កីឡា',
    topicKunKhmer: 'គុនខ្មែរ',
    topicBusiness: 'សេដ្ឋកិច្ច',
    topicTechnology: 'បច្ចេកវិទ្យា',
    topicEntertainment: 'កម្សាន្ត',
    notifyPickTopics: 'ជ្រើសរើសប្រធានបទដែលអ្នកចាប់អារម្មណ៍។ យើងមិនផ្ញើការជូនដំណឹងសម្រាប់អត្ថបទគ្រប់ៗទេ។',
    notifyHeading: 'ទទួលការជូនដំណឹងព័ត៌មានបន្ទាន់?',
    notifyEnable: 'បើកការជូនដំណឹង',
    notifyNoThanks: 'មិនអីទេ',
    working: 'កំពុងដំណើរការ...',
    aiSummaryFootnote: 'សង្ខេបនេះបង្កើតដោយ AI ហើយពិនិត្យដោយអ្នកកែសម្រួល។ សូមអានអត្ថបទពេញលេញសម្រាប់ព័ត៌មានទាំងស្រុង។',
    enlargeImage: 'ពង្រីករូបភាព — {alt}',
    close: 'បិទ',
    aiImageIllustration: 'រូបភាពបង្កើតដោយ AI សម្រាប់ជាឧទាហរណ៍',
    lastTwentyFourHours: '២៤ ម៉ោងចុងក្រោយ',
    correctionLabel: 'កែតម្រូវ',
    playVideoAria: 'ចាក់វីដេអូ — {title}',
    noVideoAttached: 'មិនទាន់មានវីដេអូភ្ជាប់ទេ។',
    breakingRegion: 'ព័ត៌មានបន្ទាន់',
    breakingItemAria: 'ព័ត៌មានបន្ទាន់ទី {n}',
    policyUpdated: 'ធ្វើបច្ចុប្បន្នភាព៖',
    language: 'ភាសា',
    searching: 'កំពុងស្វែងរក...',
    searchMinChars: 'សូមវាយបញ្ចូលពាក្យគន្លឹះយ៉ាងតិច ២ តួអក្សរ។',
    foundResults: 'រកឃើញ {n} លទ្ធផលសម្រាប់ “{q}”',
    noArticlesFound: 'រកមិនឃើញអត្ថបទទេ។',
    authors: 'អ្នកសរសេរ',
    archiveTitle: 'បណ្ណសារព័ត៌មាន',
    byMonth: 'តាមខែ',
    bySection: 'តាមផ្នែក',
    wholeYear: 'ពេញឆ្នាំ {year}',
    allDates: 'គ្រប់ពេល',
    allSections: 'គ្រប់ផ្នែក',
    clearFilters: 'សម្អាត',
    all: 'ទាំងអស់',
    noArticlesForSelection: 'មិនមានអត្ថបទសម្រាប់ជម្រើសនេះទេ។',
    liveUpdating: 'កំពុងធ្វើបច្ចុប្បន្នភាពផ្ទាល់',
    refreshingEachMinute: 'ធ្វើបច្ចុប្បន្នភាពរៀងរាល់នាទី',
    liveBroadcast: 'ផ្សាយផ្ទាល់',
    nothingLiveNow: 'មិនមានការផ្សាយផ្ទាល់ទេឥឡូវនេះ',
    checkLatestVideos: 'សូមពិនិត្យមើលវីដេអូព័ត៌មានចុងក្រោយរបស់យើង។',
    watchVideos: 'មើលវីដេអូ',
    trafficTitle: 'ស្ថានភាពចរាចរណ៍',
    trafficNormal: 'ធម្មតា',
    trafficModerate: 'មធ្យម',
    trafficHeavy: 'កកស្ទះ',
    lastAssessed: 'វាយតម្លៃចុងក្រោយ៖',
    breadcrumb: 'ផ្លូវរុករក',
    subsections: 'ផ្នែករង',
    noArticlesInSection: 'មិនទាន់មានព័ត៌មានក្នុងផ្នែកនេះទេ។',
    sponsoredBy: 'ខ្លឹមសារនេះត្រូវបានឧបត្ថម្ភដោយ',
    sponsoredDisclaimer: 'វាមិនមែនជាការរាយការណ៍ព័ត៌មានឯករាជ្យរបស់ {site} ទេ។',
    quickRead: 'អានឆាប់រហ័ស',
    archiveDesc: 'បណ្ណសារព័ត៌មានទាំងអស់របស់ {site} តាមឆ្នាំ និងខែ។',
    homeDesc: 'ព័ត៌មានទាន់ហេតុការណ៍ពីកម្ពុជា និងពិភពលោក — នយោបាយ សេដ្ឋកិច្ច កីឡា គុនខ្មែរ បច្ចេកវិទ្យា និងកម្សាន្ត។',
    liveVideoDesc: 'ការផ្សាយផ្ទាល់ពី {site}។',
    liveDesc: 'ព័ត៌មានបន្ទាន់ និងថ្មីបំផុតពី {site} ផ្សាយផ្ទាល់។',
    searchDesc: 'ស្វែងរកព័ត៌មាន វីដេអូ និងអ្នកសរសេរនៅ {site}។',
    videoDesc: 'វីដេអូព័ត៌មានថ្មីៗពី {site}។',
    searchNews: 'ស្វែងរកព័ត៌មាន',
    archiveFor: 'បណ្ណសារ {month} {year}',
    liveColon: 'ផ្សាយផ្ទាល់៖',
    searchColon: 'ស្វែងរក៖',
    tipTitle: 'ផ្ញើព័ត៌មានមកយើង',
    tipDesc: 'ផ្ញើព័ត៌មាន រូបភាព ឬវីដេអូមកកាន់បន្ទប់ព័ត៌មាន {site}។',
    tipIntro: 'រាល់ព័ត៌មានដែលផ្ញើមកនឹងត្រូវបានពិនិត្យ និងផ្ទៀងផ្ទាត់ដោយអ្នកកែសម្រួលជាមុនសិន។ គ្មានអ្វីត្រូវបានផ្សាយដោយស្វ័យប្រវត្តិទេ។',
    tipThanks: 'សូមអរគុណ!',
    tipReceived: 'ព័ត៌មានរបស់អ្នកបានមកដល់បន្ទប់ព័ត៌មានហើយ។ អ្នកកែសម្រួលនឹងពិនិត្យវា។',
    tipWhatHappened: 'តើមានអ្វីកើតឡើង?',
    tipDetailPlaceholder: 'ពណ៌នាអំពីអ្វីដែលអ្នកបានឃើញ កន្លែង និងពេលវេលា...',
    tipLocation: 'ទីកន្លែង',
    tipLocationPlaceholder: 'ឧ. ផ្លូវ ២៧១ ភ្នំពេញ',
    tipName: 'ឈ្មោះ (ស្រេចចិត្ត)',
    tipContact: 'ទំនាក់ទំនង (ស្រេចចិត្ត)',
    tipContactPlaceholder: 'អ៊ីមែល ឬលេខទូរស័ព្ទ',
    tipContactNote: 'ព័ត៌មានទំនាក់ទំនងត្រូវប្រើសម្រាប់ផ្ទៀងផ្ទាត់តែប៉ុណ្ណោះ ហើយមិនត្រូវបានផ្សាយទេ។',
    tipSubmit: 'ផ្ញើព័ត៌មាន',
    tipSending: 'កំពុងផ្ញើ...',
    tipTooShort: 'សូមពណ៌នាឱ្យបានលម្អិតបន្តិច (យ៉ាងតិច ១០ តួអក្សរ)។',
    tipFailed: 'មិនអាចផ្ញើបានទេ។ សូមព្យាយាមម្តងទៀត។',
  },
  en: {
    home: 'Home',
    latestNews: 'Latest news',
    breaking: 'Breaking',
    live: 'Live',
    trending: 'Trending',
    fiveMinute: '5-minute news',
    newsPulse: 'News pulse',
    videoNews: 'Video news',
    relatedNews: 'Related news',
    search: 'Search',
    searchPlaceholder: 'Search news...',
    viewAll: 'View all',
    loadMore: 'Load more',
    loading: 'Loading...',
    noResults: 'No results found.',
    endOfList: "You've reached the end",
    readMinutes: '{n} min read',
    published: 'Published',
    updated: 'Updated',
    share: 'Share',
    menu: 'Menu',
    sections: 'News sections',
    skipToContent: 'Skip to main content',
    sponsored: 'Sponsored',
    aiSummary: 'Summary',
    correction: 'Correction',
    noTranslation: 'This article is available in Khmer only.',

    shareLabel: 'Share:',
    shareVia: 'Share on {network}',
    copyLink: 'Copy link',
    copied: 'Copied',
    linkCopied: 'Link copied',
    footerMore: 'More',
    footerPolicies: 'Policies',
    footerFollow: 'Follow us',
    footerContact: 'Contact',
    allRightsReserved: 'All rights reserved.',
    archive: 'Archive',
    trafficStatus: 'Traffic',
    sendUsNews: 'Send us a tip',
    aboutUs: 'About',
    editorialPolicy: 'Editorial Policy',
    correctionPolicy: 'Correction Policy',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    views: 'views',
    moreVideos: 'More videos',
    noVideos: 'No videos yet.',
    liveNow: 'Live now',
    notLive: 'Nothing is live right now.',
    playVideo: 'Play video',
    searchResultsFor: 'Results for “{q}”',
    searchPrompt: 'Type a keyword to search the archive.',
    resultsCount: '{n} results',
    inSections: 'Sections',
    inAuthors: 'Journalists',
    inVideos: 'Videos',
    inArticles: 'Articles',
    browseArchive: 'Browse the archive',
    year: 'Year',
    month: 'Month',
    allYears: 'All years',
    allMonths: 'All months',
    previous: 'Previous',
    next: 'Next',
    page: 'Page {n}',
    pageOf: 'Page {n} of {total}',
    offline: 'You are offline. Showing what was already loaded.',
    backOnline: 'Back online.',
    retry: 'Retry',
    notifyTitle: 'Get breaking news alerts',
    notifyBody: 'We will only notify you about breaking news. You can turn this off at any time.',
    notifyAllow: 'Turn on',
    notifyDismiss: 'Not now',
    notifyBlocked: 'Notifications are blocked in your browser settings.',
    aiSummaryNote: 'Summarised automatically. The full article is below.',
    imageIllustration: 'Illustration',
    advertisement: 'Advertisement',
    closeAd: 'Close advertisement',
    pagination: 'Pagination',
    aiImageNotice: 'AI-generated image',
    liveBadge: 'LIVE',
    closeViewer: 'Close',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    openImage: 'Open image',
    trafficIntro: 'Reported conditions on main routes. Updated by our newsroom.',
    noTrafficData: 'No traffic reports right now.',
    lastUpdated: 'Last updated',
    policyOnlyKhmer: 'This document is published in Khmer. An English translation is not available yet.',
    topicBreaking: 'Breaking news',
    topicCambodia: 'Cambodia',
    topicSports: 'Sports',
    topicKunKhmer: 'Kun Khmer',
    topicBusiness: 'Business',
    topicTechnology: 'Technology',
    topicEntertainment: 'Entertainment',
    notifyPickTopics: 'Choose the topics you care about. We do not notify you about every article.',
    notifyHeading: 'Get breaking news alerts?',
    notifyEnable: 'Turn on notifications',
    notifyNoThanks: 'No thanks',
    working: 'Working…',
    aiSummaryFootnote: 'This summary was generated by AI and checked by an editor. Read the full article for the complete picture.',
    enlargeImage: 'Enlarge image — {alt}',
    close: 'Close',
    aiImageIllustration: 'AI-generated image, for illustration',
    lastTwentyFourHours: 'Last 24 hours',
    correctionLabel: 'Correction',
    playVideoAria: 'Play video — {title}',
    noVideoAttached: 'No video has been attached to this item yet.',
    breakingRegion: 'Breaking news',
    breakingItemAria: 'Breaking news item {n}',
    policyUpdated: 'Updated:',
    language: 'Language',
    searching: 'Searching…',
    searchMinChars: 'Please enter at least 2 characters.',
    foundResults: 'Found {n} results for “{q}”',
    noArticlesFound: 'No articles found.',
    authors: 'Journalists',
    archiveTitle: 'News archive',
    byMonth: 'By month',
    bySection: 'By section',
    wholeYear: 'All of {year}',
    allDates: 'All dates',
    allSections: 'All sections',
    clearFilters: 'Clear',
    all: 'All',
    noArticlesForSelection: 'No articles for this selection.',
    liveUpdating: 'Updating live',
    refreshingEachMinute: 'Refreshing every minute',
    liveBroadcast: 'Live broadcast',
    nothingLiveNow: 'Nothing is live right now',
    checkLatestVideos: 'Have a look at our latest videos instead.',
    watchVideos: 'Watch videos',
    trafficTitle: 'Traffic status',
    trafficNormal: 'Normal',
    trafficModerate: 'Moderate',
    trafficHeavy: 'Heavy',
    lastAssessed: 'Last assessed:',
    breadcrumb: 'Breadcrumb',
    subsections: 'Subsections',
    noArticlesInSection: 'No articles in this section yet.',
    sponsoredBy: 'This content is sponsored by',
    sponsoredDisclaimer: 'It is not independent reporting by {site}.',
    quickRead: 'Quick read',
    archiveDesc: 'Every {site} story, by year and month.',
    homeDesc: 'Breaking news from Cambodia and the world — politics, business, sport, Kun Khmer, technology and entertainment.',
    liveVideoDesc: 'Live broadcasts from {site}.',
    liveDesc: 'Breaking and latest news from {site}, live.',
    searchDesc: 'Search articles, videos and journalists at {site}.',
    videoDesc: 'The latest news video from {site}.',
    searchNews: 'Search news',
    archiveFor: 'Archive {month} {year}',
    liveColon: 'Live:',
    searchColon: 'Search:',
    tipTitle: 'Send us a tip',
    tipDesc: 'Send news, photos or video to the {site} newsroom.',
    tipIntro: 'Every submission is reviewed and verified by an editor first. Nothing is published automatically.',
    tipThanks: 'Thank you!',
    tipReceived: 'Your tip has reached the newsroom. An editor will review it.',
    tipWhatHappened: 'What happened?',
    tipDetailPlaceholder: 'Describe what you saw, where, and when…',
    tipLocation: 'Location',
    tipLocationPlaceholder: 'e.g. Street 271, Phnom Penh',
    tipName: 'Name (optional)',
    tipContact: 'Contact (optional)',
    tipContactPlaceholder: 'Email or phone number',
    tipContactNote: 'Contact details are used for verification only and are never published.',
    tipSubmit: 'Send tip',
    tipSending: 'Sending…',
    tipTooShort: 'Please add a little more detail (at least 10 characters).',
    tipFailed: 'Could not send. Please try again.',
  },
} as const

export type MessageKey = keyof typeof messages.km

/**
 * Reading language.
 *
 * Stored in a cookie rather than component state so the server renders in the
 * reader's language on the first response — a client-side switch would flash
 * Khmer before swapping, and would leave `<html lang>` wrong for crawlers.
 */
export function useLocale() {
  const cookie = useCookie<Locale>('cfn_locale', {
    default: () => 'km',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  const locale = computed<Locale>(() => (cookie.value === 'en' ? 'en' : 'km'))
  const isEnglish = computed(() => locale.value === 'en')

  function setLocale(next: Locale) {
    // No reload needed. `locale` is reactive, so every t() call and every
    // title()/summary() pick re-evaluates immediately, and useHead updates
    // `<html lang>` and the meta tags with it. Both languages are already in
    // the payload, so there is nothing to refetch — a reload here would just
    // cost the reader a blank screen.
    cookie.value = next
  }

  // Read directly rather than through useSite(), which itself uses this
  // composable. plugins/site.ts fills it.
  const siteInfo = useState<{ nameEn?: string } | null>('site-info', () => null)
  const config = useRuntimeConfig()

  /**
   * Looks up a chrome string, with `{n}` interpolation. `{site}` is always
   * available: it is the site name from Admin → Settings, so renaming the site
   * reaches every description without editing this file.
   */
  function t(key: MessageKey, params?: Record<string, string | number>): string {
    let value: string = messages[locale.value][key] ?? messages.km[key] ?? key
    const all = { site: siteInfo.value?.nameEn || config.public.siteName, ...params }
    for (const [name, replacement] of Object.entries(all)) {
      value = value.replace(`{${name}}`, String(replacement))
    }
    return value
  }

  /**
   * Article text in the reading language, falling back to Khmer.
   *
   * Khmer is the canonical language: a story always has it, English only
   * sometimes. Falling back is right — showing an empty headline because no
   * translation exists would be worse than showing the original.
   */
  // Structural, not tied to ArticleCard: videos carry the same pair of title
  // fields and need exactly this fallback. Naming a concrete type here meant
  // the video page could not use it.
  function title(item: { titleKh: string; titleEn?: string }): string {
    return isEnglish.value && item.titleEn ? item.titleEn : item.titleKh
  }

  function summary(article: ArticleCard | ArticleDetail): string {
    if (isEnglish.value) {
      const en = (article as ArticleDetail).summaryEn
      if (en) return en
    }
    return article.summaryKh ?? ''
  }

  function body(article: ArticleDetail): string {
    return isEnglish.value && article.contentEn ? article.contentEn : article.contentKh
  }

  /** True when the reader asked for English but this story has none. */
  function missingTranslation(article: ArticleDetail): boolean {
    return isEnglish.value && !article.hasEnglish
  }

  function categoryName(category?: CategoryRef | null): string {
    if (!category) return ''
    return isEnglish.value && category.nameEn ? category.nameEn : category.nameKh
  }

  return {
    locale, isEnglish, setLocale, t,
    title, summary, body, missingTranslation, categoryName,
  }
}
