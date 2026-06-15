<template>
  <main>
    <!-- Hero Banner -->
    <HeroSlider :slides="slides" />

    <!-- Stats Bar -->
    <StatsBar />

    <!-- Brand Showcase -->
    <BrandShowcase />

    <!-- New Arrivals -->
    <section class="section bg-gray-section">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">🆕 Vừa cập bến</p>
            <h2 class="section-title">New Arrivals</h2>
          </div>
          <router-link to="/products?badge=NEW" class="view-all-btn">Xem tất cả</router-link>
        </div>
        <div class="products-grid">
          <ProductCard v-for="p in newArrivals" :key="p.id" :product="p" @quick-view="showQuickView" />
        </div>
      </div>
    </section>

    <!-- Promo Banner -->
    <PromoBanner />

    <!-- Best Sellers -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">🔥 Được yêu thích nhất</p>
            <h2 class="section-title">Best Sellers</h2>
          </div>
          <div class="tab-filter">
            <button
              v-for="tab in ['Tất cả', 'VANS', 'CONVERSE']" :key="tab"
              :class="['tab-btn', { active: activeTab === tab }]"
              @click="activeTab = tab"
            >{{ tab }}</button>
          </div>
        </div>
        <div class="products-grid">
          <ProductCard v-for="p in filteredBestSellers" :key="p.id" :product="p" @quick-view="showQuickView" />
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <WhyChooseUs />

    <!-- Quick View Modal -->
    <QuickViewModal :product="quickViewProduct" :visible="isQuickViewVisible" @close="isQuickViewVisible = false" />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '../components/product/ProductCard.vue'
import QuickViewModal from '../components/product/QuickViewModal.vue'
import HeroSlider from '../components/home/HeroSlider.vue'
import StatsBar from '../components/home/StatsBar.vue'
import BrandShowcase from '../components/home/BrandShowcase.vue'
import PromoBanner from '../components/home/PromoBanner.vue'
import WhyChooseUs from '../components/home/WhyChooseUs.vue'
import { useProductsStore } from '../stores/products.js'
import { banners } from '../data/images.js'

const productsStore = useProductsStore()

// Quick View State
const quickViewProduct = ref(null)
const isQuickViewVisible = ref(false)
const showQuickView = (product) => {
  quickViewProduct.value = product
  isQuickViewVisible.value = true
}

const slides = [
  {
    eyebrow: 'Bộ sưu tập 2024',
    title: 'VANS\nKNU-SKOOL',
    desc: 'Chunky, bold và cực kỳ phong cách. Phiên bản mới nhất từ Vans với đế dày ấn tượng.',
    bg: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
    circleColor: 'rgba(64, 145, 108, 0.3)',
    link: '/products?brand=VANS',
    img: banners.sliderVansKnuSkool
  },
  {
    eyebrow: 'Huyền thoại bất diệt',
    title: 'CONVERSE\nCHUCK TAYLOR',
    desc: 'Từ 1917 đến nay, Chuck Taylor All Star vẫn là biểu tượng không thể thay thế của văn hóa đường phố.',
    bg: 'linear-gradient(135deg, #6b0010 0%, #c1121f 50%, #e63946 100%)',
    circleColor: 'rgba(230, 57, 70, 0.3)',
    link: '/products?brand=CONVERSE',
    img: banners.sliderConverseChuck
  },
  {
    eyebrow: '🔥 Flash Sale',
    title: 'SALE\nUP TO 50%',
    desc: 'Hàng trăm mẫu Vans và Converse chính hãng với mức giá ưu đãi nhất trong năm!',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #444444 100%)',
    circleColor: 'rgba(230, 57, 70, 0.2)',
    link: '/products?badge=SALE',
    img: banners.sliderFlashSale
  }
]

const newArrivals = computed(() => productsStore.newArrivals)
const bestSellers = computed(() => productsStore.bestSellers)

const activeTab = ref('Tất cả')
const filteredBestSellers = computed(() => {
  let result = bestSellers.value
  if (activeTab.value !== 'Tất cả') result = result.filter(p => p.brand === activeTab.value)
  return result.slice(0, 4)
})
</script>

<style scoped>
.bg-gray-section { background: var(--color-gray-100); }
.section-eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-gray-500);
  margin-bottom: 4px;
  display: block;
}

.tab-filter { display: flex; gap: 4px; }
.tab-btn {
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-gray-300);
  color: var(--color-gray-700);
  background: none;
  cursor: pointer;
  transition: var(--transition-fast);
}
.tab-btn:hover, .tab-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

@media (max-width: 480px) {
  .tab-filter { flex-wrap: wrap; }
}
</style>
