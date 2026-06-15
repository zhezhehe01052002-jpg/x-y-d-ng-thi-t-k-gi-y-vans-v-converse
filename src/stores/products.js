import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { products as rawProducts } from '../data/products.js'

export const useProductsStore = defineStore('products', () => {
  const allProducts = ref(rawProducts)
  const selectedBrand = ref(null)
  const selectedCategories = ref([])
  const selectedSizes = ref([])
  const priceRange = ref([0, 5000000])
  const sortBy = ref('default')
  const searchQuery = ref('')

  // ── Getters: Data queries ──
  const getBrands = computed(() => [...new Set(allProducts.value.map(p => p.brand))])

  const getCategories = computed(() => (brand = null) => {
    const source = brand ? allProducts.value.filter(p => p.brand === brand) : allProducts.value
    return [...new Set(source.map(p => p.category))]
  })

  const getSizes = computed(() => {
    const sizes = allProducts.value.flatMap(p => p.sizes)
    return [...new Set(sizes)].sort((a, b) => a - b)
  })

  const getProductById = (id) => allProducts.value.find(p => p.id === Number(id))

  const getRelatedProducts = (id, brand, limit = 4) => {
    return allProducts.value
      .filter(p => p.id !== Number(id) && p.brand === brand)
      .slice(0, limit)
  }

  const newArrivals = computed(() =>
    allProducts.value.filter(p => p.isNew || p.badge === 'NEW').slice(0, 4)
  )

  const bestSellers = computed(() =>
    allProducts.value.filter(p => p.isBestSeller || p.badge === 'HOT')
  )

  // ── Getters: Filtered products ──
  const filteredProducts = computed(() => {
    let result = [...allProducts.value]

    if (selectedBrand.value) {
      result = result.filter(p => p.brand === selectedBrand.value)
    }
    if (selectedCategories.value.length > 0) {
      result = result.filter(p => selectedCategories.value.includes(p.category))
    }
    if (selectedSizes.value.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.value.includes(s)))
    }
    result = result.filter(p => {
      const price = p.salePrice || p.price
      return price >= priceRange.value[0] && price <= priceRange.value[1]
    })
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    }

    switch (sortBy.value) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'bestseller':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
        break
    }

    return result
  })

  // ── Actions ──
  const setBrand = (brand) => { selectedBrand.value = brand; selectedCategories.value = [] }
  const toggleCategory = (cat) => {
    const i = selectedCategories.value.indexOf(cat)
    if (i === -1) selectedCategories.value.push(cat)
    else selectedCategories.value.splice(i, 1)
  }
  const toggleSize = (size) => {
    const i = selectedSizes.value.indexOf(size)
    if (i === -1) selectedSizes.value.push(size)
    else selectedSizes.value.splice(i, 1)
  }
  const resetFilters = () => {
    selectedBrand.value = null
    selectedCategories.value = []
    selectedSizes.value = []
    priceRange.value = [0, 5000000]
    sortBy.value = 'default'
    searchQuery.value = ''
  }

  // ── Stock management ──
  const updateStock = (id, qtyToReduce) => {
    const product = allProducts.value.find(p => p.id === Number(id))
    if (product) {
      product.stock = Math.max(0, product.stock - qtyToReduce)
    }
  }

  return {
    allProducts,
    selectedBrand,
    selectedCategories,
    selectedSizes,
    priceRange,
    sortBy,
    searchQuery,
    filteredProducts,
    getBrands,
    getCategories,
    getSizes,
    getProductById,
    getRelatedProducts,
    newArrivals,
    bestSellers,
    setBrand,
    toggleCategory,
    toggleSize,
    resetFilters,
    updateStock
  }
})
