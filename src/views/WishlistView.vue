<template>
  <main class="wishlist-page">
    <PageHero
      title="Sản Phẩm Yêu Thích"
      :crumbs="[{ label: 'Trang chủ', to: '/' }, { label: 'Yêu thích' }]"
    />

    <div class="container section">
      <div v-if="wishlistStore.items.length > 0" class="products-grid">
        <ProductCard 
          v-for="p in wishlistStore.items" 
          :key="p.id" 
          :product="p" 
          @quick-view="showQuickView"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">&hearts;</div>
        <p>Danh sách sản phẩm yêu thích của bạn đang trống.</p>
        <router-link to="/products" class="btn btn-primary">Khám phá sản phẩm</router-link>
      </div>
    </div>

    <!-- Quick View Modal -->
    <QuickViewModal :product="quickViewProduct" :visible="isQuickViewVisible" @close="isQuickViewVisible = false" />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import PageHero from '../components/ui/PageHero.vue'
import { useWishlistStore } from '../stores/wishlist.js'
import ProductCard from '../components/product/ProductCard.vue'
import QuickViewModal from '../components/product/QuickViewModal.vue'

const wishlistStore = useWishlistStore()

// Quick View State
const quickViewProduct = ref(null)
const isQuickViewVisible = ref(false)
const showQuickView = (product) => {
  quickViewProduct.value = product
  isQuickViewVisible.value = true
}
</script>

<style scoped>

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  gap: 16px;
}
.empty-icon {
  font-size: 4rem;
  color: var(--color-accent);
  line-height: 1;
}
.empty-state p {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--color-gray-500);
}
</style>
