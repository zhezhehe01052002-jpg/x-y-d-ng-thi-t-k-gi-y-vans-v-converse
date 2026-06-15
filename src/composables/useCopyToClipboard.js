/**
 * Composable: Copy text to clipboard with status tracking
 * Used in CartView for copying bank info, phone numbers, etc.
 */
import { ref } from 'vue'

export const useCopyToClipboard = () => {
  const copyStatus = ref({})

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    copyStatus.value[key] = true
    setTimeout(() => {
      copyStatus.value[key] = false
    }, 2000)
  }

  const resetStatus = () => {
    copyStatus.value = {}
  }

  return { copyStatus, copyText, resetStatus }
}
