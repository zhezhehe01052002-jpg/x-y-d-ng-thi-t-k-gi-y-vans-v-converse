<template>
  <main class="history-page">
    <PageHero
      title="Lịch Sử Mua Hàng"
      :crumbs="[{ label: 'Trang chủ', to: '/' }, { label: 'Lịch sử đơn hàng' }]"
    />

    <div class="container">
      <!-- Tabs Filter -->
      <div class="tabs-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.value" 
          :class="['tab-btn', { active: currentTab === tab.value }]"
          @click="currentTab = tab.value"
        >
          {{ tab.label }}
          <span class="tab-count" v-if="getFilteredOrdersCount(tab.value) > 0">
            {{ getFilteredOrdersCount(tab.value) }}
          </span>
        </button>
      </div>

      <!-- Orders List -->
      <div v-if="filteredOrders.length > 0" class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <!-- Order Header -->
          <div class="order-card-header">
            <div class="header-left">
              <span class="order-id">Đơn hàng #{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.date) }}</span>
            </div>
            <div class="header-right">
              <span :class="['status-badge', order.status]">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-card-body">
            <div v-for="(item, idx) in order.items" :key="idx" class="order-item">
              <div class="item-img-wrap">
                <img :src="item.image" :alt="item.name" class="item-img" @error="e => e.target.src='https://via.placeholder.com/80'" />
              </div>
              <div class="item-info">
                <span class="item-brand">{{ item.brand }}</span>
                <p class="item-name">{{ item.name }}</p>
                <div class="item-meta">
                  <span class="size-tag">Size {{ item.size }}</span>
                  <span class="color-dot-sm" :style="{ background: item.color }"></span>
                  <span class="qty-tag">SL: {{ item.quantity }}</span>
                </div>
              </div>
              <div class="item-price">
                <span class="price-val">{{ formatPrice(item.salePrice || item.price) }}</span>
                <span class="price-total">{{ formatPrice((item.salePrice || item.price) * item.quantity) }}</span>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="order-card-footer">
            <div class="footer-left">
              <div class="payment-info">
                <span>Phương thức: </span>
                <strong>{{ getPaymentMethodLabel(order.paymentMethod) }}</strong>
              </div>
              <div v-if="order.shippingAddress" class="address-info">
                <span>Giao đến: </span>
                <strong>{{ order.shippingAddress.name }} ({{ order.shippingAddress.phone }}) - {{ order.shippingAddress.address }}</strong>
              </div>
            </div>
            <div class="footer-right">
              <div class="price-summary">
                <div class="summary-line" v-if="order.discount > 0">
                  <span>Giảm giá: </span>
                  <span class="discount-val">-{{ formatPrice(order.discount) }}</span>
                </div>
                <div class="summary-line total">
                  <span>Tổng tiền: </span>
                  <span class="total-val">{{ formatPrice(order.totalPrice) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="action-buttons">
                <button 
                  v-if="order.status === 'processing'" 
                  class="btn btn-outline cancel-btn"
                  @click="openCancelConfirm(order.id)"
                >
                  Hủy đơn hàng
                </button>
                <button 
                  class="btn btn-primary reorder-btn"
                  @click="reorder(order)"
                >
                  Mua lại đơn này
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-orders">
        <div class="empty-icon">📦</div>
        <h2 class="empty-title">Không tìm thấy đơn hàng</h2>
        <p class="empty-desc">Bạn chưa có đơn hàng nào ở trạng thái này.</p>
        <router-link to="/products" class="btn btn-primary">Mua sắm ngay</router-link>
      </div>
    </div>

    <!-- Confirm Cancel Modal -->
    <transition name="modal-fade">
      <div v-if="showCancelModal" class="modal-overlay" @click.self="closeCancelConfirm">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">Xác nhận hủy đơn hàng</h3>
            <button class="modal-close" @click="closeCancelConfirm">✕</button>
          </div>
          <div class="modal-body">
            <div class="warning-icon">⚠️</div>
            <p class="warning-desc">Bạn có chắc chắn muốn hủy đơn hàng <strong>#{{ orderToCancel }}</strong> không? Hành động này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="closeCancelConfirm">Quay lại</button>
            <button class="btn btn-accent" @click="confirmCancel">Xác nhận hủy</button>
          </div>
        </div>
      </div>
    </transition>

  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageHero from '../components/ui/PageHero.vue'
import { useOrdersStore } from '../stores/orders.js'
import { useCartStore } from '../stores/cart.js'
import { formatPrice } from '../composables/useFormatPrice.js'
import { useToastStore } from '../stores/toast.js'
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '../constants/index.js'

const ordersStore = useOrdersStore()
const cartStore = useCartStore()
const toastStore = useToastStore()

const currentTab = ref('all')
const showCancelModal = ref(false)
const orderToCancel = ref(null)

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang xử lý', value: 'processing' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Đã hủy', value: 'cancelled' }
]

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') {
    return ordersStore.userOrders
  }
  return ordersStore.userOrders.filter(order => order.status === currentTab.value)
})

const getFilteredOrdersCount = (status) => {
  if (status === 'all') return ordersStore.userOrders.length
  return ordersStore.userOrders.filter(order => order.status === status).length
}

const formatDate = (isoString) => {
  const d = new Date(isoString)
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}



const getStatusLabel = (status) => ORDER_STATUS_LABELS[status] || status

const getPaymentMethodLabel = (method) => PAYMENT_METHOD_LABELS[method] || method

const openCancelConfirm = (orderId) => {
  orderToCancel.value = orderId
  showCancelModal.value = true
}

const closeCancelConfirm = () => {
  showCancelModal.value = false
  orderToCancel.value = null
}

const confirmCancel = () => {
  if (orderToCancel.value) {
      ordersStore.cancelOrder(orderToCancel.value)
    toastStore.add(`Đã hủy thành công đơn hàng #${orderToCancel.value}`, 'success')
    closeCancelConfirm()
  }
}

const reorder = (order) => {
  order.items.forEach(item => {
    cartStore.addToCart(item, item.size, item.color, item.quantity)
  })
  toastStore.add('Đã thêm tất cả sản phẩm vào giỏ hàng!', 'success')
  cartStore.toggleCart()
}


</script>

<style scoped>
.history-page {
  min-height: 100vh;
  padding-bottom: 80px;
  background: var(--color-gray-100);
}


/* Tabs Filter */
.tabs-container {
  display: flex;
  background: white;
  border-radius: var(--radius-md);
  padding: 6px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
  gap: 4px;
}
.tab-btn {
  flex: 1;
  text-align: center;
  padding: 12px 16px;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-gray-700);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}
.tab-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-primary);
}
.tab-btn.active {
  background: var(--color-primary);
  color: white;
}
.tab-count {
  font-size: 0.72rem;
  background: var(--color-accent);
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: var(--transition);
}
.order-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-gray-300);
}

/* Card Header */
.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--color-gray-100);
  border-bottom: 1px solid var(--color-gray-200);
}
.order-id {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-primary);
}
.order-date {
  font-size: 0.82rem;
  color: var(--color-gray-500);
  margin-left: 12px;
}
.status-badge {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.03em;
}
.status-badge.processing {
  background: #eff6ff;
  color: #2563eb;
}
.status-badge.delivered {
  background: #f0fdf4;
  color: #16a34a;
}
.status-badge.cancelled {
  background: #fef2f2;
  color: #dc2626;
}

/* Card Body */
.order-card-body {
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-gray-200);
}
.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--color-gray-200);
}
.order-item:last-child {
  border-bottom: none;
}
.item-img-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  flex-shrink: 0;
}
.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-info {
  flex: 1;
  min-width: 0;
}
.item-brand {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  display: block;
}
.item-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2px 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.size-tag {
  font-size: 0.72rem;
  background: var(--color-gray-100);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--color-gray-700);
}
.color-dot-sm {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
}
.qty-tag {
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

.item-price {
  text-align: right;
  flex-shrink: 0;
}
.price-val {
  display: block;
  font-size: 0.75rem;
  color: var(--color-gray-500);
}
.price-total {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 2px;
}

/* Card Footer */
.order-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  gap: 24px;
}
.footer-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--color-gray-600);
}
.address-info {
  line-height: 1.4;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}
.price-summary {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.summary-line {
  font-size: 0.82rem;
  color: var(--color-gray-500);
}
.summary-line.total {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-primary);
}
.total-val {
  font-size: 1.15rem;
  color: var(--color-accent);
}

.action-buttons {
  display: flex;
  gap: 10px;
}
.action-buttons .btn {
  padding: 10px 20px;
  font-size: 0.75rem;
  height: 38px;
}

/* Empty State */
.empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  text-align: center;
  gap: 16px;
}
.empty-icon {
  font-size: 4rem;
}
.empty-title {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--color-primary);
}
.empty-desc {
  color: var(--color-gray-500);
  margin-bottom: 8px;
}


/* Responsive */
@media (max-width: 768px) {
  .order-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
  }
  .order-date {
    margin-left: 0;
    display: block;
    margin-top: 2px;
  }
  .order-card-body {
    padding: 12px 16px;
  }
  .order-card-footer {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
  .footer-right {
    align-items: stretch;
    width: 100%;
  }
  .price-summary {
    text-align: left;
    border-bottom: 1px dashed var(--color-gray-200);
    padding-bottom: 12px;
  }
  .action-buttons {
    justify-content: flex-end;
  }
}

/* Cancel Modal — scoped overrides */
.modal-box { max-width: 440px; }
.modal-close {
  font-size: 1.1rem;
  color: var(--color-gray-500);
  cursor: pointer;
}
.modal-body {
  padding: 24px;
  text-align: center;
}
.warning-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}
.warning-desc {
  font-size: 0.88rem;
  color: var(--color-gray-700);
  line-height: 1.5;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  background: var(--color-gray-100);
  border-top: 1px solid var(--color-gray-200);
}
.modal-footer .btn {
  padding: 8px 16px;
  font-size: 0.72rem;
  height: 34px;
}
</style>
