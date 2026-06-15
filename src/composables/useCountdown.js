/**
 * Composable: Countdown timer
 * Used in HomeView promo banner & CartView QR payment timeout
 */
import { ref, computed, onUnmounted } from 'vue'

export const useCountdown = (initialSeconds = 0) => {
  const seconds = ref(initialSeconds)
  let timer = null

  const timeStr = computed(() => {
    const h = Math.floor(seconds.value / 3600)
    const m = Math.floor((seconds.value % 3600) / 60)
    const s = seconds.value % 60

    if (h > 0) {
      return {
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      }
    }
    return {
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0')
    }
  })

  const timeDisplay = computed(() => {
    const t = timeStr.value
    if (t.hours) return `${t.hours}:${t.minutes}:${t.seconds}`
    return `${t.minutes}:${t.seconds}`
  })

  const start = (durationSeconds) => {
    stop()
    seconds.value = durationSeconds
    timer = setInterval(() => {
      if (seconds.value > 0) seconds.value--
      else stop()
    }, 1000)
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onUnmounted(stop)

  return { seconds, timeStr, timeDisplay, start, stop }
}
