<template>
  <main class="size-guide-page">
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="container">
        <h1 class="page-title">Hướng Dẫn Chọn Size Giày</h1>
        <p class="breadcrumb">
          <router-link to="/">Trang chủ</router-link>
          <span>/</span>
          <span>Chọn size</span>
        </p>
      </div>
    </div>

    <!-- Size Guide Content -->
    <section class="section">
      <div class="container guide-container">
        <!-- Steps to measure feet -->
        <div class="measure-guide">
          <h2 class="guide-title">Cách Đo Chiều Dài Bàn Chân</h2>
          <div class="steps-grid">
            <div class="step-card">
              <span class="step-num">1</span>
              <h4>Chuẩn Bị</h4>
              <p>Đặt một tờ giấy A4 sát bức tường. Đặt chân của bạn lên tờ giấy sao cho gót chân chạm nhẹ vào tường.</p>
            </div>
            <div class="step-card">
              <span class="step-num">2</span>
              <h4>Đánh Dấu</h4>
              <p>Dùng bút vẽ lại mũi bàn chân dài nhất (ngón cái hoặc ngón trỏ) vuông góc với mặt giấy.</p>
            </div>
            <div class="step-card">
              <span class="step-num">3</span>
              <h4>Đo Chiều Dài</h4>
              <p>Dùng thước kẻ đo khoảng cách từ mép giấy (nơi chạm tường) đến điểm bạn vừa đánh dấu (cm).</p>
            </div>
            <div class="step-card">
              <span class="step-num">4</span>
              <h4>Tra Bảng</h4>
              <p>Đối chiếu chiều dài bàn chân vừa đo được với bảng quy đổi size dưới đây để tìm size phù hợp.</p>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Size Charts -->
        <div class="charts-section">
          <h2 class="guide-title">Bảng Quy Đổi Size Chuẩn</h2>
          <div class="tabs-control">
            <button 
              v-for="brand in ['VANS', 'CONVERSE']" 
              :key="brand" 
              :class="['tab-btn', { active: activeBrand === brand }]"
              @click="activeBrand = brand"
            >
              Giày {{ brand }}
            </button>
          </div>

          <div class="table-wrap">
            <table class="size-table">
              <thead>
                <tr>
                  <th>Size VN/EU</th>
                  <th>Size US (Men)</th>
                  <th>Size US (Women)</th>
                  <th>Chiều dài chân (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in currentChart" :key="row.eu">
                  <td><strong>{{ row.eu }}</strong></td>
                  <td>{{ row.usMen }}</td>
                  <td>{{ row.usWomen }}</td>
                  <td><span class="cm-highlight">{{ row.cm }} cm</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="chart-note">* Lưu ý: Form giày Converse và Vans thường rộng hơn giày thể thao khác khoảng 0.5 size. Nếu chân dày hoặc bè ngang, nên cân nhắc lấy tăng lên 1 size.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeBrand = ref('VANS')

const vansChart = [
  { eu: 35, usMen: 3.5, usWomen: 5.0, cm: 21.5 },
  { eu: 36, usMen: 4.5, usWomen: 6.0, cm: 22.5 },
  { eu: 37, usMen: 5.5, usWomen: 7.0, cm: 23.5 },
  { eu: 38, usMen: 6.0, usWomen: 7.5, cm: 24.0 },
  { eu: 39, usMen: 7.0, usWomen: 8.5, cm: 25.0 },
  { eu: 40, usMen: 7.5, usWomen: 9.0, cm: 25.5 },
  { eu: 41, usMen: 8.5, usWomen: 10.0, cm: 26.5 },
  { eu: 42, usMen: 9.0, usWomen: 10.5, cm: 27.0 },
  { eu: 43, usMen: 10.0, usWomen: 11.5, cm: 28.0 },
  { eu: 44, usMen: 10.5, usWomen: 12.0, cm: 28.5 }
]

const converseChart = [
  { eu: 35, usMen: 3.0, usWomen: 5.0, cm: 22.0 },
  { eu: 36, usMen: 3.5, usWomen: 5.5, cm: 22.5 },
  { eu: 37, usMen: 4.5, usWomen: 6.5, cm: 23.5 },
  { eu: 38, usMen: 5.5, usWomen: 7.5, cm: 24.5 },
  { eu: 39, usMen: 6.0, usWomen: 8.0, cm: 24.8 },
  { eu: 40, usMen: 7.0, usWomen: 9.0, cm: 25.5 },
  { eu: 41, usMen: 7.5, usWomen: 9.5, cm: 26.0 },
  { eu: 42, usMen: 8.5, usWomen: 10.5, cm: 27.0 },
  { eu: 43, usMen: 9.5, usWomen: 11.5, cm: 28.0 },
  { eu: 44, usMen: 10.0, usWomen: 12.0, cm: 28.5 }
]

const currentChart = computed(() => {
  return activeBrand.value === 'VANS' ? vansChart : converseChart
})
</script>

<style scoped>
.size-guide-page {
  min-height: 100vh;
}

.page-hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  padding: 40px 0;
}
.page-title {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
}
.breadcrumb a { color: rgba(255,255,255,0.8); transition: var(--transition-fast); }
.breadcrumb a:hover { color: white; }

.guide-container {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.guide-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 24px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.step-card {
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  padding: 20px;
  position: relative;
  border: 1px solid var(--color-gray-200);
}
.step-num {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-accent);
  margin-bottom: 10px;
  display: block;
}
.step-card h4 {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.step-card p {
  font-size: 0.8rem;
  color: var(--color-gray-700);
  line-height: 1.5;
}

.divider {
  height: 1px;
  background: var(--color-gray-200);
}

/* Tabs */
.tabs-control {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.tab-btn {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-gray-300);
  cursor: pointer;
  transition: var(--transition-fast);
  background: white;
}
.tab-btn.active, .tab-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Table */
.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
}
.size-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.size-table th, .size-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-gray-200);
  font-size: 0.88rem;
}
.size-table th {
  background: var(--color-gray-100);
  font-family: var(--font-heading);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}
.size-table tr:last-child td {
  border-bottom: none;
}
.cm-highlight {
  font-weight: bold;
  color: var(--color-primary);
}
.chart-note {
  font-size: 0.8rem;
  color: var(--color-gray-500);
  line-height: 1.5;
  margin-top: 14px;
}

@media (max-width: 768px) {
  .steps-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .steps-grid { grid-template-columns: 1fr; }
}
</style>
