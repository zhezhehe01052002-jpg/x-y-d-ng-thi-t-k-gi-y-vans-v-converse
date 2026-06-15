<template>
  <main class="about-page">
    <PageHero
      title="Về Chúng Tôi"
      :crumbs="[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }]"
    />

    <!-- About Intro Section -->
    <section class="section intro-section">
      <div class="container intro-grid">
        <div class="intro-visual">
          <img src="/images/brand_converse.png" alt="Sneaker Buzz Store" class="intro-img" />
          <div class="visual-deco-box"></div>
        </div>
        <div class="intro-content">
          <span class="section-eyebrow">Sneaker Buzz Story</span>
          <h2 class="section-heading">Điểm đến hàng đầu của tín đồ Sneaker</h2>
          <p class="intro-text">
            Được thành lập từ niềm đam mê mãnh liệt với văn hóa đường phố và những đôi giày thể thao huyền thoại, Sneaker Buzz tự hào là nhà phân phối và cung cấp các sản phẩm giày Vans & Converse chính hãng hàng đầu tại Việt Nam.
          </p>
          <p class="intro-text">
            Chúng tôi không chỉ bán những đôi giày. Chúng tôi mang đến phong cách sống, sự tự tin và câu chuyện đằng sau mỗi bước chân của bạn. Từ dòng Vans "Off The Wall" phóng khoáng cho giới trẻ trượt ván đến Converse Chuck Taylor vượt thời gian đại diện cho cá tính tự do.
          </p>
          <div class="stats-row">
            <div class="stat-box">
              <span class="stat-number">10+</span>
              <span class="stat-text">Năm phát triển</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">50K+</span>
              <span class="stat-text">Khách hàng tin tưởng</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">100%</span>
              <span class="stat-text">Chính hãng</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="section values-section">
      <div class="container">
        <div class="section-header-center">
          <span class="section-eyebrow">Cam kết của chúng tôi</span>
          <h2 class="section-heading text-center">Giá Trị Cốt Lõi</h2>
        </div>
        <div class="values-grid">
          <div class="value-card">
            <span class="value-icon">🛡️</span>
            <h3 class="value-title">Chính Hãng Tuyệt Đối</h3>
            <p class="value-desc">Cam kết hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái. Mọi sản phẩm đều có nguồn gốc rõ ràng.</p>
          </div>
          <div class="value-card">
            <span class="value-icon">⚡</span>
            <h3 class="value-title">Dịch Vụ Tốc Hành</h3>
            <p class="value-desc">Hỗ trợ giao hàng siêu tốc trong vòng 24 giờ tại nội thành. Đóng gói cẩn thận và chu đáo.</p>
          </div>
          <div class="value-card">
            <span class="value-icon">🤝</span>
            <h3 class="value-title">Tận Tâm Khách Hàng</h3>
            <p class="value-desc">Luôn lắng nghe, hỗ trợ khách hàng đổi size trong vòng 30 ngày một cách dễ dàng và nhanh chóng.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHero from '../components/ui/PageHero.vue'
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}

.section-eyebrow {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 12px;
}
.section-heading {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1.2;
  margin-bottom: 20px;
}
.text-center {
  text-align: center;
}

/* Intro Section */
.intro-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 56px;
  align-items: center;
}

.intro-visual {
  position: relative;
}
.intro-img {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 1;
  aspect-ratio: 4/3;
  object-fit: cover;
}
.visual-deco-box {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 100px;
  height: 100px;
  border-top: 4px solid var(--color-accent);
  border-left: 4px solid var(--color-accent);
  z-index: 0;
}

.intro-content {
  display: flex;
  flex-direction: column;
}
.intro-text {
  font-size: 0.95rem;
  color: var(--color-gray-700);
  line-height: 1.7;
  margin-bottom: 18px;
}

.stats-row {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}
.stat-box {
  display: flex;
  flex-direction: column;
}
.stat-number {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1;
}
.stat-text {
  font-size: 0.8rem;
  color: var(--color-gray-500);
  margin-top: 6px;
  font-weight: 600;
}

/* Values Section */
.values-section {
  background: var(--color-gray-100);
}
.section-header-center {
  text-align: center;
  margin-bottom: 48px;
}
.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.value-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 36px 28px;
  text-align: center;
  border: 1px solid var(--color-gray-200);
  transition: var(--transition);
}
.value-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: transparent;
}
.value-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 16px;
}
.value-title {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--color-primary);
}
.value-desc {
  font-size: 0.88rem;
  color: var(--color-gray-700);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .intro-grid { grid-template-columns: 1fr; gap: 32px; }
  .values-grid { grid-template-columns: 1fr; }
  .stats-row { justify-content: space-around; }
}
</style>
