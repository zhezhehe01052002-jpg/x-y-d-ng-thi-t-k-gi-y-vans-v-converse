<template>
  <header class="app-header" :class="{ 'scrolled': isScrolled }">
    <!-- Main Header -->
    <div class="header-main">
      <div class="container">
        <div class="header-inner">
          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen" :class="{ active: isMobileMenuOpen }">
            <span></span><span></span><span></span>
          </button>

          <!-- Logo -->
          <router-link to="/" class="logo">
            <div class="logo-icon">SB</div>
            <div class="logo-text">
              <span class="logo-name">SNEAKER</span>
              <span class="logo-sub">BUZZ</span>
            </div>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="nav-desktop">
            <ul class="nav-list">
              <li class="nav-item">
                <router-link to="/" class="nav-link" exact-active-class="active">Trang Chủ</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/about" class="nav-link" exact-active-class="active">Giới Thiệu</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/order-history" class="nav-link" exact-active-class="active">Đơn Hàng</router-link>
              </li>
              <li class="nav-item has-mega">
                <router-link to="/products?brand=VANS" class="nav-link vans-link">
                  VANS <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
                </router-link>
                <div class="mega-menu vans-mega">
                  <div class="mega-inner">
                    <div class="mega-col">
                      <p class="mega-title">Dòng Sản Phẩm</p>
                      <ul>
                        <li v-for="cat in vansCategories" :key="cat">
                          <router-link :to="`/products?brand=VANS&category=${cat}`">{{ cat }}</router-link>
                        </li>
                      </ul>
                    </div>
                    <div class="mega-col">
                      <p class="mega-title">Bộ Sưu Tập</p>
                      <ul>
                        <li><router-link to="/products?brand=VANS&badge=NEW">Mới Về</router-link></li>
                        <li><router-link to="/products?brand=VANS&badge=HOT">Best Seller</router-link></li>
                        <li><router-link to="/products?brand=VANS&badge=SALE">Khuyến Mãi</router-link></li>
                      </ul>
                    </div>
                    <div class="mega-banner">
                      <div class="mega-banner-img vans-banner-img">
                        <span>VANS</span>
                        <p>Off The Wall Since 1966</p>
                        <router-link to="/products?brand=VANS" class="btn btn-outline" style="color:white;border-color:white;">Shop Now</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="nav-item has-mega">
                <router-link to="/products?brand=CONVERSE" class="nav-link converse-link">
                  CONVERSE <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
                </router-link>
                <div class="mega-menu converse-mega">
                  <div class="mega-inner">
                    <div class="mega-col">
                      <p class="mega-title">Dòng Sản Phẩm</p>
                      <ul>
                        <li v-for="cat in converseCategories" :key="cat">
                          <router-link :to="`/products?brand=CONVERSE&category=${cat}`">{{ cat }}</router-link>
                        </li>
                      </ul>
                    </div>
                    <div class="mega-col">
                      <p class="mega-title">Bộ Sưu Tập</p>
                      <ul>
                        <li><router-link to="/products?brand=CONVERSE&badge=NEW">Mới Về</router-link></li>
                        <li><router-link to="/products?brand=CONVERSE&badge=HOT">Best Seller</router-link></li>
                        <li><router-link to="/products?brand=CONVERSE&badge=SALE">Khuyến Mãi</router-link></li>
                      </ul>
                    </div>
                    <div class="mega-banner">
                      <div class="mega-banner-img converse-banner-img">
                        <span>CONVERSE</span>
                        <p>Chuck Taylor All Star</p>
                        <router-link to="/products?brand=CONVERSE" class="btn btn-outline" style="color:white;border-color:white;">Shop Now</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="nav-item">
                <router-link to="/products?badge=NEW" class="nav-link new-link">New Arrival</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/products?badge=SALE" class="nav-link sale-link">SALE 🔥</router-link>
              </li>
            </ul>
          </nav>

          <!-- Right Actions -->
          <div class="header-actions">
            <!-- Search -->
            <div class="search-wrap" :class="{ expanded: isSearchOpen }" ref="searchWrapRef">
              <button class="icon-btn" @click="toggleSearch" aria-label="Tìm kiếm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <input
                v-if="isSearchOpen"
                ref="searchInput"
                v-model="searchTerm"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="search-input"
                @input="handleSearchInput"
                @keyup.enter="doSearch"
                @keyup.esc="closeSearch"
              />

              <!-- Suggestions Dropdown -->
              <div v-if="isSearchOpen && showSuggestions && suggestedProducts.length > 0" class="search-suggestions-dropdown">
                <div class="suggestions-list">
                  <router-link
                    v-for="p in suggestedProducts"
                    :key="p.id"
                    :to="`/products/${p.id}`"
                    class="suggestion-item"
                    @click="selectSuggestion"
                  >
                    <img :src="p.image" :alt="p.name" class="suggestion-img" />
                    <div class="suggestion-info">
                      <span class="suggestion-brand">{{ p.brand }}</span>
                      <p class="suggestion-name">{{ p.name }}</p>
                      <div class="suggestion-price">
                        <span v-if="p.salePrice" class="sale-price">{{ formatPrice(p.salePrice) }}</span>
                        <span :class="{ 'original-price': p.salePrice, 'regular-price': !p.salePrice }">{{ formatPrice(p.price) }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="suggestions-footer">
                  <button class="view-all-results-btn" @click="doSearch">
                    Xem tất cả kết quả cho "{{ searchTerm }}"
                  </button>
                </div>
              </div>
            </div>

            <!-- User Authentication -->
            <router-link v-if="!authStore.isAuthenticated" to="/login" class="icon-btn user-btn-header" aria-label="Đăng nhập" title="Đăng nhập / Đăng ký">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </router-link>
            
            <div v-else class="user-dropdown-wrap" ref="userDropdownRef">
              <button class="user-avatar-btn" @click="isUserDropdownOpen = !isUserDropdownOpen" :title="authStore.user?.name">
                <div class="user-avatar-char">
                  {{ authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'U' }}
                </div>
              </button>
              <transition name="dropdown-fade">
                <div v-show="isUserDropdownOpen" class="user-dropdown-menu">
                  <div class="dropdown-user-info">
                    <p class="dp-name">{{ authStore.user?.name }}</p>
                    <p class="dp-email">{{ authStore.user?.email }}</p>
                  </div>
                  <div class="dropdown-divider"></div>
                  <router-link to="/order-history" class="dropdown-link-item" @click="isUserDropdownOpen = false">
                    📦 Đơn hàng của tôi
                  </router-link>
                  <router-link to="/wishlist" class="dropdown-link-item" @click="isUserDropdownOpen = false">
                    ❤️ Sản phẩm yêu thích
                  </router-link>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-btn-item logout-btn" @click="handleLogout">
                    🚪 Đăng xuất
                  </button>
                </div>
              </transition>
            </div>

            <!-- Wishlist -->
            <router-link to="/wishlist" class="icon-btn wishlist-btn-header" aria-label="Yêu thích">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="wishlist-badge" v-if="wishlistStore.items.length > 0">{{ wishlistStore.items.length }}</span>
            </router-link>

            <!-- Cart -->
            <button class="icon-btn cart-btn" @click="cartStore.toggleCart()" aria-label="Giỏ hàng">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span class="cart-badge" v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ open: isMobileMenuOpen }">
      <nav>
        <ul class="mobile-nav-list">
          <!-- Mobile Auth Section -->
          <li class="mobile-user-section">
            <div v-if="authStore.isAuthenticated" class="mobile-logged-in-box">
              <div class="m-user-avatar">
                {{ authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'U' }}
              </div>
              <div class="m-user-meta">
                <p class="m-user-name">{{ authStore.user?.name }}</p>
                <p class="m-user-email">{{ authStore.user?.email }}</p>
              </div>
              <button class="m-logout-btn" @click="handleLogoutMobile" title="Đăng xuất">
                🚪
              </button>
            </div>
            <router-link v-else to="/login" class="mobile-login-link" @click="isMobileMenuOpen = false">
              🔑 Đăng Nhập / Đăng Ký
            </router-link>
          </li>

          <!-- Mobile Search Bar -->
          <li class="mobile-search-item">
            <div class="mobile-search-wrap">
              <input
                v-model="mobileSearchTerm"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="mobile-search-input"
                @input="handleMobileSearchInput"
                @keyup.enter="doMobileSearch"
              />
              <button class="mobile-search-btn" @click="doMobileSearch" aria-label="Tìm kiếm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>
          </li>

          <li><router-link to="/" @click="isMobileMenuOpen=false">🏠 Trang Chủ</router-link></li>
          <li><router-link to="/about" @click="isMobileMenuOpen=false">ℹ️ Giới Thiệu</router-link></li>
          <li><router-link to="/order-history" @click="isMobileMenuOpen=false">📦 Đơn Hàng Của Tôi</router-link></li>
          <li class="mobile-has-sub" @click="toggleMobileSub('vans')">
            <span>👟 VANS <svg width="10" height="6" viewBox="0 0 10 6" :style="{transform: mobileSub==='vans'?'rotate(180deg)':''}"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></span>
            <ul v-show="mobileSub === 'vans'" class="mobile-sub">
              <li v-for="cat in vansCategories" :key="cat">
                <router-link :to="`/products?brand=VANS&category=${cat}`" @click="isMobileMenuOpen=false">{{ cat }}</router-link>
              </li>
            </ul>
          </li>
          <li class="mobile-has-sub" @click="toggleMobileSub('converse')">
            <span>⭐ CONVERSE <svg width="10" height="6" viewBox="0 0 10 6" :style="{transform: mobileSub==='converse'?'rotate(180deg)':''}"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></span>
            <ul v-show="mobileSub === 'converse'" class="mobile-sub">
              <li v-for="cat in converseCategories" :key="cat">
                <router-link :to="`/products?brand=CONVERSE&category=${cat}`" @click="isMobileMenuOpen=false">{{ cat }}</router-link>
              </li>
            </ul>
          </li>
          <li><router-link to="/products?badge=NEW" @click="isMobileMenuOpen=false">🆕 New Arrival</router-link></li>
          <li><router-link to="/products?badge=SALE" @click="isMobileMenuOpen=false">🔥 SALE</router-link></li>
        </ul>
      </nav>
    </div>
    <div v-if="isMobileMenuOpen" class="overlay" @click="isMobileMenuOpen=false"></div>
  </header>
  <div class="header-spacer"></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../../stores/cart.js'
import { useWishlistStore } from '../../stores/wishlist.js'
import { useProductsStore } from '../../stores/products.js'
import { useAuthStore } from '../../stores/auth.js'
import { useToastStore } from '../../stores/toast.js'
import { formatPrice } from '../../composables/useFormatPrice.js'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productsStore = useProductsStore()
const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()
const route = useRoute()

const isScrolled = ref(false)
const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)
const mobileSub = ref(null)
const searchTerm = ref('')
const mobileSearchTerm = ref('')
const searchInput = ref(null)
const isUserDropdownOpen = ref(false)
const userDropdownRef = ref(null)
const searchWrapRef = ref(null)
const showSuggestions = ref(false)

watch(() => route.query.q, (newQ) => {
  searchTerm.value = newQ || ''
  mobileSearchTerm.value = newQ || ''
  if (!newQ) {
    showSuggestions.value = false
  }
}, { immediate: true })

const vansCategories = computed(() => [...new Set(productsStore.allProducts.filter(p => p.brand === 'VANS').map(p => p.category))])
const converseCategories = computed(() => [...new Set(productsStore.allProducts.filter(p => p.brand === 'CONVERSE').map(p => p.category))])

const suggestedProducts = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()
  if (!query) return []
  return productsStore.allProducts
    .filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    .slice(0, 5)
})

const handleSearchInput = () => {
  showSuggestions.value = searchTerm.value.trim().length > 0
  const queryVal = searchTerm.value.trim()
  if (route.path === '/products') {
    router.replace({
      path: '/products',
      query: { ...route.query, q: queryVal || undefined }
    })
  } else if (queryVal) {
    router.push({
      path: '/products',
      query: { ...route.query, q: queryVal }
    })
  }
}

const handleMobileSearchInput = () => {
  const queryVal = mobileSearchTerm.value.trim()
  if (route.path === '/products') {
    router.replace({
      path: '/products',
      query: { ...route.query, q: queryVal || undefined }
    })
  } else if (queryVal) {
    router.push({
      path: '/products',
      query: { ...route.query, q: queryVal }
    })
  }
}

const selectSuggestion = () => {
  showSuggestions.value = false
  isSearchOpen.value = false
  searchTerm.value = ''
}

const closeSearch = () => {
  isSearchOpen.value = false
  showSuggestions.value = false
  searchTerm.value = ''
}

const handleScroll = () => { isScrolled.value = window.scrollY > 50 }

const toggleSearch = async () => {
  if (isSearchOpen.value && searchTerm.value.trim()) {
    doSearch()
    return
  }
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const doSearch = () => {
  if (searchTerm.value.trim()) {
    router.push(`/products?q=${encodeURIComponent(searchTerm.value)}`)
    isSearchOpen.value = false
    showSuggestions.value = false
    searchTerm.value = ''
  }
}

const doMobileSearch = () => {
  if (mobileSearchTerm.value.trim()) {
    router.push(`/products?q=${encodeURIComponent(mobileSearchTerm.value)}`)
    isMobileMenuOpen.value = false
    mobileSearchTerm.value = ''
  }
}

const toggleMobileSub = (key) => {
  mobileSub.value = mobileSub.value === key ? null : key
}

const handleLogout = () => {
  isUserDropdownOpen.value = false
  authStore.logout()
  toastStore.showToast('Đã đăng xuất thành công.', 'success')
  
  // Luôn đưa về trang đăng nhập khi đăng xuất
  router.push('/login')
}

const handleLogoutMobile = () => {
  isMobileMenuOpen.value = false
  authStore.logout()
  toastStore.showToast('Đã đăng xuất thành công.', 'success')
  
  // Luôn đưa về trang đăng nhập khi đăng xuất
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    isUserDropdownOpen.value = false
  }
  if (searchWrapRef.value && !searchWrapRef.value.contains(event.target)) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: var(--transition);
}

.header-spacer {
  height: calc(var(--topbar-height) + var(--header-height));
}

/* Topbar */
.topbar {
  background: var(--color-primary);
  color: white;
  height: var(--topbar-height);
}
.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.topbar-text {
  font-size: 0.78rem;
  letter-spacing: 0.02em;
}
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-link { font-size: 0.78rem; color: rgba(255,255,255,0.8); transition: var(--transition-fast); }
.topbar-link:hover { color: white; }
.topbar-divider { color: rgba(255,255,255,0.3); }

/* Main Header */
.header-main {
  background: white;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  transition: var(--transition);
}
.scrolled .header-main {
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}
.header-inner {
  display: flex;
  align-items: center;
  height: var(--header-height);
  gap: 24px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
}
.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}
.logo-name {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: var(--color-primary);
}
.logo-sub {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-accent);
}

/* Desktop Nav */
.nav-desktop { flex: 1; }
.nav-list {
  display: flex;
  align-items: center;
  gap: 4px;
  height: var(--header-height);
}
.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-primary);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  height: 100%;
}
.nav-link:hover, .nav-link.active { color: var(--color-accent); }
.nav-link.vans-link:hover { color: var(--color-vans); }
.nav-link.converse-link:hover { color: var(--color-converse); }
.nav-link.sale-link { color: var(--color-accent); }
.nav-link.new-link { color: var(--color-vans); }

/* Mega Menu */
.has-mega:hover .mega-menu { opacity: 1; visibility: visible; transform: translateY(0); }

.mega-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  width: 680px;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 3px solid var(--color-primary);
  z-index: 100;
  pointer-events: none;
}
.has-mega:hover .mega-menu { pointer-events: all; }

.vans-mega { border-top-color: var(--color-vans); }
.converse-mega { border-top-color: var(--color-converse); }

.mega-inner {
  display: grid;
  grid-template-columns: 1fr 1fr 220px;
  padding: 24px;
  gap: 24px;
}
.mega-title {
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin-bottom: 12px;
}
.mega-col ul { display: flex; flex-direction: column; gap: 6px; }
.mega-col a {
  font-size: 0.88rem;
  color: var(--color-gray-700);
  transition: var(--transition-fast);
  padding: 2px 0;
  display: block;
}
.mega-col a:hover { color: var(--color-accent); padding-left: 4px; }

.mega-banner { }
.mega-banner-img {
  height: 160px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
.mega-banner-img::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}
.mega-banner-img > * { position: relative; z-index: 1; color: white; }
.mega-banner-img span {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 1.4rem;
  letter-spacing: 0.1em;
}
.mega-banner-img p { font-size: 0.75rem; opacity: 0.8; margin-bottom: 8px; }

.vans-banner-img {
  background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);
}
.converse-banner-img {
  background: linear-gradient(135deg, #c1121f 0%, #6b0010 100%);
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  transition: var(--transition-fast);
  position: relative;
}
.icon-btn:hover { background: var(--color-gray-100); color: var(--color-accent); }

.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background: var(--color-accent);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1s ease 2;
}

.wishlist-btn-header {
  position: relative;
}
.wishlist-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background: var(--color-accent);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1s ease 2;
}

.search-wrap { display: flex; align-items: center; gap: 8px; }
.search-input {
  width: 220px;
  height: 38px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  font-size: 0.88rem;
  outline: none;
  transition: var(--transition-fast);
  animation: fadeIn 0.2s ease;
}
.search-input:focus { border-color: var(--color-primary); }

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 32px;
  padding: 4px;
}
.mobile-menu-btn span {
  display: block;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
  transition: var(--transition);
  transform-origin: center;
}
.mobile-menu-btn.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.mobile-menu-btn.active span:nth-child(2) { opacity: 0; }
.mobile-menu-btn.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: calc(var(--topbar-height) + var(--header-height));
  left: -100%;
  width: min(320px, 85vw);
  height: calc(100vh - var(--topbar-height) - var(--header-height));
  background: white;
  z-index: 999;
  overflow-y: auto;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-xl);
}
.mobile-menu.open { left: 0; }

.mobile-nav-list { padding: 16px 0; }
.mobile-nav-list > li {
  border-bottom: 1px solid var(--color-gray-200);
}
.mobile-nav-list > li > a,
.mobile-nav-list > li > span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  transition: var(--transition-fast);
}
.mobile-nav-list > li > a:hover,
.mobile-nav-list > li > span:hover { color: var(--color-accent); background: var(--color-gray-100); }

.mobile-has-sub > span svg { transition: transform 0.25s ease; }
.mobile-sub { background: var(--color-gray-100); }
.mobile-sub li a {
  display: block;
  padding: 10px 20px 10px 36px;
  font-size: 0.85rem;
  color: var(--color-gray-700);
  transition: var(--transition-fast);
  border-bottom: 1px solid var(--color-gray-200);
}
.mobile-sub li a:hover { color: var(--color-accent); }

@media (max-width: 1024px) {
  .nav-desktop { display: none; }
  .mobile-menu-btn { display: flex; }
  .topbar-text { font-size: 0.72rem; }
  .search-input { width: 160px; }
}

@media (max-width: 480px) {
  .topbar-right { display: none; }
  .search-wrap { display: none; }
}

/* User dropdown CSS */
.user-dropdown-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.user-avatar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.user-avatar-btn:hover {
  background: var(--color-gray-100);
}

.user-avatar-char {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  width: 240px;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
  z-index: 1001;
  padding: 8px 0;
}

.dropdown-user-info {
  padding: 12px 16px;
}

.dp-name {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 0.9rem;
  margin-bottom: 2px;
  word-break: break-all;
}

.dp-email {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  word-break: break-all;
}

.dropdown-link-item {
  display: block;
  padding: 10px 16px;
  font-size: 0.85rem;
  color: var(--color-gray-700);
  transition: var(--transition-fast);
  text-decoration: none;
}

.dropdown-link-item:hover {
  background: var(--color-gray-50);
  color: var(--color-accent);
}

.dropdown-btn-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  font-size: 0.85rem;
  color: var(--color-gray-700);
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.dropdown-btn-item:hover {
  background: var(--color-gray-50);
  color: #dc2626;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobile User Panel */
.mobile-user-section {
  padding: 16px 20px;
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
}

.mobile-logged-in-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.m-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.m-user-meta {
  flex-grow: 1;
  min-width: 0;
}

.m-user-name {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 0.88rem;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-user-email {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  font-size: 1.1rem;
}

.m-logout-btn:hover {
  background: var(--color-gray-200);
}

.mobile-login-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: white;
  border: 1.5px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
  text-align: center;
  transition: var(--transition-fast);
}

.mobile-login-link:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Suggestions Dropdown */
.search-wrap {
  position: relative;
}
.search-suggestions-dropdown {
  position: absolute;
  top: 105%;
  right: 0;
  width: 380px;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
  z-index: 1000;
  overflow: hidden;
  animation: scaleUp 0.2s ease;
}

.suggestions-list {
  max-height: 360px;
  overflow-y: auto;
  padding: 8px 0;
}

.suggestion-item {
  display: flex;
  gap: 12px;
  padding: 10px 16px;
  transition: var(--transition-fast);
  text-decoration: none;
  border-bottom: 1px solid var(--color-gray-100);
}
.suggestion-item:last-child {
  border-bottom: none;
}
.suggestion-item:hover {
  background: var(--color-gray-50);
}

.suggestion-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--color-gray-100);
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  text-align: left;
}

.suggestion-brand {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 2px;
  display: block;
}

.suggestion-name {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
  line-height: 1.2;
}

.suggestion-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 700;
}

.sale-price {
  color: var(--color-accent);
}
.original-price {
  color: var(--color-gray-400);
  text-decoration: line-through;
  font-size: 0.72rem;
  font-weight: 500;
}
.regular-price {
  color: var(--color-primary);
}

.suggestions-footer {
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
  padding: 8px 16px;
  text-align: center;
}

.view-all-results-btn {
  background: none;
  border: none;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
  transition: var(--transition-fast);
}
.view-all-results-btn:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

/* Mobile Search Styling */
.mobile-search-item {
  padding: 12px 20px;
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
}
.mobile-search-wrap {
  display: flex;
  align-items: center;
  position: relative;
}
.mobile-search-input {
  width: 100%;
  height: 40px;
  border: 1.5px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  padding: 0 44px 0 12px;
  font-size: 0.88rem;
  outline: none;
  background: white;
  transition: var(--transition-fast);
}
.mobile-search-input:focus {
  border-color: var(--color-primary);
}
.mobile-search-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 40px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary);
  transition: var(--transition-fast);
}
.mobile-search-btn:hover {
  color: var(--color-accent);
}
</style>
