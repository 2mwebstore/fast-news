import { a as useApi, e as useRuntimeConfig, r as navigateTo } from "../server.mjs";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
const ACCESS_KEY = "cfn.admin.access";
const REFRESH_KEY = "cfn.admin.refresh";
const useAuthStore = defineStore("auth", () => {
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const user = ref(null);
  const ready = ref(false);
  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value));
  function can(permission) {
    return user.value?.permissions.includes(permission) ?? false;
  }
  function persist() {
    try {
      if (accessToken.value) localStorage.setItem(ACCESS_KEY, accessToken.value);
      else localStorage.removeItem(ACCESS_KEY);
      if (refreshToken.value) localStorage.setItem(REFRESH_KEY, refreshToken.value);
      else localStorage.removeItem(REFRESH_KEY);
    } catch {
    }
  }
  async function login(email, password) {
    const api = useApi();
    const result = await api.post("/api/auth/login", { email, password });
    accessToken.value = result.tokens.accessToken;
    refreshToken.value = result.tokens.refreshToken;
    user.value = result.user;
    persist();
  }
  async function restore() {
    if (ready.value) return;
    try {
      accessToken.value = localStorage.getItem(ACCESS_KEY);
      refreshToken.value = localStorage.getItem(REFRESH_KEY);
    } catch {
    }
    if (accessToken.value) {
      try {
        user.value = await useAdminApi().get("/api/auth/me");
      } catch {
        if (!await refresh()) logout();
      }
    }
    ready.value = true;
  }
  async function refresh() {
    if (!refreshToken.value) return false;
    try {
      const api = useApi();
      const result = await api.post(
        "/api/auth/refresh",
        { refreshToken: refreshToken.value }
      );
      accessToken.value = result.tokens.accessToken;
      refreshToken.value = result.tokens.refreshToken;
      persist();
      user.value = await useAdminApi().get("/api/auth/me");
      return true;
    } catch {
      return false;
    }
  }
  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    persist();
  }
  return { accessToken, refreshToken, user, ready, isAuthenticated, can, login, restore, refresh, logout };
});
function useAdminApi() {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;
  async function request(path, options = {}, retrying = false) {
    const auth = useAuthStore();
    try {
      const response = await $fetch(path, {
        baseURL: base,
        ...options,
        headers: {
          ...options.headers,
          ...auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}
        }
      });
      return { data: response.data, meta: response.meta };
    } catch (error) {
      const status = error.statusCode ?? error.response?.status;
      if (status === 401 && !retrying && auth.refreshToken) {
        if (await auth.refresh()) return request(path, options, true);
        auth.logout();
        await navigateTo("/admin/login");
      }
      throw error;
    }
  }
  return {
    async get(path, query) {
      return (await request(path, { method: "GET", query })).data;
    },
    async list(path, query) {
      return request(path, { method: "GET", query });
    },
    async post(path, body) {
      return (await request(path, { method: "POST", body })).data;
    },
    async put(path, body) {
      return (await request(path, { method: "PUT", body })).data;
    },
    async patch(path, body) {
      return (await request(path, { method: "PATCH", body })).data;
    },
    async del(path) {
      return (await request(path, { method: "DELETE" })).data;
    },
    /** Multipart upload; the browser sets the boundary, so no Content-Type here. */
    async upload(path, form) {
      return (await request(path, { method: "POST", body: form })).data;
    }
  };
}
export {
  useAuthStore as a,
  useAdminApi as u
};
//# sourceMappingURL=useAdminApi-SsuwQDOr.js.map
