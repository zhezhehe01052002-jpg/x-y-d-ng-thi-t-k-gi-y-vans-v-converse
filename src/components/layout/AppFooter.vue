<template>
  <footer class="app-footer">
    <!-- Main Footer -->
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Info -->
          <div class="footer-col footer-brand">
            <div class="footer-logo">
              <div class="logo-icon">SB</div>
              <div>
                <span class="logo-name">SNEAKER BUZZ</span>
                <p class="footer-tagline">Chính Hãng - Uy Tín - Chất Lượng</p>
              </div>
            </div>
            <p class="footer-desc">
              Sneaker Buzz là địa điểm mua sắm sneaker chính hãng hàng đầu Việt Nam. Chuyên phân phối các thương hiệu Vans, Converse với cam kết 100% hàng chính hãng.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.17 8.17 0 004.77 1.52V7a4.85 4.85 0 01-1-.31z"/></svg>
              </a>
              <a href="#" class="social-link youtube" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
              </a>
            </div>
          </div>

          <!-- Vans Column -->
          <div class="footer-col">
            <h4 class="footer-title vans-title">VANS</h4>
            <ul class="footer-links">
              <li><a href="#">Old Skool</a></li>
              <li><a href="#">Sk8-Hi</a></li>
              <li><a href="#">Slip-On</a></li>
              <li><a href="#">Era</a></li>
              <li><a href="#">Knu-Skool</a></li>
              <li><a href="#">Authentic</a></li>
            </ul>
          </div>

          <!-- Converse Column -->
          <div class="footer-col">
            <h4 class="footer-title converse-title">CONVERSE</h4>
            <ul class="footer-links">
              <li><a href="#">Chuck Taylor</a></li>
              <li><a href="#">Chuck 70</a></li>
              <li><a href="#">Run Star Hike</a></li>
              <li><a href="#">One Star</a></li>
              <li><a href="#">Jack Purcell</a></li>
              <li><a href="#">Run Star Motion</a></li>
            </ul>
          </div>

          <!-- Info Column -->
          <div class="footer-col">
            <h4 class="footer-title">Thông Tin</h4>
            <ul class="footer-links">
              <li><router-link to="/about">Giới thiệu</router-link></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><router-link to="/size-guide">Hướng dẫn chọn size</router-link></li>
              <li><a href="#">Hệ thống cửa hàng</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <!-- Contact Column -->
          <div class="footer-col">
            <h4 class="footer-title">Liên Hệ</h4>
            <ul class="footer-contact">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 9.7a19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.34a16 16 0 006.72 6.72l1.41-1.41a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <span>0962.781.020</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>hello@sneakerbuzz.vn</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>150 Nguyễn Chí Thanh, Hà Nội</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>8:00 - 22:00, Tất cả các ngày</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-inner">
          <p>© 2024 Sneaker Buzz. Bản quyền thuộc về Sneaker Buzz Vietnam.</p>
          <div class="payment-methods">
            <span class="payment-badge">VISA</span>
            <span class="payment-badge">MasterCard</span>
            <span class="payment-badge">Momo</span>
            <span class="payment-badge">ZaloPay</span>
            <span class="payment-badge">COD</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.app-footer {
  background: #111111;
  color: rgba(255,255,255,0.85);
  margin-top: auto;
}

.footer-main {
  padding: 60px 0 48px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1fr 1.2fr;
  gap: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: white;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.logo-name {
  display: block;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: white;
}
.footer-tagline {
  font-size: 0.7rem;
  color: var(--color-accent);
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.footer-desc {
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.6);
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 10px;
}
.social-link {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.08);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.7);
  transition: var(--transition-fast);
}
.social-link:hover {
  background: var(--color-accent);
  color: white;
  transform: translateY(-2px);
}

.footer-title {
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: white;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255,255,255,0.1);
}
.vans-title { border-bottom-color: var(--color-vans); }
.converse-title { border-bottom-color: var(--color-converse); }

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.footer-links a {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  transition: var(--transition-fast);
}
.footer-links a:hover {
  color: white;
  padding-left: 4px;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.65);
}
.footer-contact svg { flex-shrink: 0; margin-top: 2px; }

.footer-bottom {
  padding: 16px 0;
}
.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-bottom p {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
}

.payment-methods {
  display: flex;
  gap: 8px;
  align-items: center;
}
.payment-badge {
  padding: 3px 8px;
  background: rgba(255,255,255,0.08);
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 600;
  font-family: var(--font-heading);
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.05em;
}

@media (max-width: 1024px) {
  .footer-grid { grid-template-columns: 1fr 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
  .footer-brand { grid-column: 1 / -1; }
  .footer-bottom-inner { flex-direction: column; gap: 12px; text-align: center; }
}
</style>
