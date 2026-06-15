import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const CART_STORAGE_KEY = 'sneakerbuzz_cart'

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCartFromStorage())
  const isOpen = ref(false)

  // Persist cart to localStorage on every change
  watch(items, (newItems) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
  }, { deep: true })

  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((acc, item) => {
      const price = item.salePrice || item.price
      return acc + price * item.quantity
    }, 0)
  )

  const addToCart = (product, size, color, quantity = 1) => {
    const existingIndex = items.value.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    )
    if (existingIndex !== -1) {
      items.value[existingIndex].quantity += quantity
    } else {
      items.value.push({ ...product, size, color, quantity })
    }
    isOpen.value = true
  }

  const removeFromCart = (id, size, color) => {
    items.value = items.value.filter(
      item => !(item.id === id && item.size === size && item.color === color)
    )
  }

  const updateQuantity = (id, size, color, quantity) => {
    const item = items.value.find(
      item => item.id === id && item.size === size && item.color === color
    )
    if (item) {
      if (quantity <= 0) removeFromCart(id, size, color)
      else item.quantity = quantity
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const closeCart = () => {
    isOpen.value = false
  }

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart
  }
})
