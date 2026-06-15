<template>
  <section class="section-sm why-section">
    <div class="container">
      <h2 class="section-title text-center">Tại Sao Chọn Sneaker Buzz?</h2>
      <div class="why-grid">
        <div class="why-item" v-for="item in whyItems" :key="item.title">
          <div class="why-icon">{{ item.icon }}</div>
          <h3 class="why-title">{{ item.title }}</h3>
          <p class="why-desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const whyItems = [
  { icon: '🔐', title: '100% Chính Hãng', desc: 'Tất cả sản phẩm được nhập khẩu trực tiếp từ nhà phân phối chính thức.' },
  { icon: '🚀', title: 'Giao Hàng 24H', desc: 'Giao hàng nhanh trong ngày tại Hà Nội và TP.HCM.' },
  { icon: '💳', title: 'Thanh Toán Dễ', desc: 'Hỗ trợ COD, chuyển khoản, MOMO, VISA/MasterCard.' },
  { icon: '🔄', title: 'Đổi Trả 30 Ngày', desc: 'Miễn phí đổi trả trong 30 ngày nếu sản phẩm có lỗi.' }
]
</script>

<style scoped>
.why-section {
  background: var(--color-gray-100);
}
.text-center {
  text-align: center;
  margin-bottom: 40px;
}
.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.why-item {
  background: white;
  border-radius: var(--radius-md);
  padding: 28px;
  text-align: center;
  border: 1px solid var(--color-gray-200);
  transition: var(--transition);
}
.why-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: transparent;
}
.why-icon {
  font-size: 2.2rem;
  margin-bottom: 12px;
}
.why-title {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.why-desc {
  font-size: 0.85rem;
  color: var(--color-gray-700);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .why-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .why-grid { grid-template-columns: 1fr; }
}
</style>
