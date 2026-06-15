<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box modal-qr">
        <div class="modal-header qr-bank-header">
          <div class="modal-header-left">
            <div class="vcb-logo">VCB</div>
            <div>
              <h2 class="modal-title">Chuyển Khoản QR</h2>
              <p class="modal-subtitle">Vietcombank</p>
            </div>
          </div>
          <button class="modal-close" @click="$emit('close')">✕</button>
        </div>

        <div class="modal-body qr-modal-body" v-if="!paid">
          <!-- Left -->
          <div class="qr-left-col">
            <div class="qr-img-frame">
              <img :src="qrUrl" alt="QR Chuyển khoản" class="qr-img" />
            </div>
            <p class="qr-scan-hint">📱 Quét mã bằng App ngân hàng bất kỳ</p>
            <div class="qr-countdown" :class="{ urgent: qrSeconds < 60 }">
              <span>⏱ Hết hạn: </span>
              <strong>{{ qrTimeStr }}</strong>
            </div>
          </div>

          <!-- Right -->
          <div class="qr-right-col">
            <div class="bank-info-list">
              <div class="bank-info-item">
                <span class="bi-label">Ngân hàng</span>
                <strong class="bi-val">Vietcombank (VCB)</strong>
              </div>
              <div class="bank-info-item">
                <span class="bi-label">Số tài khoản</span>
                <div class="copy-row">
                  <strong class="bi-val account-num">1234 5678 90</strong>
                  <button class="copy-btn" @click="copyText('1234567890', 'account')" :class="{ copied: copyStatus.account }">
                    {{ copyStatus.account ? '✓ Đã chép' : 'Sao chép' }}
                  </button>
                </div>
              </div>
              <div class="bank-info-item">
                <span class="bi-label">Chủ tài khoản</span>
                <strong class="bi-val">SNEAKER BUZZ</strong>
              </div>
              <div class="bank-info-item">
                <span class="bi-label">Số tiền</span>
                <strong class="bi-val amount-highlight">{{ formatPrice(total) }}</strong>
              </div>
              <div class="bank-info-item">
                <span class="bi-label">Nội dung CK</span>
                <div class="copy-row">
                  <strong class="bi-val transfer-note-tag">{{ transferNote }}</strong>
                  <button class="copy-btn" @click="copyText(transferNote, 'note')" :class="{ copied: copyStatus.note }">
                    {{ copyStatus.note ? '✓ Đã chép' : 'Sao chép' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="qr-steps-box">
              <p class="steps-title">Hướng dẫn:</p>
              <ol class="steps-list">
                <li>Mở App ngân hàng → Quét QR <strong>hoặc</strong> Chuyển khoản</li>
                <li>Nhập đúng số tiền <strong>{{ formatPrice(total) }}</strong></li>
                <li>Nội dung: <strong>{{ transferNote }}</strong></li>
                <li>Xác nhận giao dịch</li>
              </ol>
            </div>

            <button class="btn btn-primary modal-pay-btn" @click="$emit('confirm-paid')">
              ✓ Tôi đã chuyển khoản xong
            </button>
          </div>
        </div>

        <div class="modal-body success-body" v-else>
          <PaymentSuccess :method="'qr'" :orderId="orderId" @close="$emit('close')" />
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
.modal-qr { max-width: 780px; }
.qr-bank-header { background: linear-gradient(135deg, #005a32, #00872a); }
.vcb-logo { width: 44px; height: 44px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 0.78rem; font-weight: 900; color: #005a32; letter-spacing: 0.05em; }
.qr-modal-body { display: grid; grid-template-columns: 260px 1fr; gap: 0; }
.qr-left-col { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 24px; background: var(--color-gray-100); border-right: 1px solid var(--color-gray-200); }
.qr-img-frame { padding: 8px; background: white; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.qr-img-frame .qr-img, .qr-left-col .qr-img { width: 200px; height: 200px; display: block; border-radius: 10px; }
.qr-right-col { padding: 24px; display: flex; flex-direction: column; gap: 0; }

.bank-info-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.bank-info-item { display: flex; flex-direction: column; gap: 4px; }
.bi-label { font-family: var(--font-heading); font-size: 0.67rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gray-400); }
.bi-val { font-family: var(--font-heading); font-size: 0.92rem; font-weight: 700; color: var(--color-primary); }
.account-num { font-size: 1.1rem; letter-spacing: 0.08em; }
.amount-highlight { font-size: 1.2rem; color: var(--color-accent); }
.transfer-note-tag { background: var(--color-gray-100); padding: 2px 10px; border-radius: var(--radius-sm); font-size: 0.82rem; }

.qr-steps-box { background: var(--color-gray-100); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; }
.steps-title { font-family: var(--font-heading); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gray-500); margin-bottom: 8px; }
.steps-list { padding-left: 16px; display: flex; flex-direction: column; gap: 5px; }
.steps-list li { font-size: 0.82rem; color: var(--color-gray-700); line-height: 1.5; }
.steps-list strong { color: var(--color-primary); }

.success-body { padding: 0; }

@media (max-width: 768px) {
  .qr-modal-body { grid-template-columns: 1fr; }
  .qr-left-col { border-right: none; border-bottom: 1px solid var(--color-gray-200); }
}
</style>
