<script setup lang="ts">
const { t } = useLocale()
/**
 * The public site shell. The admin uses its own layout so the reader-facing
 * header, footer and breaking bar never render inside the CMS.
 */
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <!-- Keyboard users land here first; the nav is long, so a skip link is
         the difference between one tab and thirty. -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]
             focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
    >
      {{ t('skipToContent') }}
    </a>

    <OfflineBanner />
    <TheHeader />
    <BreakingNewsBar />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <TheFooter />
    <MobileStickyAd />
    <PushNotificationPrompt />
  </div>
</template>
