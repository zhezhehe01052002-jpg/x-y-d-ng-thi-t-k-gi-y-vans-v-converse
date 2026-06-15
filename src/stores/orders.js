import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductsStore } from './products.js'
import { useAuthStore } from './auth.js'

const ORDERS_STORAGE_KEY = 'orders'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref(JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]'))

  const saveToStorage = () => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders.value))
  }

  // Filter orders for the currently authenticated user
  const userOrders = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return []
    return orders.value.filter(o => o.userId === authStore.user.id)
  })

  const addOrder = (order) => {
    orders.value.unshift(order)
    saveToStorage()

    // Update product stock when order is created
    const productsStore = useProductsStore()
    order.items.forEach(item => {
      productsStore.updateStock(item.id, item.quantity)
    })
  }

  const cancelOrder = (orderId) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === 'processing') {
      order.status = 'cancelled'
      saveToStorage()

      // Restore product stock when order is cancelled
      const productsStore = useProductsStore()
      order.items.forEach(item => {
        productsStore.updateStock(item.id, -item.quantity)
      })
    }
  }

  return {
    orders,
    userOrders,
    addOrder,
    cancelOrder
  }
})

