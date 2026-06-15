<template>
  <div class="product-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Badge -->
    <div class="card-badge-wrap">
      <span v-if="product.badge" :class="`badge badge-${product.badge.toLowerCase()}`">
        {{ product.badge }}
      </span>
    </div>

    <!-- Wishlist Button -->
    <button 
      class="wishlist-btn" 
      :class="{ active: wishlistStore.isInWishlist(product.id) }" 
      @click.prevent="toggleWishlist"
      aria-label="Yêu thích"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>

    <!-- Image -->
    <router-link :to="`/product/${product.id}`" class="card-img-wrap">
      <img
        :src="isHovered && product.image2 ? product.image2 : product.image"
        :alt="product.name"
        class="card-img"
        loading="lazy"
        @error="handleImgError"
      />
      <!-- Hover overlay -->
      <div class="card-overlay" :class="{ visible: isHovered }">
        <button class="quick-view-btn" @click.prevent="$emit('quick-view', product)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="1" cy="12" r="3"/><path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7-11-7-11-7z"/></svg>
          Xem nhanh
        </button>
      </div>
    </router-link>

    <!-- Info -->
    <div class="card-info">
      <p class="card-brand">{{ product.brand }}</p>
      <router-link :to="`/product/${product.id}`" class="card-name">{{ product.name }}</router-link>

      <!-- Colors -->
      <div class="card-colors">
        <span
          v-for="color in product.colors.slice(0, 4)"
          :key="color"
          class="color-dot"
          :style="{ background: color }"
          :title="color"
        ></span>
        <span v-if="product.colors.length > 4" class="color-more">+{{ product.colors.length - 4 }}</span>
      </div>

      <!-- Price -->
      <div class="price-wrap">
        <template v-if="product.salePrice">
          <span class="price-sale">{{ formatPrice(product.salePrice) }}</span>
          <span class="price-original">{{ formatPrice(product.price) }}</span>
          <span class="discount-pct">-{{ discountPercent }}%</span>
        </template>
        <template v-else>
          <span class="price">{{ formatPrice(product.price) }}</span>
        </template>
      </div>

      <!-- Add to Cart -->
      <button class="add-to-cart-btn" @click="handleAddToCart" :class="{ added: justAdded }">
        <span v-if="!justAdded">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Thêm vào giỏ
        </span>
        <span v-else>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Đã thêm!
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../../stores/cart.js'
import { useToastStore } from '../../stores/toast.js'
import { useWishlistStore } from '../../stores/wishlist.js'
import { formatPrice } from '../../composables/useFormatPrice.js'

const props = defineProps({
  product: { type: Object, required: true }
})
defineEmits(['quick-view'])

const cartStore = useCartStore()
const toastStore = useToastStore()
const wishlistStore = useWishlistStore()
const isHovered = ref(false)
const justAdded = ref(false)

const toggleWishlist = () => {
  const added = wishlistStore.toggle(props.product)
  if (added) {
    toastStore.add(`Đã thêm ${props.product.name} vào mục yêu thích!`, 'success')
  } else {
    toastStore.add(`Đã xóa ${props.product.name} khỏi mục yêu thích.`, 'info')
  }
}

const discountPercent = computed(() => {
  if (!props.product.salePrice) return 0
  return Math.round((1 - props.product.salePrice / props.product.price) * 100)
})




const handleAddToCart = () => {
  const defaultSize = props.product.sizes[Math.floor(props.product.sizes.length / 2)]
  const defaultColor = props.product.colors[0]
  cartStore.addToCart(props.product, defaultSize, defaultColor)
  toastStore.add(`Đã thêm ${props.product.name} vào giỏ hàng! (Size ${defaultSize})`, 'success')
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 2000)
}

const handleImgError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition);
  position: relative;
  border: 1px solid var(--color-gray-200);
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.card-badge-wrap {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.card-img-wrap {
  display: block;
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-gray-100);
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.product-card:hover .card-img {
  transform: scale(1.06);
}

.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.card-overlay.visible { opacity: 1; }

.quick-view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
  border: none;
  cursor: pointer;
}
.quick-view-btn:hover { background: var(--color-accent); color: white; }

.card-info {
  padding: 14px;
}

.card-brand {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin-bottom: 4px;
}

.card-name {
  display: block;
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
  margin-bottom: 8px;
  transition: var(--transition-fast);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-name:hover { color: var(--color-accent); }

.card-colors {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}
.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
  display: block;
  transition: transform 0.2s ease;
}
.color-dot:hover { transform: scale(1.3); }
.color-more {
  font-size: 0.72rem;
  color: var(--color-gray-500);
  font-weight: 500;
}

.price-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.discount-pct {
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  background: var(--color-accent);
  padding: 1px 5px;
  border-radius: 2px;
}

.add-to-cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--color-primary);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: var(--transition);
}
.add-to-cart-btn:hover {
  background: var(--color-accent);
  transform: translateY(-1px);
}
.add-to-cart-btn.added {
  background: var(--color-vans);
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  color: var(--color-gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
  border: none;
}
.wishlist-btn:hover {
  color: var(--color-accent);
  transform: scale(1.1);
}
.wishlist-btn.active {
  color: var(--color-accent);
}
</style>
