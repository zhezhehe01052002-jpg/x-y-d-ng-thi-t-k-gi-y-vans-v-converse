<template>
  <section class="section brand-section">
    <div class="container">
      <div class="brand-grid">
        <!-- Vans -->
        <router-link to="/products?brand=VANS" class="brand-card vans-card">
          <div class="brand-card-inner">
            <div class="brand-img-wrap">
              <img :src="banners.brandVans" alt="Vans" class="brand-img" />
            </div>
            <div class="brand-card-overlay">
              <div class="brand-card-content">
                <span class="brand-tag">Est. 1966</span>
                <h2 class="brand-name">VANS</h2>
                <p class="brand-slogan">Off The Wall</p>
                <div class="brand-cta">Xem Bộ Sưu Tập &rarr;</div>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Converse -->
        <router-link to="/products?brand=CONVERSE" class="brand-card converse-card">
          <div class="brand-card-inner">
            <div class="brand-img-wrap">
              <img :src="banners.brandConverse" alt="Converse" class="brand-img" />
            </div>
            <div class="brand-card-overlay">
              <div class="brand-card-content">
                <span class="brand-tag">Est. 1908</span>
                <h2 class="brand-name">CONVERSE</h2>
                <p class="brand-slogan">Wear It Loud</p>
                <div class="brand-cta">Xem Bộ Sưu Tập &rarr;</div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { banners } from '../../data/images.js'
</script>

<style scoped>
.brand-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.brand-card {
  display: block;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/9;
}
.brand-card-inner { position: relative; width: 100%; height: 100%; }
.brand-img-wrap { width: 100%; height: 100%; }
.brand-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.brand-card:hover .brand-img { transform: scale(1.08); }
.brand-card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  transition: var(--transition);
}
.vans-card .brand-card-overlay {
  background: linear-gradient(to top, rgba(29, 67, 50, 0.9) 0%, rgba(29, 67, 50, 0.3) 50%, transparent 100%);
}
.converse-card .brand-card-overlay {
  background: linear-gradient(to top, rgba(107, 0, 16, 0.9) 0%, rgba(107, 0, 16, 0.3) 50%, transparent 100%);
}
.brand-card-content { padding: 28px; color: white; }
.brand-tag {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.5);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  margin-bottom: 8px;
}
.brand-name {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  line-height: 1;
}
.brand-slogan {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 16px;
  margin-top: 4px;
  font-style: italic;
}
.brand-cta {
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0;
  transform: translateY(8px);
  transition: var(--transition);
}
.brand-card:hover .brand-cta { opacity: 1; transform: translateY(0); }

@media (max-width: 768px) {
  .brand-grid { grid-template-columns: 1fr; }
}
</style>
