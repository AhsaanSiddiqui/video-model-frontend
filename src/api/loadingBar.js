let pending = 0
const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener(pending))
}

export function trackRequestStart() {
  pending += 1
  emit()
}

export function trackRequestEnd() {
  pending = Math.max(0, pending - 1)
  emit()
}

export function settleRequest(config) {
  if (!config?.__loadingTracked || config.__loadingSettled) return
  config.__loadingSettled = true
  trackRequestEnd()
}

export function subscribeLoading(listener) {
  listeners.add(listener)
  listener(pending)
  return () => listeners.delete(listener)
}
