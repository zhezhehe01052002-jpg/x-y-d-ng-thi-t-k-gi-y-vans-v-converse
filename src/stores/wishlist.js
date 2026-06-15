import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([])

  // Load from local storage
  const saved = localStorage.getItem('wishlist')
  if (saved) {
    try {
      items.value = JSON.parse(saved)
    } catch (e) {
      items.value = []
    }
  }

  // Watch and save to local storage
  watch(items, (newItems) => {
    localStorage.setItem('wishlist', JSON.stringify(newItems))
  }, { deep: true })

  const toggle = (product) => {
    const i = items.value.findIndex(item => item.id === product.id)
    if (i === -1) {
      items.value.push(product)
      return true // Added
    } else {
      items.value.splice(i, 1)
      return false // Removed
    }
  }

  const isInWishlist = (id) => {
    return items.value.some(item => item.id === id)
  }

  return { items, toggle, isInWishlist }
})
