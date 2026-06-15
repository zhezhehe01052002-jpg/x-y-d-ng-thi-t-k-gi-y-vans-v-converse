<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box modal-cod">
        <div class="modal-header cod-header">
          <div class="modal-header-left">
            <div class="cod-icon">💵</div>
            <h2 class="modal-title">Thanh Toán Khi Nhận Hàng</h2>
          </div>
          <button class="modal-close" @click="$emit('close')">✕</button>
        </div>

        <div class="modal-body" v-if="!codConfirmed">
          <div class="cod-info-box">
            <div class="cod-icon-big">🚚</div>
            <h3 class="cod-title">Giao hàng thu tiền (COD)</h3>
            <p class="cod-desc">Bạn chỉ cần thanh toán khi nhận được hàng tại nhà. Đảm bảo hàng hóa đúng với đơn hàng trước khi thanh toán.</p>
          </div>

          <div class="cod-summary">
            <div class="cod-sum-row">
              <span>Tổng đơn hàng</span>
              <strong>{{ formatPrice(total) }}</strong>
            </div>
            <div class="cod-sum-row">
              <span>Phí ship</span>
              <strong class="free-ship">Miễn phí</strong>
            </div>
            <div class="cod-sum-row total">
              <span>Cần chuẩn bị</span>
              <strong class="amount-highlight">{{ formatPrice(total) }}</strong>
            </div>
          </div>

          <div class="cod-address-form">
            <p class="form-label">Địa chỉ giao hàng</p>
            <input v-model="codAddress.name" type="text" class="form-input" placeholder="Họ và tên người nhận" />
            <input v-model="codAddress.phone" type="text" class="form-input" placeholder="Số điện thoại" />
            <input v-model="codAddress.address" type="text" class="form-input" placeholder="Địa chỉ chi tiết (số nhà, đường, phường...)" />
          </div>

          <div class="cod-notes">
            <div class="cod-note-item" v-for="note in codNotes" :key="note.text">
              <span class="cod-note-icon">{{ note.icon }}</span>
              <span>{{ note.text }}</span>
            </div>
          </div>

          <button class="btn btn-primary modal-pay-btn" @click="handleConfirm">
            🚚 Xác Nhận Đặt Hàng COD
          </button>
        </div>

        <div class="modal-body success-body" v-else>
          <PaymentSuccess :method="'COD'" :orderId="orderId" @close="handleClose" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { formatPrice } from '../../composables/useFormatPrice.js'
import { COD_NOTES } from '../../constants/index.js'
import PaymentSuccess from './PaymentSuccess.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  codConfirmed: { type: Boolean, default: false },
  orderId: { type: [String, Number], default: '' }
})

const emit = defineEmits(['close', 'confirm'])

const codAddress = ref({ name: '', phone: '', address: '' })
const codNotes = COD_NOTES

const handleConfirm = () => {
  const addressInfo = {
    name: codAddress.value.name || 'Người nhận',
    phone: codAddress.value.phone || 'N/A',
    address: codAddress.value.address || 'Chưa cung cấp địa chỉ'
  }
  emit('confirm', addressInfo)
}

const handleClose = () => {
  codAddress.value = { name: '', phone: '', address: '' }
  emit('close')
}
</script>

<style scoped>
.modal-cod { max-width: 500px; }
.cod-header { background: linear-gradient(135deg, #78350f, #b45309); }
.cod-icon { font-size: 1.6rem; }
.cod-info-box { text-align: center; padding: 20px 0 16px; }
.cod-icon-big { font-size: 3.5rem; margin-bottom: 12px; }
.cod-title { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 900; color: var(--color-primary); margin-bottom: 8px; }
.cod-desc { font-size: 0.87rem; color: var(--color-gray-600); line-height: 1.6; }

.cod-summary { background: var(--color-gray-100); border-radius: var(--radius-md); padding: 16px; margin: 16px 0; }
.cod-sum-row { display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--color-gray-600); margin-bottom: 8px; }
.cod-sum-row:last-child { margin-bottom: 0; }
.cod-sum-row.total { border-top: 1px solid var(--color-gray-200); padding-top: 10px; margin-top: 10px; font-weight: 700; }
.cod-sum-row strong { color: var(--color-primary); font-family: var(--font-heading); }
.free-ship { color: #22c55e; }
.amount-highlight { font-size: 1.2rem; color: var(--color-accent); }

.cod-address-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.form-label { font-family: var(--font-heading); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-gray-500); }
.form-input { height: 44px; border: 1.5px solid var(--color-gray-300); border-radius: var(--radius-sm); padding: 0 14px; font-family: var(--font-heading); font-size: 0.9rem; font-weight: 600; outline: none; transition: var(--transition-fast); color: var(--color-primary); }
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(29,67,50,0.1); }

.cod-notes { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; background: #fef9c3; border-radius: var(--radius-md); padding: 12px 16px; border: 1px solid #fde047; }
.cod-note-item { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #78350f; }
.cod-note-icon { font-size: 0.9rem; }

.success-body { padding: 0; }
</style>
