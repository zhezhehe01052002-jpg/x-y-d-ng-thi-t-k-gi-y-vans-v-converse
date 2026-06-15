<template>
  <!-- Overlay -->
  <transition name="fade">
    <div v-if="cartStore.isOpen" class="overlay" @click="cartStore.closeCart()"></div>
  </transition>

  <!-- Drawer -->
  <transition name="slide-right">
    <div v-if="cartStore.isOpen" class="cart-drawer">
      <!-- Header -->
      <div class="drawer-header">
        <h3 class="drawer-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Giỏ hàng
          <span class="item-count">({{ cartStore.totalItems }})</span>
        </h3>
        <button class="close-btn" @click="cartStore.closeCart()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="cartStore.items.length === 0" class="drawer-empty">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </div>
        <p>Giỏ hàng của bạn đang trống</p>
        <router-link to="/products" class="btn btn-primary" @click="cartStore.closeCart()">Mua sắm ngay</router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="drawer-body">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="`${item.id}-${item.size}-${item.color}`" class="cart-item">
            <img :src="item.image" :alt="item.name" class="item-img" @error="e => e.target.src='https://via.placeholder.com/80'" />
            <div class="item-info">
              <p class="item-brand">{{ item.brand }}</p>
              <p class="item-name">{{ item.name }}</p>
              <div class="item-meta">
                <span class="size-tag">Size {{ item.size }}</span>
                <span class="color-dot-sm" :style="{ background: item.color }"></span>
              </div>
              <div class="item-bottom">
                <div class="qty-control">
                  <button @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1)">+</button>
                </div>
                <span class="item-price">{{ formatPrice((item.salePrice || item.price) * item.quantity) }}</span>
              </div>
            </div>
            <button class="remove-btn" @click="cartStore.removeFromCart(item.id, item.size, item.color)" title="Xóa">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="drawer-footer">
          <div class="total-row">
            <span>Tạm tính:</span>
            <span class="total-price">{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <p class="shipping-note">🚚 Freeship đơn từ 500.000đ</p>
          <div class="drawer-actions">
            <router-link to="/cart" class="btn btn-outline" style="flex:1;text-align:center" @click="cartStore.closeCart()">Xem giỏ hàng</router-link>
            <router-link to="/cart" class="btn btn-accent" style="flex:1;text-align:center" @click="cartStore.closeCart()">Thanh toán</router-link>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useCartStore } from '../../stores/cart.js'

const cartStore = useCartStore()

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ'
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1100;
  backdrop-filter: blur(2px);
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100vh;
  background: white;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-gray-200);
  flex-shrink: 0;
}
.drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.item-count {
  font-size: 0.85rem;
  color: var(--color-gray-500);
  font-weight: 500;
}
.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-gray-200);
  cursor: pointer;
  transition: var(--transition-fast);
  background: none;
}
.close-btn:hover { background: var(--color-gray-100); color: var(--color-accent); }

.drawer-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  text-align: center;
}
.empty-icon { color: var(--color-gray-300); }
.drawer-empty p {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  color: var(--color-gray-500);
}

.drawer-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 12px;
  position: relative;
  padding: 12px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}
.cart-item:hover { border-color: var(--color-gray-300); box-shadow: var(--shadow-sm); }

.item-img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--color-gray-100);
  flex-shrink: 0;
}
.item-info { flex: 1; min-width: 0; }
.item-brand {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin-bottom: 2px;
}
.item-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-primary);
  line-height: 1.3;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.size-tag {
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 600;
  background: var(--color-gray-100);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--color-gray-700);
}
.color-dot-sm {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(0,0,0,0.15);
}

.item-bottom { display: flex; align-items: center; justify-content: space-between; }

.qty-control {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.qty-control button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-primary);
  transition: var(--transition-fast);
  cursor: pointer;
  background: none;
  border: none;
}
.qty-control button:hover { background: var(--color-gray-100); }
.qty-control span {
  width: 32px;
  text-align: center;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 600;
  border-left: 1px solid var(--color-gray-200);
  border-right: 1px solid var(--color-gray-200);
  line-height: 28px;
}

.item-price {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-gray-500);
  transition: var(--transition-fast);
  cursor: pointer;
  background: none;
  border: none;
}
.remove-btn:hover { color: var(--color-accent); background: #fee2e2; }

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-gray-100);
  flex-shrink: 0;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.95rem;
}
.total-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-accent);
}
.shipping-note {
  font-size: 0.78rem;
  color: var(--color-vans);
  margin-bottom: 14px;
  font-weight: 500;
}
.drawer-actions {
  display: flex;
  gap: 10px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }

@media (max-width: 480px) {
  .cart-drawer { width: 100vw; }
}
</style>
