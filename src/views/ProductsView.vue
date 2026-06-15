<template>
  <main class="products-page">
    <PageHero
      :title="pageTitle"
      :crumbs="[{ label: 'Trang chủ', to: '/' }, { label: pageTitle }]"
    />

    <div class="container">
      <div class="products-layout">
        <!-- Sidebar Filter -->
        <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
          <div class="sidebar-header">
            <h3>Bộ lọc</h3>
            <button class="clear-btn" @click="resetAll">Xóa tất cả</button>
          </div>

          <!-- Brand Filter -->
          <div class="filter-group">
            <h4 class="filter-title">Thương Hiệu</h4>
            <div class="filter-options">
              <label v-for="brand in ['VANS', 'CONVERSE']" :key="brand" class="filter-label">
                <input type="radio" :value="brand" v-model="selectedBrand" @change="applyFilters" />
                <span class="filter-text">{{ brand }}</span>
                <span class="filter-count">{{ getBrandCount(brand) }}</span>
              </label>
              <label class="filter-label">
                <input type="radio" :value="null" v-model="selectedBrand" @change="applyFilters" />
                <span class="filter-text">Tất cả</span>
              </label>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="filter-group" v-if="availableCategories.length">
            <h4 class="filter-title">Dòng Sản Phẩm</h4>
            <div class="filter-options">
              <label v-for="cat in availableCategories" :key="cat" class="filter-label">
                <input type="checkbox" :value="cat" v-model="selectedCategories" @change="applyFilters" />
                <span class="filter-text">{{ cat }}</span>
              </label>
            </div>
          </div>

          <!-- Size Filter -->
          <div class="filter-group">
            <h4 class="filter-title">Size</h4>
            <div class="size-grid">
              <button
                v-for="size in allSizes" :key="size"
                :class="['size-btn', { active: selectedSizes.includes(size) }]"
                @click="toggleSize(size)"
              >{{ size }}</button>
            </div>
          </div>

          <!-- Price Filter -->
          <div class="filter-group">
            <h4 class="filter-title">Khoảng Giá</h4>
            <div class="price-range">
              <span class="price-label">{{ formatPrice(priceMin) }} – {{ formatPrice(priceMax) }}</span>
              <input type="range" min="0" max="3000000" step="100000" v-model.number="priceMin" @input="applyFilters" class="range-input" />
              <input type="range" min="0" max="3000000" step="100000" v-model.number="priceMax" @input="applyFilters" class="range-input" />
            </div>
          </div>

          <!-- Badge Filter -->
          <div class="filter-group">
            <h4 class="filter-title">Trạng Thái</h4>
            <div class="filter-options">
              <label v-for="badge in [null, 'NEW', 'HOT', 'SALE']" :key="badge" class="filter-label">
                <input type="radio" :value="badge" v-model="selectedBadge" @change="applyFilters" />
                <span class="filter-text">{{ badge || 'Tất cả' }}</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="products-main">
          <!-- Toolbar -->
          <div class="products-toolbar">
            <div class="toolbar-left">
              <button class="filter-toggle" @click="isSidebarOpen = !isSidebarOpen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                Bộ lọc
              </button>
              <span class="result-count">{{ displayedProducts.length }} sản phẩm</span>
              <!-- Active filters -->
              <div class="active-filters">
                <span v-if="route.query.q" class="active-filter-tag">
                  Tìm kiếm: "{{ route.query.q }}"
                  <button @click="removeSearch">×</button>
                </span>
                <span v-if="selectedBrand" class="active-filter-tag">
                  {{ selectedBrand }}
                  <button @click="selectedBrand = null; applyFilters()">×</button>
                </span>
                <span v-for="cat in selectedCategories" :key="cat" class="active-filter-tag">
                  {{ cat }}
                  <button @click="removeCategory(cat)">×</button>
                </span>
                <span v-if="selectedBadge" class="active-filter-tag">
                  {{ selectedBadge }}
                  <button @click="selectedBadge = null; applyFilters()">×</button>
                </span>
              </div>
            </div>
            <div class="toolbar-right">
              <select v-model="sortBy" @change="applyFilters" class="sort-select">
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="bestseller">Bán chạy</option>
              </select>
              <div class="view-toggle">
                <button :class="{ active: viewMode === 'grid4' }" @click="viewMode = 'grid4'">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="6.5" height="6.5"/><rect x="9.5" y="0" width="6.5" height="6.5"/><rect x="0" y="9.5" width="6.5" height="6.5"/><rect x="9.5" y="9.5" width="6.5" height="6.5"/></svg>
                </button>
                <button :class="{ active: viewMode === 'grid2' }" @click="viewMode = 'grid2'">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="6.5" height="16"/><rect x="9.5" y="0" width="6.5" height="16"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div :class="['products-grid', viewMode === 'grid2' ? 'grid-2' : '']">
            <ProductCard v-for="p in displayedProducts" :key="p.id" :product="p" @quick-view="showQuickView" />
          </div>

          <!-- Empty State -->
          <div v-if="displayedProducts.length === 0" class="empty-state">
            <p>😕 Không tìm thấy sản phẩm phù hợp</p>
            <button class="btn btn-outline" @click="resetAll">Xóa bộ lọc</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <QuickViewModal :product="quickViewProduct" :visible="isQuickViewVisible" @close="isQuickViewVisible = false" />
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHero from '../components/ui/PageHero.vue'
import ProductCard from '../components/product/ProductCard.vue'
import QuickViewModal from '../components/product/QuickViewModal.vue'
import { useProductsStore } from '../stores/products.js'
import { formatPrice } from '../composables/useFormatPrice.js'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

// Quick View State
const quickViewProduct = ref(null)
const isQuickViewVisible = ref(false)
const showQuickView = (product) => {
  quickViewProduct.value = product
  isQuickViewVisible.value = true
}

const selectedBrand = ref(null)
const selectedCategories = ref([])
const selectedSizes = ref([])
const selectedBadge = ref(null)
const sortBy = ref('default')
const priceMin = ref(0)
const priceMax = ref(3000000)
const viewMode = ref('grid4')
const isSidebarOpen = ref(false)

const allSizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44]

const availableCategories = computed(() => {
  const source = selectedBrand.value
    ? productsStore.allProducts.filter(p => p.brand === selectedBrand.value)
    : productsStore.allProducts
  return [...new Set(source.map(p => p.category))]
})

const getBrandCount = (brand) => productsStore.allProducts.filter(p => p.brand === brand).length

const displayedProducts = computed(() => {
  let result = [...productsStore.allProducts]
  if (selectedBrand.value) result = result.filter(p => p.brand === selectedBrand.value)
  if (selectedCategories.value.length) result = result.filter(p => selectedCategories.value.includes(p.category))
  if (selectedSizes.value.length) result = result.filter(p => p.sizes.some(s => selectedSizes.value.includes(s)))
  if (selectedBadge.value) result = result.filter(p => p.badge === selectedBadge.value)
  result = result.filter(p => {
    const price = p.salePrice || p.price
    return price >= priceMin.value && price <= priceMax.value
  })

  const q = route.query.q
  if (q) {
    const qLow = q.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(qLow) || p.category.toLowerCase().includes(qLow))
  }

  switch (sortBy.value) {
    case 'price-asc': result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break
    case 'price-desc': result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break
    case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
    case 'bestseller': result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break
  }
  return result
})

const pageTitle = computed(() => {
  if (route.query.q) return `Kết quả tìm kiếm cho: "${route.query.q}"`
  if (selectedBrand.value) return `Giày ${selectedBrand.value}`
  if (selectedBadge.value === 'NEW') return 'New Arrival'
  if (selectedBadge.value === 'SALE') return 'Sale'
  if (selectedBadge.value === 'HOT') return 'Best Sellers'
  return 'Tất Cả Sản Phẩm'
})

const applyFilters = () => {}
const toggleSize = (size) => {
  const i = selectedSizes.value.indexOf(size)
  if (i === -1) selectedSizes.value.push(size)
  else selectedSizes.value.splice(i, 1)
}
const removeCategory = (cat) => {
  selectedCategories.value = selectedCategories.value.filter(c => c !== cat)
}
const removeSearch = () => {
  const newQuery = { ...route.query }
  delete newQuery.q
  router.push({ path: '/products', query: newQuery })
}
const resetAll = () => {
  selectedBrand.value = null
  selectedCategories.value = []
  selectedSizes.value = []
  selectedBadge.value = null
  sortBy.value = 'default'
  priceMin.value = 0
  priceMax.value = 3000000
  router.push('/products')
}



// Apply URL query params
watch(() => route.query, (q) => {
  selectedBrand.value = q.brand || null
  selectedBadge.value = q.badge || null
  selectedCategories.value = q.category ? [q.category] : []
}, { immediate: true })
</script>

<style scoped>
.products-page { min-height: 100vh; }

.products-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  padding-bottom: 60px;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: calc(var(--topbar-height) + var(--header-height) + 16px);
  height: fit-content;
  max-height: calc(100vh - var(--topbar-height) - var(--header-height) - 32px);
  overflow-y: auto;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.sidebar-header h3 {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.clear-btn {
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-accent);
  cursor: pointer;
  background: none;
  border: none;
  letter-spacing: 0.05em;
}
.clear-btn:hover { text-decoration: underline; }

.filter-group { margin-bottom: 28px; border-top: 1px solid var(--color-gray-200); padding-top: 20px; }
.filter-title {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
  color: var(--color-primary);
}
.filter-options { display: flex; flex-direction: column; gap: 8px; }
.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.88rem;
  color: var(--color-gray-700);
  transition: var(--transition-fast);
}
.filter-label:hover { color: var(--color-primary); }
.filter-label input { accent-color: var(--color-primary); }
.filter-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--color-gray-500);
  background: var(--color-gray-200);
  padding: 1px 6px;
  border-radius: 10px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.size-btn {
  padding: 6px;
  border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-sm);
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: var(--transition-fast);
  background: none;
  text-align: center;
}
.size-btn:hover, .size-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.price-range { display: flex; flex-direction: column; gap: 8px; }
.price-label {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
}
.range-input {
  width: 100%;
  accent-color: var(--color-primary);
}

/* Toolbar */
.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  flex-wrap: wrap;
  gap: 12px;
}
.toolbar-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.toolbar-right { display: flex; align-items: center; gap: 12px; }

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border: 1.5px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: none;
  color: var(--color-primary);
  transition: var(--transition-fast);
  display: none;
}
.filter-toggle:hover { border-color: var(--color-primary); }

.result-count {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  color: var(--color-gray-500);
}
.active-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.active-filter-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--color-primary);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}
.active-filter-tag button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
}
.active-filter-tag button:hover { opacity: 1; }

.sort-select {
  height: 38px;
  border: 1.5px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  padding: 0 32px 0 12px;
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
  background: white;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
.sort-select:focus { border-color: var(--color-primary); }

.view-toggle { display: flex; gap: 4px; }
.view-toggle button {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  background: none;
  color: var(--color-gray-500);
  cursor: pointer;
  transition: var(--transition-fast);
}
.view-toggle button.active, .view-toggle button:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.grid-2 { grid-template-columns: repeat(2, 1fr) !important; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 40px;
  text-align: center;
}
.empty-state p {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--color-gray-500);
}

@media (max-width: 1024px) {
  .products-layout { grid-template-columns: 220px 1fr; gap: 24px; }
}
@media (max-width: 768px) {
  .products-layout { grid-template-columns: 1fr; }
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 300px;
    height: 100vh;
    background: white;
    z-index: 1050;
    padding: 24px;
    transition: left 0.3s ease;
    box-shadow: var(--shadow-xl);
    max-height: 100vh;
  }
  .sidebar.sidebar-open { left: 0; }
  .filter-toggle { display: flex; }
}
</style>
