<script setup lang="ts">
/**
 * Wordmark. Inline SVG rather than an image file so it paints with the first
 * HTML byte and costs no extra request on the critical path.
 */
</script>

<template>
  <svg viewBox="0 0 240 40" role="img" aria-label="Cambodia Fast News" fill="none">
    <rect x="0" y="4" width="32" height="32" rx="6" fill="#1E3A8A" />
    <path d="M9 20h14M16 13l7 7-7 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <text x="40" y="19" font-family="Manrope, sans-serif" font-size="15" font-weight="800" fill="#0F172A">
      CAMBODIA
    </text>
    <text x="40" y="34" font-family="Manrope, sans-serif" font-size="15" font-weight="800" fill="#1E3A8A" letter-spacing="0.5">
      FAST NEWS
    </text>
  </svg>
</template>
