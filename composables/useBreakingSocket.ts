import type { BreakingPayload, WsEvent } from '~/types'

/**
 * useBreakingSocket subscribes to the newsroom WebSocket so readers see
 * breaking news without refreshing (§7).
 *
 * It reconnects with exponential backoff and falls back to polling when the
 * socket cannot be established at all — a reader on a network that blocks
 * WebSockets should still get updates, just more slowly.
 */
export function useBreakingSocket() {
  const config = useRuntimeConfig()
  const store = useBreakingStore()

  const connected = ref(false)
  let socket: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let pollTimer: ReturnType<typeof setInterval> | null = null
  let attempts = 0
  let closedByUs = false

  const MAX_ATTEMPTS = 6
  const POLL_INTERVAL = 60_000

  function connect() {
    if (import.meta.server || socket) return

    try {
      socket = new WebSocket(config.public.wsUrl)
    } catch {
      startPolling()
      return
    }

    socket.onopen = () => {
      connected.value = true
      attempts = 0
      stopPolling()
    }

    socket.onmessage = (event) => {
      let parsed: WsEvent<BreakingPayload>
      try {
        parsed = JSON.parse(event.data)
      } catch {
        return // a malformed frame is not worth tearing the connection down
      }

      switch (parsed.type) {
        case 'breaking':
          if (parsed.payload) store.pushBreaking(parsed.payload)
          break
        case 'breaking_ended':
          store.refresh()
          break
        case 'article':
          store.markNewArticles()
          break
        case 'ping':
          break
      }
    }

    socket.onclose = () => {
      connected.value = false
      socket = null
      if (!closedByUs) scheduleReconnect()
    }

    socket.onerror = () => {
      socket?.close()
    }
  }

  function scheduleReconnect() {
    attempts += 1
    if (attempts > MAX_ATTEMPTS) {
      // Stop hammering a socket that clearly is not going to open and switch
      // to polling instead.
      startPolling()
      return
    }
    const delay = Math.min(1000 * 2 ** attempts, 30_000)
    reconnectTimer = setTimeout(connect, delay)
  }

  function startPolling() {
    if (pollTimer) return
    pollTimer = setInterval(() => store.refresh(), POLL_INTERVAL)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  function disconnect() {
    closedByUs = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    stopPolling()
    socket?.close()
    socket = null
    connected.value = false
  }

  onMounted(() => {
    connect()

    // A phone that has been in a pocket for an hour has a dead socket that has
    // not fired onclose yet. Re-check on wake so the bar is not stale.
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    disconnect()
  })

  function onVisibilityChange() {
    if (document.visibilityState !== 'visible') return
    store.refresh()
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      attempts = 0
      closedByUs = false
      connect()
    }
  }

  return { connected: readonly(connected) }
}
