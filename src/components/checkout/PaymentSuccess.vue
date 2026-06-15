<template>
  <div class="success-screen">
    <div class="success-anim">🎉</div>
    <h3 class="success-title">Đặt hàng thành công!</h3>
    <p class="success-desc">
      {{ method === 'COD'
        ? 'Đơn hàng đã được xác nhận. Chúng tôi sẽ giao hàng đến bạn trong 24-48 giờ.'
        : 'Cảm ơn bạn đã thanh toán. Đơn hàng đang được xử lý.' }}
    </p>
    <div class="success-order">
      <span>Mã đơn hàng: </span>
      <strong>#SB{{ orderId }}</strong>
    </div>
    <div class="success-actions">
      <button class="btn btn-outline success-btn" @click="goToHistory">Lịch sử mua hàng</button>
      <button class="btn btn-primary success-btn" @click="goToProducts">Tiếp tục mua sắm</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  method: { type: String, default: '' },
  orderId: { type: [String, Number], default: '' }
})

const emit = defineEmits(['close'])
const router = useRouter()

const goToHistory = () => {
  emit('close')
  router.push('/order-history')
}

const goToProducts = () => {
  emit('close')
  router.push('/products')
}
</script>

<style scoped>
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 32px;
  text-align: center;
  gap: 12px;
}

.success-anim {
  font-size: 5rem;
  animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounceIn {
  from { opacity: 0; transform: scale(0.4); }
  to { opacity: 1; transform: scale(1); }
}

.success-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--color-primary);
}

.success-desc {
  font-size: 0.9rem;
  color: var(--color-gray-600);
  line-height: 1.6;
  max-width: 340px;
}

.success-order {
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  padding: 10px 20px;
  font-size: 0.85rem;
  color: var(--color-gray-600);
}

.success-order strong {
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 0.95rem;
}

.success-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
  justify-content: center;
}

.success-btn {
  padding: 10px 16px;
  font-size: 0.75rem;
  height: 38px;
}
</style>
