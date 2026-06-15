<template>
  <section class="promo-banner">
    <div class="container">
      <div class="promo-inner">
        <div class="promo-text">
          <span class="promo-badge">FLASH SALE</span>
          <h2 class="promo-title">Giảm Đến 50%<br/>Cho Tất Cả Sản Phẩm Sale</h2>
          <p class="promo-desc">Số lượng có hạn – Nhanh tay kẻo hết!</p>
          <router-link to="/products?badge=SALE" class="btn btn-accent">Mua Ngay</router-link>
        </div>
        <div class="promo-countdown">
          <p class="countdown-label">Kết thúc sau:</p>
          <div class="countdown-grid">
            <div class="countdown-item">
              <span class="countdown-num">{{ countdown.hours }}</span>
              <span class="countdown-unit">Giờ</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-item">
              <span class="countdown-num">{{ countdown.minutes }}</span>
              <span class="countdown-unit">Phút</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-item">
              <span class="countdown-num">{{ countdown.seconds }}</span>
              <span class="countdown-unit">Giây</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Countdown timer setup (5 hours 30 mins)
const endTime = new Date()
endTime.setHours(endTime.getHours() + 5, 30, 0, 0)

const countdown = ref({ hours: '05', minutes: '30', seconds: '00' })
let timer = null

const updateCountdown = () => {
  const now = new Date()
  const diff = Math.max(0, endTime - now)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  countdown.value = {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.promo-banner {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}
.promo-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 60% 50%, rgba(230, 57, 70, 0.15), transparent 60%);
  pointer-events: none;
}
.promo-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  position: relative;
}
.promo-badge {
  display: inline-block;
  background: var(--color-accent);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  margin-bottom: 12px;
  animation: pulse 2s ease-in-out infinite;
}
.promo-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.promo-desc {
  color: rgba(255,255,255,0.6);
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.countdown-label {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 12px;
}
.countdown-grid {
  display: flex;
  align-items: center;
  gap: 8px;
}
.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  min-width: 80px;
}
.countdown-num {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 900;
  color: white;
  line-height: 1;
}
.countdown-unit {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 4px;
}
.countdown-sep {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-accent);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .promo-inner { flex-direction: column; text-align: center; }
}
</style>
