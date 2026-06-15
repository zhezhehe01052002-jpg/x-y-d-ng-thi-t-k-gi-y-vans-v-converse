<template>
  <main class="cart-page">
    <PageHero
      title="Giỏ Hàng"
      :crumbs="[{ label: 'Trang chủ', to: '/' }, { label: 'Giỏ hàng' }]"
    />

    <div class="container">
      <div v-if="cartItems.length > 0" class="cart-layout">
        <!-- ── Cart Items ── -->
        <div class="cart-items">
          <div class="cart-header">
            <span class="cart-title">Sản phẩm ({{ cartItems.length }})</span>
            <button class="clear-all-btn" @click="clearCart">Xóa tất cả</button>
          </div>

          <transition-group name="cart-item" tag="div" class="items-list">
            <div v-for="item in cartItems" :key="item.id + '-' + item.size + '-' + item.color" class="cart-item-card">
              <div class="item-img-wrap">
                <img :src="item.image" :alt="item.name" class="item-img" />
              </div>
              <div class="item-details">
                <span class="item-brand">{{ item.brand }}</span>
                <p class="item-name">{{ item.name }}</p>
                <div class="item-meta">
                  <span class="meta-tag">Size: {{ item.size }}</span>
                  <span class="meta-dot" :style="{ background: item.color }"></span>
                </div>
                <div class="item-price-row">
                  <span class="item-price">{{ formatPrice(item.salePrice || item.price) }}</span>
                  <div class="item-qty">
                    <button @click="dec(item)" class="qty-btn">−</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="inc(item)" class="qty-btn">+</button>
                  </div>
                  <span class="item-total">{{ formatPrice((item.salePrice || item.price) * item.quantity) }}</span>
                </div>
              </div>
              <button class="remove-btn" @click="remove(item)" title="Xóa">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </transition-group>

          <router-link to="/products" class="continue-link">← Tiếp tục mua sắm</router-link>
        </div>

        <!-- ── Order Summary ── -->
        <div class="order-summary">
          <h3 class="summary-title">Tóm Tắt Đơn Hàng</h3>

          <div class="summary-rows">
            <div class="summary-row">
              <span>Tạm tính</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Phí vận chuyển</span>
              <span class="free-ship">Miễn phí</span>
            </div>
            <div class="summary-row discount-row" v-if="promoDiscount > 0">
              <span>Giảm giá ({{ promoCode }})</span>
              <span class="discount-val">-{{ formatPrice(promoDiscount) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total-row">
              <span>Tổng cộng</span>
              <span class="total-price">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Promo -->
          <div class="promo-section">
            <p class="promo-label">Mã khuyến mãi</p>
            <div class="promo-input-row">
              <input v-model="promoInput" type="text" placeholder="SALE10 / BUZZ20" class="promo-input" @keydown.enter="applyPromo" />
              <button class="promo-apply-btn" @click="applyPromo">Áp dụng</button>
            </div>
            <p v-if="promoMsg" :class="['promo-msg', promoOk ? 'promo-ok' : 'promo-err']">{{ promoMsg }}</p>
          </div>

          <!-- ── Payment Method Selector ── -->
          <div class="payment-select-section">
            <p class="payment-select-label">Chọn phương thức thanh toán</p>
            <div class="payment-methods-grid">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                :class="['pm-card', { active: selectedPayment === method.id }]"
                @click="selectedPayment = method.id"
                :id="`pay-${method.id}`"
              >
                <span class="pm-icon">{{ method.icon }}</span>
                <span class="pm-name">{{ method.name }}</span>
                <span class="pm-desc">{{ method.desc }}</span>
                <span v-if="selectedPayment === method.id" class="pm-check">✓</span>
              </button>
            </div>
          </div>

          <button class="btn btn-primary checkout-btn" @click="handleCheckout" :disabled="!selectedPayment">
            <span v-if="selectedPayment">
              Thanh toán qua {{ paymentMethods.find(m => m.id === selectedPayment)?.name }}
            </span>
            <span v-else>Chọn phương thức thanh toán</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div class="secure-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Thanh toán bảo mật SSL 256-bit
          </div>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2 class="empty-title">Giỏ hàng trống</h2>
        <p class="empty-desc">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <router-link to="/products" class="btn btn-primary">Khám phá sản phẩm</router-link>
      </div>
    </div>

    <!-- ── Payment Modals ── -->
    <CardPaymentModal
      :visible="showCardModal"
      :total="total"
      @close="showCardModal = false"
      @confirm="confirmCard"
    />

    <MomoPaymentModal
      :visible="showMomoModal"
      :total="total"
      :transferNote="transferNote"
      :qrUrl="momoQrUrl"
      :qrTimeStr="qrTimeStr"
      :qrSeconds="qrSeconds"
      :paid="paid"
      :orderId="lastOrderId"
      @close="closeMomo"
      @confirm-paid="confirmPaid"
    />

    <QrBankModal
      :visible="showQrModal"
      :total="total"
      :transferNote="transferNote"
      :qrUrl="bankQrUrl"
      :qrTimeStr="qrTimeStr"
      :qrSeconds="qrSeconds"
      :paid="paid"
      :orderId="lastOrderId"
      @close="closeQr"
      @confirm-paid="confirmPaid"
    />

    <CodPaymentModal
      :visible="showCodModal"
      :total="total"
      :codConfirmed="codConfirmed"
      :orderId="lastOrderId"
      @close="showCodModal = false; codConfirmed = false"
      @confirm="confirmCod"
    />

    <!-- ── Success Modal (card only) ── -->
    <transition name="modal-fade">
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-box modal-success">
          <PaymentSuccess :method="'card'" :orderId="lastOrderId" @close="showSuccessModal = false" />
        </div>
      </div>
    </transition>

  </main>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import PageHero from '../components/ui/PageHero.vue'
import { useCartStore } from '../stores/cart.js'
import { useOrdersStore } from '../stores/orders.js'
import { useAuthStore } from '../stores/auth.js'
import { formatPrice } from '../composables/useFormatPrice.js'
import { PAYMENT_METHODS, PROMO_CODES, QR_TIMEOUT_SECONDS } from '../constants/index.js'

import CardPaymentModal from '../components/checkout/CardPaymentModal.vue'
import MomoPaymentModal from '../components/checkout/MomoPaymentModal.vue'
import QrBankModal from '../components/checkout/QrBankModal.vue'
import CodPaymentModal from '../components/checkout/CodPaymentModal.vue'
import PaymentSuccess from '../components/checkout/PaymentSuccess.vue'

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

const cartItems = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.totalPrice)
const total = computed(() => Math.max(0, subtotal.value - promoDiscount.value))

const inc = (item) => { cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1) }
const dec = (item) => { cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1) }
const remove = (item) => { cartStore.removeFromCart(item.id, item.size, item.color) }
const clearCart = () => { cartStore.clearCart() }

// ── Promo ──
const promoInput = ref('')
const promoCode = ref('')
const promoDiscount = ref(0)
const promoMsg = ref('')
const promoOk = ref(false)

const applyPromo = () => {
  const code = promoInput.value.trim().toUpperCase()
  if (PROMO_CODES[code]) {
    promoCode.value = code
    promoDiscount.value = Math.round(subtotal.value * PROMO_CODES[code])
    promoMsg.value = `🎉 Giảm ${PROMO_CODES[code] * 100}% thành công!`
    promoOk.value = true
  } else {
    promoMsg.value = '❌ Mã không hợp lệ'
    promoOk.value = false
    promoDiscount.value = 0
    promoCode.value = ''
  }
}

// ── Payment Methods ──
const paymentMethods = PAYMENT_METHODS
const selectedPayment = ref(null)

// ── Modal states ──
const showCardModal = ref(false)
const showMomoModal = ref(false)
const showQrModal = ref(false)
const showCodModal = ref(false)
const showSuccessModal = ref(false)
const paid = ref(false)
const codConfirmed = ref(false)

// ── Transfer / QR ──
const currentOrderId = ref(Math.floor(Math.random() * 900000 + 100000))
const lastOrderId = ref(0)
const transferNote = computed(() => `SNEAKERBUZZ ${currentOrderId.value}`)

const momoQrUrl = computed(() => {
  const data = `MOMO|0901234567|SNEAKER BUZZ|${total.value}|${transferNote.value}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(data)}`
})
const bankQrUrl = computed(() => {
  const data = `STK: 1234567890\nNgan hang: Vietcombank\nChu TK: SNEAKER BUZZ\nSo tien: ${total.value}\nND: ${transferNote.value}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(data)}`
})

// Helper to create and save order
const createNewOrder = (paymentMethod, addressInfo = null) => {
  lastOrderId.value = currentOrderId.value
  const newOrder = {
    id: `${currentOrderId.value}`,
    userId: authStore.user?.id || 'guest',
    date: new Date().toISOString(),
    items: JSON.parse(JSON.stringify(cartStore.items)),
    totalPrice: total.value,
    paymentMethod: paymentMethod,
    promoCode: promoCode.value,
    discount: promoDiscount.value,
    status: 'processing',
    shippingAddress: addressInfo
  }
  ordersStore.addOrder(newOrder)
  currentOrderId.value = Math.floor(Math.random() * 900000 + 100000)
  cartStore.clearCart()
}

// ── Countdown ──
const qrSeconds = ref(QR_TIMEOUT_SECONDS)
let qrTimer = null

const qrTimeStr = computed(() => {
  const m = Math.floor(qrSeconds.value / 60)
  const s = qrSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const startTimer = () => {
  qrSeconds.value = QR_TIMEOUT_SECONDS
  qrTimer = setInterval(() => {
    if (qrSeconds.value > 0) qrSeconds.value--
    else clearInterval(qrTimer)
  }, 1000)
}
const stopTimer = () => clearInterval(qrTimer)

// ── Checkout router ──
const handleCheckout = () => {
  if (!selectedPayment.value) return
  paid.value = false
  switch (selectedPayment.value) {
    case 'card':
      showCardModal.value = true
      break
    case 'momo':
      showMomoModal.value = true
      startTimer()
      break
    case 'qr':
      showQrModal.value = true
      startTimer()
      break
    case 'cod':
      showCodModal.value = true
      break
  }
}

const confirmCard = () => {
  createNewOrder('card')
  showCardModal.value = false
  showSuccessModal.value = true
}
const confirmPaid = () => {
  createNewOrder(selectedPayment.value)
  paid.value = true
  stopTimer()
}
const confirmCod = (addressInfo) => {
  createNewOrder('cod', addressInfo)
  codConfirmed.value = true
}
const closeMomo = () => { showMomoModal.value = false; stopTimer(); paid.value = false }
const closeQr = () => { showQrModal.value = false; stopTimer(); paid.value = false }

onUnmounted(stopTimer)
</script>

<style scoped>
/* ─── Page ─── */
.cart-page { min-height: 100vh; padding-bottom: 80px; }

.cart-layout { display: grid; grid-template-columns: 1fr 400px; gap: 32px; align-items: start; }

/* ─── Cart Items ─── */
.cart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid var(--color-gray-200); }
.cart-title { font-family: var(--font-heading); font-size: 1rem; font-weight: 800; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.08em; }
.clear-all-btn { font-size: 0.82rem; color: var(--color-accent); background: none; border: none; cursor: pointer; font-weight: 600; }
.clear-all-btn:hover { text-decoration: underline; }
.items-list { display: flex; flex-direction: column; gap: 16px; }
.cart-item-card { display: flex; gap: 16px; padding: 16px; background: white; border-radius: var(--radius-md); border: 1px solid var(--color-gray-200); transition: var(--transition); position: relative; }
.cart-item-card:hover { box-shadow: var(--shadow-md); border-color: transparent; }
.item-img-wrap { width: 100px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; background: var(--color-gray-100); flex-shrink: 0; }
.item-img { width: 100%; height: 100%; object-fit: cover; }
.item-details { flex: 1; }
.item-brand { font-family: var(--font-heading); font-size: 0.65rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-accent); display: block; margin-bottom: 4px; }
.item-name { font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--color-primary); margin-bottom: 8px; line-height: 1.3; }
.item-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.meta-tag { font-size: 0.77rem; color: var(--color-gray-500); background: var(--color-gray-100); padding: 2px 8px; border-radius: var(--radius-full); }
.meta-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--color-gray-300); }
.item-price-row { display: flex; align-items: center; gap: 16px; }
.item-price { font-family: var(--font-heading); font-size: 0.88rem; color: var(--color-gray-600); min-width: 80px; }
.item-qty { display: flex; align-items: center; gap: 8px; background: var(--color-gray-100); border-radius: var(--radius-sm); padding: 4px 8px; }
.qty-btn { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: none; background: none; font-size: 1rem; font-weight: 700; cursor: pointer; color: var(--color-primary); border-radius: 4px; transition: var(--transition-fast); }
.qty-btn:hover { background: var(--color-primary); color: white; }
.item-qty span { font-family: var(--font-heading); font-size: 0.88rem; font-weight: 700; min-width: 20px; text-align: center; }
.item-total { font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--color-primary); margin-left: auto; }
.remove-btn { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: var(--color-gray-100); border-radius: 50%; cursor: pointer; color: var(--color-gray-400); transition: var(--transition-fast); }
.remove-btn:hover { background: var(--color-accent); color: white; }
.cart-item-enter-active, .cart-item-leave-active { transition: all 0.3s ease; }
.cart-item-enter-from { opacity: 0; transform: translateX(-20px); }
.cart-item-leave-to { opacity: 0; transform: translateX(20px); }
.continue-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 20px; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; color: var(--color-primary); transition: var(--transition-fast); letter-spacing: 0.05em; }
.continue-link:hover { color: var(--color-accent); }

/* ─── Order Summary ─── */
.order-summary { background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200); padding: 28px; position: sticky; top: calc(var(--topbar-height) + var(--header-height) + 16px); }
.summary-title { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; color: var(--color-primary); }
.summary-rows { margin-bottom: 20px; }
.summary-row { display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--color-gray-600); margin-bottom: 12px; }
.free-ship { color: #22c55e; font-weight: 700; }
.discount-row { color: #22c55e; }
.discount-val { font-weight: 700; }
.summary-divider { height: 1px; background: var(--color-gray-200); margin: 16px 0; }
.total-row { font-family: var(--font-heading); font-size: 1rem; font-weight: 800; color: var(--color-primary); margin-bottom: 0; }
.total-price { font-size: 1.2rem; color: var(--color-accent); }

/* ─── Promo ─── */
.promo-section { margin-bottom: 24px; }
.promo-label { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-gray-600); margin-bottom: 8px; }
.promo-input-row { display: flex; gap: 8px; }
.promo-input { flex: 1; height: 38px; border: 1.5px solid var(--color-gray-300); border-radius: var(--radius-sm); padding: 0 12px; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; outline: none; transition: var(--transition-fast); }
.promo-input:focus { border-color: var(--color-primary); }
.promo-apply-btn { height: 38px; padding: 0 16px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-sm); font-family: var(--font-heading); font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: var(--transition-fast); white-space: nowrap; }
.promo-apply-btn:hover { opacity: 0.85; }
.promo-msg { font-size: 0.8rem; font-weight: 600; margin-top: 6px; }
.promo-ok { color: #22c55e; }
.promo-err { color: var(--color-accent); }

/* ─── Payment Method Selector ─── */
.payment-select-section { margin-bottom: 20px; }
.payment-select-label { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gray-600); margin-bottom: 10px; }
.payment-methods-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.pm-card {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 12px 8px; border: 2px solid var(--color-gray-200); border-radius: var(--radius-md);
  background: white; cursor: pointer; transition: all 0.2s ease; position: relative; gap: 3px;
}
.pm-card:hover { border-color: var(--color-primary); background: #f8faff; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.pm-card.active { border-color: var(--color-primary); background: linear-gradient(135deg, #f0f4ff, #e8eeff); box-shadow: 0 4px 20px rgba(29,67,50,0.15); }
.pm-icon { font-size: 1.4rem; }
.pm-name { font-family: var(--font-heading); font-size: 0.78rem; font-weight: 800; color: var(--color-primary); }
.pm-desc { font-size: 0.67rem; color: var(--color-gray-400); }
.pm-check { position: absolute; top: 6px; right: 6px; width: 18px; height: 18px; background: var(--color-primary); color: white; border-radius: 50%; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; font-weight: 700; }

/* ─── Checkout Button ─── */
.checkout-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; font-size: 0.88rem; margin-bottom: 12px; }
.checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.secure-badge { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.72rem; color: var(--color-gray-400); margin-top: 4px; }

/* ─── Empty Cart ─── */
.empty-cart { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 100px 40px; text-align: center; }
.empty-cart-icon { font-size: 5rem; }
.empty-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 900; color: var(--color-primary); }
.empty-desc { color: var(--color-gray-500); margin-bottom: 8px; }

/* ── Modal success ── */
.modal-success { max-width: 440px; }

/* ── Responsive ── */
@media (max-width: 1024px) { .cart-layout { grid-template-columns: 1fr 360px; } }
@media (max-width: 768px) {
  .cart-layout { grid-template-columns: 1fr; }
  .order-summary { position: static; }
  .item-price-row { flex-wrap: wrap; }
}
@media (max-width: 540px) {
  .payment-methods-grid { grid-template-columns: 1fr 1fr; }
}
</style>
