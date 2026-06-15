<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box modal-momo">
        <div class="modal-header momo-header">
          <div class="modal-header-left">
            <div class="momo-logo">M</div>
            <h2 class="modal-title">Thanh Toán MoMo</h2>
          </div>
          <button class="modal-close" @click="$emit('close')">✕</button>
        </div>

        <div class="modal-body" v-if="!paid">
          <div class="qr-center-wrap">
            <div class="momo-qr-wrap">
              <img :src="qrUrl" alt="MoMo QR" class="qr-img" />
              <div class="momo-qr-brand">
                <span>📱 MoMo</span>
              </div>
            </div>
            <p class="qr-scan-hint">Mở App MoMo → Quét mã QR để thanh toán</p>
            <div class="qr-countdown" :class="{ urgent: qrSeconds < 60 }">
              <span>⏱ Hết hạn sau: </span>
              <strong>{{ qrTimeStr }}</strong>
            </div>
          </div>

          <div class="momo-info-box">
            <div class="momo-info-row">
              <span>Số điện thoại MoMo</span>
              <div class="copy-row">
                <strong>0901 234 567</strong>
                <button class="copy-btn" @click="copyText('0901234567', 'phone')" :class="{ copied: copyStatus.phone }">
                  {{ copyStatus.phone ? '✓ Đã chép' : 'Sao chép' }}
                </button>
              </div>
            </div>
            <div class="momo-info-row">
              <span>Tên tài khoản</span>
              <strong>SNEAKER BUZZ</strong>
            </div>
            <div class="momo-info-row">
              <span>Số tiền</span>
              <strong class="amount-highlight">{{ formatPrice(total) }}</strong>
            </div>
            <div class="momo-info-row">
              <span>Nội dung</span>
              <div class="copy-row">
                <strong>{{ transferNote }}</strong>
                <button class="copy-btn" @click="copyText(transferNote, 'note')" :class="{ copied: copyStatus.note }">
                  {{ copyStatus.note ? '✓ Đã chép' : 'Sao chép' }}
                </button>
              </div>
            </div>
          </div>

          <button class="btn btn-momo modal-pay-btn" @click="$emit('confirm-paid')">
            ✓ Tôi đã thanh toán xong
          </button>
        </div>

        <div class="modal-body success-body" v-else>
          <PaymentSuccess :method="'momo'" :orderId="orderId" @close="$emit('close')" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { formatPrice } from '../../composables/useFormatPrice.js'
import { useCopyToClipboard } from '../../composables/useCopyToClipboard.js'
import PaymentSuccess from './PaymentSuccess.vue'

defineProps({
  visible: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  transferNote: { type: String, default: '' },
  qrUrl: { type: String, default: '' },
  qrTimeStr: { type: String, default: '15:00' },
  qrSeconds: { type: Number, default: 900 },
  paid: { type: Boolean, default: false },
  orderId: { type: [String, Number], default: '' }
})

defineEmits(['close', 'confirm-paid'])

const { copyStatus, copyText } = useCopyToClipboard()
</script>

<style scoped>
.modal-momo { max-width: 480px; }
.momo-header { background: linear-gradient(135deg, #a50064, #d4006c); }
.momo-logo { width: 40px; height: 40px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 1rem; font-weight: 900; color: #a50064; }
.qr-center-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 20px; }
.momo-qr-wrap { position: relative; }
.momo-qr-wrap .qr-img { width: 200px; height: 200px; border: 3px solid #a50064; border-radius: 16px; display: block; }
.momo-qr-brand { position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); background: #a50064; color: white; font-family: var(--font-heading); font-size: 0.72rem; font-weight: 800; padding: 3px 12px; border-radius: var(--radius-full); white-space: nowrap; }
.btn-momo { background: linear-gradient(135deg, #a50064, #d4006c); color: white; border: none; border-radius: var(--radius-sm); font-family: var(--font-heading); font-size: 0.88rem; font-weight: 800; cursor: pointer; transition: var(--transition-fast); }
.btn-momo:hover { opacity: 0.9; transform: translateY(-1px); }

.momo-info-box { background: var(--color-gray-100); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }
.momo-info-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--color-gray-600); }
.momo-info-row strong { color: var(--color-primary); font-family: var(--font-heading); font-size: 0.88rem; }
.amount-highlight { font-size: 1.2rem; color: var(--color-accent); }

.success-body { padding: 0; }
</style>
