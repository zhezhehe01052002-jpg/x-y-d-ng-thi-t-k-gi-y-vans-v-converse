<template>
  <transition name="modal-fade">
    <div v-if="visible && product" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box quickview-box">
        <button class="close-btn" @click="$emit('close')" aria-label="Đóng">✕</button>
        
        <div class="quickview-grid">
          <!-- Cột trái: Hình ảnh -->
          <div class="quickview-gallery">
            <div class="main-img-wrap">
              <img :src="activeImage" :alt="product.name" class="main-img" @error="handleImgError" />
              <span v-if="product.badge" :class="['badge-tag', `badge-${product.badge.toLowerCase()}`]">{{ product.badge }}</span>
            </div>
            <!-- Ảnh thumbnail nhỏ -->
            <div class="thumb-grid" v-if="product.image2">
              <button 
                :class="['thumb-btn', { active: activeImage === product.image }]" 
                @click="activeImage = product.image"
              >
                <img :src="product.image" :alt="product.name" />
              </button>
              <button 
                :class="['thumb-btn', { active: activeImage === product.image2 }]" 
                @click="activeImage = product.image2"
              >
                <img :src="product.image2" :alt="product.name" />
              </button>
            </div>
          </div>

          <!-- Cột phải: Thông tin chi tiết -->
          <div class="quickview-info">
            <span class="brand-tag">{{ product.brand }}</span>
            <h2 class="product-title">{{ product.name }}</h2>
            
            <!-- Giá cả -->
            <div class="price-section">
              <div v-if="product.salePrice" class="price-wrap">
                <span class="price-sale">{{ formatPrice(product.salePrice) }}</span>
                <span class="price-original">{{ formatPrice(product.price) }}</span>
                <span class="discount-pct">-{{ discountPercent }}%</span>
              </div>
              <div v-else class="price-wrap">
                <span class="price-normal">{{ formatPrice(product.price) }}</span>
              </div>
            </div>

            <p class="product-desc">
              {{ product.description || 'Mẫu giày sneaker thời trang cao cấp sở hữu phong cách hiện đại cùng với chất liệu vải canvas thoáng khí, mang lại trải nghiệm vô cùng thoải mái suốt ngày dài năng động.' }}
            </p>

            <div class="divider"></div>

            <!-- Màu sắc -->
            <div class="option-group">
              <h4 class="option-title">Màu Sắc: <span class="selected-val">{{ selectedColor }}</span></h4>
              <div class="color-options">
                <button
                  v-for="color in product.colors" :key="color"
                  :class="['color-btn', { active: selectedColor === color }]"
                  @click="selectedColor = color"
                  :style="{ background: color }"
                  :title="color"
                ></button>
              </div>
            </div>

            <!-- Kích cỡ -->
            <div class="option-group">
              <h4 class="option-title">Kích Cỡ (Size): <span class="selected-val">{{ selectedSize }}</span></h4>
              <div class="size-options">
                <button
                  v-for="size in product.sizes" :key="size"
                  :class="['size-btn', { active: selectedSize === size }]"
                  @click="selectedSize = size"
                >{{ size }}</button>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions-section">
              <button :class="['btn btn-primary add-btn', { added: isAdded }]" @click="addToCart">
                <span v-if="isAdded" class="added-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Đã thêm vào giỏ!
                </span>
                <span v-else class="normal-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Thêm vào giỏ hàng
                </span>
              </button>
            </div>

            <div class="detail-link-wrap">
              <router-link :to="`/product/${product.id}`" class="detail-link" @click="$emit('close')">
                Xem chi tiết sản phẩm &rarr;
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCartStore } from '../../stores/cart.js'
import { useToastStore } from '../../stores/toast.js'
import { formatPrice } from '../../composables/useFormatPrice.js'

const props = defineProps({
  product: { type: Object, default: null },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const cartStore = useCartStore()
const toastStore = useToastStore()

const activeImage = ref('')
const selectedSize = ref(null)
const selectedColor = ref(null)
const isAdded = ref(false)

const discountPercent = computed(() => {
  if (!props.product || !props.product.salePrice) return 0
  return Math.round((1 - props.product.salePrice / props.product.price) * 100)
})

// Theo dõi khi sản phẩm mở ra để reset values
watch(() => props.product, (newVal) => {
  if (newVal) {
    activeImage.value = newVal.image
    selectedSize.value = newVal.sizes[0] || null
    selectedColor.value = newVal.colors[0] || null
    isAdded.value = false
  }
}, { immediate: true })

const addToCart = () => {
  if (!props.product || !selectedSize.value || !selectedColor.value) return
  cartStore.addToCart(props.product, selectedSize.value, selectedColor.value)
  toastStore.add(`Đã thêm ${props.product.name} vào giỏ hàng! (Size ${selectedSize.value})`, 'success')
  isAdded.value = true
  setTimeout(() => {
    isAdded.value = false
  }, 2000)
}

const handleImgError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'
}
</script>

<style scoped>
.quickview-box {
  max-width: 900px;
  border-radius: var(--radius-lg);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  z-index: 10;
  font-weight: bold;
}
.close-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-accent);
  transform: rotate(90deg);
}

.quickview-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  overflow-y: auto;
}

.quickview-gallery {
  padding: 32px;
  background: var(--color-gray-100);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--color-gray-200);
}

.main-img-wrap {
  width: 100%;
  max-width: 360px;
  aspect-ratio: 1;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background: white;
  margin-bottom: 20px;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 2px;
  color: white;
}
.badge-new { background: var(--color-vans); }
.badge-hot { background: var(--color-accent); }
.badge-sale { background: #ff6b35; }

.thumb-grid {
  display: flex;
  gap: 10px;
}

.thumb-btn {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  border: 2px solid transparent;
  padding: 2px;
  background: white;
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}
.thumb-btn.active, .thumb-btn:hover {
  border-color: var(--color-primary);
}

/* Info Column */
.quickview-info {
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-tag {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin-bottom: 8px;
}

.product-title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.2;
  margin-bottom: 12px;
}

.price-section {
  margin-bottom: 20px;
}
.price-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}
.price-normal {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 850;
  color: var(--color-primary);
}
.price-sale {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 850;
  color: var(--color-accent);
}
.price-original {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--color-gray-500);
  text-decoration: line-through;
}
.discount-pct {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--color-accent);
  color: white;
  padding: 2px 6px;
  border-radius: 2px;
}

.product-desc {
  font-size: 0.88rem;
  color: var(--color-gray-700);
  line-height: 1.6;
  margin-bottom: 24px;
}

.divider {
  height: 1px;
  background: var(--color-gray-200);
  margin-bottom: 20px;
}

.option-group {
  margin-bottom: 18px;
}

.option-title {
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  color: var(--color-gray-900);
}
.selected-val {
  color: var(--color-accent);
  text-transform: none;
  font-weight: 600;
}

.color-options {
  display: flex;
  gap: 8px;
}
.color-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
  cursor: pointer;
  transition: var(--transition-fast);
  padding: 1px;
  position: relative;
}
.color-btn:hover {
  transform: scale(1.15);
}
.color-btn.active {
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--color-primary);
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.size-btn {
  width: 42px;
  height: 36px;
  border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-sm);
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  background: white;
}
.size-btn:hover {
  border-color: var(--color-primary);
}
.size-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.actions-section {
  margin-top: 28px;
  margin-bottom: 16px;
}
.add-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
}
.add-btn.added {
  background: var(--color-vans) !important;
  border-color: var(--color-vans) !important;
}
.add-btn svg {
  transition: transform 0.2s;
}
.add-btn:hover svg {
  transform: scale(1.1);
}

.added-text, .normal-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.detail-link-wrap {
  text-align: center;
}
.detail-link {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  transition: var(--transition-fast);
}
.detail-link:hover {
  color: var(--color-accent);
}



@media (max-width: 768px) {
  .modal-box {
    max-height: 95vh;
  }
  .quickview-grid {
    grid-template-columns: 1fr;
  }
  .quickview-gallery {
    padding: 24px;
    border-right: none;
    border-bottom: 1px solid var(--color-gray-200);
  }
  .quickview-info {
    padding: 24px;
  }
  .main-img-wrap {
    max-width: 280px;
  }
}
</style>
