/** Web Push subscription management (§30). */
export function usePush() {
  const api = useApi()

  const supported = computed(() =>
    import.meta.client &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window,
  )

  const permission = ref<NotificationPermission>('default')
  const subscribed = ref(false)

  onMounted(async () => {
    if (!supported.value) return
    permission.value = Notification.permission
    try {
      const registration = await navigator.serviceWorker.ready
      subscribed.value = Boolean(await registration.pushManager.getSubscription())
    } catch {
      subscribed.value = false
    }
  })

  /** VAPID keys are base64url; PushManager wants a Uint8Array. */
  // Returns an ArrayBuffer rather than a Uint8Array: pushManager.subscribe
  // wants a BufferSource backed by a plain ArrayBuffer, and Uint8Array.from
  // gives one typed over ArrayBufferLike, which includes SharedArrayBuffer and
  // so is not assignable.
  function urlBase64ToBuffer(base64: string): ArrayBuffer {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(normalized)
    const buffer = new ArrayBuffer(raw.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < raw.length; i += 1) view[i] = raw.charCodeAt(i)
    return buffer
  }

  /**
   * Subscribes to the chosen topics. Must be called from a user gesture —
   * browsers reject (and remember) permission requests that are not.
   */
  async function subscribe(topics: string[]): Promise<boolean> {
    if (!supported.value) return false

    const { publicKey, configured } = await api.get<{ publicKey: string; configured: boolean }>('/api/push/key')
    if (!configured || !publicKey) return false

    permission.value = await Notification.requestPermission()
    if (permission.value !== 'granted') return false

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToBuffer(publicKey),
    })

    const payload = subscription.toJSON()
    await api.post('/api/push/subscribe', {
      endpoint: payload.endpoint,
      keys: payload.keys,
      topics,
      lang: 'km',
    })

    subscribed.value = true
    return true
  }

  async function unsubscribe(): Promise<void> {
    if (!supported.value) return
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return

    await api.post('/api/push/unsubscribe', { endpoint: subscription.endpoint })
    await subscription.unsubscribe()
    subscribed.value = false
  }

  return { supported, permission, subscribed, subscribe, unsubscribe }
}
