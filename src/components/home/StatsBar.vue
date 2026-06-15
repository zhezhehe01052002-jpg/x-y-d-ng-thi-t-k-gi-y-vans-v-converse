<template>
  <section class="stats-bar">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <span class="stat-icon">{{ stat.icon }}</span>
          <div>
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const stats = [
  { icon: '✓', value: '100%', label: 'Hàng Chính Hãng' },
  { icon: '🚚', value: '24H', label: 'Giao Hàng Nhanh' },
  { icon: '↩', value: '30 Ngày', label: 'Đổi Trả Miễn Phí' },
  { icon: '👟', value: '1000+', label: 'Sản Phẩm' },
  { icon: '⭐', value: '50K+', label: 'Khách Hàng' }
]
</script>

<style scoped>
.stats-bar {
  background: var(--color-primary);
  padding: 20px 0;
}
.stats-grid {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}
.stat-icon { font-size: 1.3rem; }
.stat-value {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1;
}
.stat-label {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.6);
  margin-top: 2px;
  letter-spacing: 0.05em;
}

@media (max-width: 480px) {
  .stats-grid { justify-content: center; }
}
</style>
