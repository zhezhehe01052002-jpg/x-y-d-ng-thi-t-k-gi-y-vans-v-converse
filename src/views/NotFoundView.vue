<template>
  <main class="not-found-page">
    <div class="nf-content">
      <div class="nf-code">404</div>
      <h1 class="nf-title">Trang Không Tồn Tại</h1>
      <p class="nf-desc">Trang bạn đang tìm kiếm có thể đã bị xóa hoặc địa chỉ URL không chính xác.</p>
      <div class="nf-actions">
        <router-link to="/" class="btn btn-primary">← Về Trang Chủ</router-link>
        <router-link to="/products" class="btn btn-outline">Xem Sản Phẩm</router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
.not-found-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: var(--color-gray-100);
}

.nf-content {
  text-align: center;
  max-width: 480px;
}

.nf-code {
  font-family: var(--font-heading);
  font-size: clamp(5rem, 15vw, 9rem);
  font-weight: 900;
  color: var(--color-gray-200);
  line-height: 1;
  letter-spacing: -0.05em;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nf-title {
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 900;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.nf-desc {
  font-size: 0.95rem;
  color: var(--color-gray-500);
  line-height: 1.7;
  margin-bottom: 32px;
}

.nf-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
