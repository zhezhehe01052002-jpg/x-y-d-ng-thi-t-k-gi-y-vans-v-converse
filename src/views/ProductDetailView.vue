<template>
  <main class="detail-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb-bar">
      <div class="container">
        <nav class="breadcrumb">
          <router-link to="/">Trang chủ</router-link>
          <span>/</span>
          <router-link to="/products">Sản phẩm</router-link>
          <span>/</span>
          <span>{{ product?.name }}</span>
        </nav>
      </div>
    </div>

    <div class="container" v-if="product">
      <!-- Main Product Section -->
      <div class="product-layout">
        <!-- Images -->
        <div class="product-images">
          <div class="main-image-wrap">
            <span v-if="product.badge" :class="['badge', `badge-${product.badge.toLowerCase()}`]">{{ product.badge }}</span>
            <img :src="activeImg" :alt="product.name" class="main-image" />
          </div>
          <div class="thumb-list">
            <button
              v-for="(img, i) in [product.image, product.image2]"
              :key="i"
              :class="['thumb-btn', { active: activeImg === img }]"
              @click="activeImg = img"
            >
              <img :src="img" :alt="product.name" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="product-info">
          <span class="brand-label">{{ product.brand }}</span>
          <h1 class="product-name">{{ product.name }}</h1>

          <!-- Rating placeholder -->
          <div class="rating-row">
            <span class="stars">★★★★★</span>
            <span class="rating-text">4.9 (128 đánh giá)</span>
          </div>

          <!-- Price -->
          <div class="price-block">
            <span v-if="product.salePrice" class="price-sale">{{ formatPrice(product.salePrice) }}</span>
            <span :class="product.salePrice ? 'price-original' : 'price-main'">{{ formatPrice(product.price) }}</span>
            <span v-if="product.salePrice" class="discount-tag">
              -{{ Math.round((1 - product.salePrice / product.price) * 100) }}%
            </span>
          </div>

          <!-- Colors -->
          <div class="option-group">
            <p class="option-label">Màu sắc: <strong>{{ selectedColorName }}</strong></p>
            <div class="color-list">
              <button
                v-for="(color, i) in product.colors"
                :key="i"
                :class="['color-dot', { active: selectedColor === color }]"
                :style="{ background: color }"
                @click="selectedColor = color"
                :title="color"
              />
            </div>
          </div>

          <!-- Sizes -->
          <div class="option-group">
            <p class="option-label size-label-row">
              <span>Size: <strong>{{ selectedSize || 'Chọn size' }}</strong></span>
              <router-link to="/size-guide" class="size-guide-link">Hướng dẫn chọn size</router-link>
            </p>
            <div class="size-grid">
              <button
                v-for="size in product.sizes"
                :key="size"
                :class="['size-btn', { active: selectedSize === size }]"
                @click="selectedSize = size"
              >{{ size }}</button>
            </div>
            <p v-if="sizeError" class="size-error">⚠ Vui lòng chọn size trước khi thêm vào giỏ</p>
          </div>

          <!-- Qty -->
          <div class="option-group">
            <p class="option-label">Số lượng:</p>
            <div class="qty-control">
              <button @click="qty = Math.max(1, qty - 1)" class="qty-btn">−</button>
              <span class="qty-num">{{ qty }}</span>
              <button @click="qty = Math.min(product.stock, qty + 1)" class="qty-btn">+</button>
              <span class="stock-info">Còn {{ product.stock }} sản phẩm</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="cta-group">
            <button class="btn btn-primary btn-lg" @click="addToCart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.68L23 6H6"/>
              </svg>
              Thêm vào giỏ
            </button>
            <button class="btn btn-accent btn-lg" @click="buyNow">Mua ngay</button>
            <button 
              class="btn btn-outline btn-wishlist" 
              :class="{ active: wishlistStore.isInWishlist(product?.id) }" 
              @click="toggleWishlist"
              aria-label="Yêu thích"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" :fill="wishlistStore.isInWishlist(product?.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>



          <!-- Perks -->
          <div class="perks-list">
            <div class="perk-item" v-for="p in perks" :key="p.text">
              <span class="perk-icon">{{ p.icon }}</span>
              <span>{{ p.text }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="desc-block">
            <h3 class="desc-title">Mô tả sản phẩm</h3>
            <p class="desc-text">{{ product.description }}</p>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section class="related-section" v-if="related.length">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Có thể bạn thích</p>
            <h2 class="section-title">Sản Phẩm Liên Quan</h2>
          </div>
          <router-link :to="`/products?brand=${product.brand}`" class="view-all-btn">Xem thêm</router-link>
        </div>
        <div class="products-grid">
          <ProductCard v-for="p in related" :key="p.id" :product="p" />
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="not-found">
      <p>😕 Không tìm thấy sản phẩm</p>
      <router-link to="/products" class="btn btn-primary">Về trang sản phẩm</router-link>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/product/ProductCard.vue'
import { useProductsStore } from '../stores/products.js'
import { useCartStore } from '../stores/cart.js'
import { useToastStore } from '../stores/toast.js'
import { useWishlistStore } from '../stores/wishlist.js'
import { formatPrice } from '../composables/useFormatPrice.js'
import { PRODUCT_PERKS } from '../constants/index.js'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const toastStore = useToastStore()
const wishlistStore = useWishlistStore()

const toggleWishlist = () => {
  if (!product.value) return
  const added = wishlistStore.toggle(product.value)
  if (added) {
    toastStore.add(`Đã thêm ${product.value.name} vào danh sách yêu thích!`, 'success')
  } else {
    toastStore.add(`Đã xóa ${product.value.name} khỏi danh sách yêu thích.`, 'info')
  }
}

const product = ref(null)
const related = ref([])
const activeImg = ref('')
const selectedColor = ref('')
const selectedSize = ref(null)
const qty = ref(1)
const sizeError = ref(false)

const perks = PRODUCT_PERKS

const selectedColorName = computed(() => selectedColor.value || 'Chưa chọn')



const loadProduct = (id) => {
  const p = productsStore.getProductById(id)
  product.value = p || null
  if (p) {
    activeImg.value = p.image
    selectedColor.value = p.colors[0]
    selectedSize.value = null
    qty.value = 1
    related.value = productsStore.getRelatedProducts(id, p.brand, 4)
  }
}

const addToCart = () => {
  if (!selectedSize.value) {
    sizeError.value = true
    setTimeout(() => sizeError.value = false, 3000)
    toastStore.add('Vui lòng chọn size giày!', 'error')
    return
  }
  sizeError.value = false
  cartStore.addToCart(product.value, selectedSize.value, selectedColor.value, qty.value)
  toastStore.add(`Đã thêm ${product.value.name} vào giỏ hàng! (Size ${selectedSize.value}, SL ${qty.value})`, 'success')
}

const buyNow = () => {
  if (!selectedSize.value) {
    sizeError.value = true
    setTimeout(() => sizeError.value = false, 3000)
    return
  }
  cartStore.addToCart(product.value, selectedSize.value, selectedColor.value, qty.value)
  router.push('/cart')
}

watch(() => route.params.id, (id) => loadProduct(id), { immediate: true })
</script>

<style scoped>
.detail-page { min-height: 100vh; padding-bottom: 80px; }

.breadcrumb-bar {
  background: var(--color-gray-100);
  padding: 14px 0;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--color-gray-200);
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.83rem;
  color: var(--color-gray-500);
}
.breadcrumb a { color: var(--color-primary); transition: var(--transition-fast); }
.breadcrumb a:hover { text-decoration: underline; }

/* Product Layout */
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  margin-bottom: 72px;
}

/* Images */
.product-images { display: flex; flex-direction: column; gap: 12px; }
.main-image-wrap {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-gray-100);
  aspect-ratio: 1;
}
.badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  color: white;
}
.badge-hot { background: var(--color-accent); }
.badge-new { background: #22c55e; }
.badge-sale { background: #f59e0b; }

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.main-image-wrap:hover .main-image { transform: scale(1.04); }

.thumb-list { display: flex; gap: 8px; }
.thumb-btn {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: var(--transition-fast);
  background: var(--color-gray-100);
}
.thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
.thumb-btn.active { border-color: var(--color-primary); }
.thumb-btn:hover { border-color: var(--color-gray-400); }

/* Info */
.product-info { display: flex; flex-direction: column; gap: 0; }
.brand-label {
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 8px;
  display: block;
}
.product-name {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1.1;
  margin-bottom: 12px;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.stars { color: #f59e0b; font-size: 1rem; letter-spacing: 1px; }
.rating-text { font-size: 0.83rem; color: var(--color-gray-500); }

.price-block {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
}
.price-main {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-primary);
}
.price-sale {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-accent);
}
.price-original {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-gray-400);
  text-decoration: line-through;
}
.discount-tag {
  background: var(--color-accent);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.option-group { margin-bottom: 20px; }
.option-label {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-gray-600);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.option-label strong { color: var(--color-primary); }

.color-list { display: flex; gap: 8px; }
.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: var(--transition-fast);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.color-dot.active { outline-color: var(--color-primary); }
.color-dot:hover { transform: scale(1.15); }

.size-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.size-btn {
  min-width: 48px;
  height: 42px;
  padding: 0 10px;
  border: 1.5px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: var(--transition-fast);
  background: white;
}
.size-btn:hover, .size-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.size-error {
  margin-top: 8px;
  font-size: 0.82rem;
  color: var(--color-accent);
  font-weight: 600;
}
.size-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.size-guide-link {
  font-size: 0.72rem;
  color: var(--color-gray-500);
  text-decoration: underline;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}
.size-guide-link:hover {
  color: var(--color-accent);
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 12px;
}
.qty-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-gray-300);
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--transition-fast);
  color: var(--color-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qty-btn:hover { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.qty-num {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 800;
  width: 32px;
  text-align: center;
}
.stock-info {
  font-size: 0.8rem;
  color: var(--color-gray-400);
  margin-left: 8px;
}

.cta-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.btn-lg { padding: 14px 28px; font-size: 0.95rem; flex: 1; }
.btn-wishlist {
  flex-grow: 0;
  width: 54px;
  height: 54px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}
.btn-wishlist.active, .btn-wishlist:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.btn-wishlist.active {
  color: var(--color-accent);
}


.perks-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 16px;
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
}
.perk-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--color-gray-700);
}
.perk-icon { font-size: 1rem; }

.desc-block {}
.desc-title {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  margin-bottom: 10px;
}
.desc-text {
  font-size: 0.9rem;
  color: var(--color-gray-700);
  line-height: 1.8;
}

/* Related */
.related-section { margin-top: 8px; }
.section-eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-gray-500);
  margin-bottom: 4px;
  display: block;
}

/* Not found */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 120px 40px;
  text-align: center;
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--color-gray-500);
}

@media (max-width: 768px) {
  .product-layout { grid-template-columns: 1fr; gap: 32px; }
  .cta-group { flex-direction: column; }
  .perks-list { grid-template-columns: 1fr; }
}
</style>
