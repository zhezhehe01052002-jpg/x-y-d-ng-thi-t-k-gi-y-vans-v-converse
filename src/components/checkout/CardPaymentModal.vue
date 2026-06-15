<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box modal-card">
        <div class="modal-header card-header">
          <div class="modal-header-left">
            <div class="card-logos">
              <span class="card-logo visa-logo">VISA</span>
              <span class="card-logo mc-logo">MC</span>
            </div>
            <h2 class="modal-title">Thanh Toán Thẻ</h2>
          </div>
          <button class="modal-close" @click="$emit('close')">✕</button>
        </div>

        <div class="modal-body">
          <!-- Card Preview -->
          <div class="card-preview" :class="cardForm.type">
            <div class="card-preview-top">
              <div class="card-chip"></div>
              <span class="card-type-badge">{{ cardForm.type === 'visa' ? 'VISA' : 'MASTERCARD' }}</span>
            </div>
            <div class="card-number-preview">
              {{ cardPreviewNumber }}
            </div>
            <div class="card-preview-bottom">
              <div>
                <p class="card-preview-label">Tên chủ thẻ</p>
                <p class="card-preview-val">{{ cardForm.name || 'NGUYEN VAN A' }}</p>
              </div>
              <div>
                <p class="card-preview-label">Hết hạn</p>
                <p class="card-preview-val">{{ cardForm.expiry || 'MM/YY' }}</p>
              </div>
            </div>
          </div>

          <!-- Card Type Toggle -->
          <div class="card-type-toggle">
            <button :class="['card-type-btn', { active: cardForm.type === 'visa' }]" @click="cardForm.type = 'visa'">
              <span>VISA</span>
            </button>
            <button :class="['card-type-btn', { active: cardForm.type === 'mastercard' }]" @click="cardForm.type = 'mastercard'">
              <span>MASTERCARD</span>
            </button>
          </div>

          <!-- Card Form -->
          <div class="card-form">
            <div class="form-group">
              <label class="form-label">Số thẻ</label>
              <input
                v-model="cardForm.number"
                type="text"
                class="form-input"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                @input="formatCardNumber"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Tên chủ thẻ</label>
              <input v-model="cardForm.name" type="text" class="form-input" placeholder="NGUYEN VAN A" style="text-transform:uppercase" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Ngày hết hạn</label>
                <input v-model="cardForm.expiry" type="text" class="form-input" placeholder="MM/YY" maxlength="5" @input="formatExpiry" />
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input v-model="cardForm.cvv" type="password" class="form-input" placeholder="•••" maxlength="3" />
              </div>
            </div>
          </div>

          <div class="modal-amount-bar">
            <span>Số tiền thanh toán:</span>
            <span class="modal-amount">{{ formatPrice(total) }}</span>
          </div>

          <button class="btn btn-primary modal-pay-btn" @click="$emit('confirm')">
            Thanh Toán {{ formatPrice(total) }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatPrice } from '../../composables/useFormatPrice.js'

defineProps({
  visible: { type: Boolean, default: false },
  total: { type: Number, default: 0 }
})

defineEmits(['close', 'confirm'])

const cardForm = ref({ type: 'visa', number: '', name: '', expiry: '', cvv: '' })

const cardPreviewNumber = computed(() => {
  const raw = cardForm.value.number.replace(/\s/g, '')
  const padded = raw.padEnd(16, '•')
  return padded.match(/.{1,4}/g).join(' ')
})

const formatCardNumber = () => {
  let val = cardForm.value.number.replace(/\D/g, '').slice(0, 16)
  cardForm.value.number = val.match(/.{1,4}/g)?.join(' ') || val
}

const formatExpiry = () => {
  let val = cardForm.value.expiry.replace(/\D/g, '').slice(0, 4)
  if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2)
  cardForm.value.expiry = val
}
</script>

<style scoped>
.modal-card { max-width: 520px; }
.card-header { background: linear-gradient(135deg, #1a1a2e, #16213e); }
.card-logos { display: flex; gap: 6px; }
.card-logo { font-family: var(--font-heading); font-size: 0.75rem; font-weight: 900; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.1em; }
.visa-logo { background: #1a1f71; color: white; }
.mc-logo { background: #eb001b; color: white; }

.card-preview {
  border-radius: 16px; padding: 24px; margin-bottom: 20px; position: relative; overflow: hidden;
  min-height: 160px; display: flex; flex-direction: column; justify-content: space-between;
  background: linear-gradient(135deg, #1a3a5c, #2d6a9f);
}
.card-preview.mastercard { background: linear-gradient(135deg, #6b0010, #c1121f); }
.card-preview-top { display: flex; justify-content: space-between; align-items: center; }
.card-chip { width: 38px; height: 28px; background: linear-gradient(135deg, #d4af37, #f5d47c); border-radius: 6px; }
.card-type-badge { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 900; color: rgba(255,255,255,0.8); letter-spacing: 0.1em; }
.card-number-preview { font-family: 'Courier New', monospace; font-size: 1.3rem; color: white; letter-spacing: 0.15em; text-align: center; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.card-preview-bottom { display: flex; justify-content: space-between; }
.card-preview-label { font-size: 0.6rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; }
.card-preview-val { font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; color: white; }

.card-type-toggle { display: flex; gap: 8px; margin-bottom: 20px; }
.card-type-btn { flex: 1; padding: 8px; border: 2px solid var(--color-gray-200); border-radius: var(--radius-sm); font-family: var(--font-heading); font-size: 0.78rem; font-weight: 800; cursor: pointer; background: none; color: var(--color-gray-500); transition: var(--transition-fast); }
.card-type-btn.active { border-color: var(--color-primary); color: var(--color-primary); background: #f0f4ff; }

.card-form { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-label { font-family: var(--font-heading); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-gray-500); }
.form-input { height: 44px; border: 1.5px solid var(--color-gray-300); border-radius: var(--radius-sm); padding: 0 14px; font-family: var(--font-heading); font-size: 0.9rem; font-weight: 600; outline: none; transition: var(--transition-fast); color: var(--color-primary); }
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(29,67,50,0.1); }
</style>
