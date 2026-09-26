import { ref, computed, readonly } from 'vue';
import { defineStore } from 'pinia';
import { a as useApi } from './server.mjs';

const useBreakingStore = defineStore("breaking", () => {
  const items = ref([]);
  const hasNewArticles = ref(false);
  const lastUpdated = ref(null);
  const hasBreaking = computed(() => items.value.length > 0);
  const headline = computed(() => {
    var _a;
    return (_a = items.value[0]) != null ? _a : null;
  });
  function setItems(next) {
    items.value = next;
    lastUpdated.value = /* @__PURE__ */ new Date();
  }
  function pushBreaking(payload) {
    const card = {
      id: payload.id,
      slug: payload.slug,
      titleKh: payload.titleKh,
      titleEn: payload.titleEn,
      summaryKh: payload.summaryKh,
      imageUrl: payload.imageUrl,
      category: payload.category ? { id: 0, slug: "", nameKh: payload.category, nameEn: payload.category } : void 0,
      isBreaking: true,
      isFeatured: false,
      publishedAt: payload.publishedAt,
      readingMinutes: 1,
      viewCount: 0,
      contentType: "editorial"
    };
    items.value = [card, ...items.value.filter((item) => item.id !== card.id)].slice(0, 12);
    lastUpdated.value = /* @__PURE__ */ new Date();
  }
  function markNewArticles() {
    hasNewArticles.value = true;
  }
  function clearNewArticles() {
    hasNewArticles.value = false;
  }
  async function refresh() {
    try {
      const api = useApi();
      setItems(await api.get("/api/breaking"));
    } catch {
    }
  }
  return {
    items,
    hasNewArticles,
    lastUpdated,
    hasBreaking,
    headline,
    setItems,
    pushBreaking,
    markNewArticles,
    clearNewArticles,
    refresh
  };
});
function useBreakingSocket() {
  useBreakingStore();
  const connected = ref(false);
  return { connected: readonly(connected) };
}

export { useBreakingSocket as a, useBreakingStore as u };
//# sourceMappingURL=useBreakingSocket-Cp17g4So.mjs.map
