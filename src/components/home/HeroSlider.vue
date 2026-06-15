<template>
  <section class="hero-section">
    <div class="hero-slider">
      <transition name="hero-slide" mode="out-in">
        <div class="hero-slide" :key="currentSlide" :style="{ background: slides[currentSlide].bg }">
          <div class="container">
            <div class="hero-content">
              <div class="hero-text" data-animate>
                <span class="hero-eyebrow">{{ slides[currentSlide].eyebrow }}</span>
                <h1 class="hero-title">{{ slides[currentSlide].title }}</h1>
                <p class="hero-desc">{{ slides[currentSlide].desc }}</p>
                <div class="hero-ctas">
                  <router-link :to="slides[currentSlide].link" class="btn btn-primary hero-cta">
                    Khám phá ngay
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </router-link>
                  <router-link to="/products?badge=SALE" class="btn btn-outline hero-cta-secondary">Sale Up To 50%</router-link>
                </div>
              </div>
              <div class="hero-visual">
                <div class="hero-shoe-wrap">
                  <img :src="slides[currentSlide].img" :alt="slides[currentSlide].title" class="hero-shoe" />
                  <div class="hero-circle" :style="{ background: slides[currentSlide].circleColor }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Slider Controls -->
      <div class="slider-dots">
        <button v-for="(_, i) in slides" :key="i" :class="['dot', { active: i === currentSlide }]" @click="goToSlide(i)"></button>
      </div>
      <button class="slider-arrow prev" @click="prevSlide">‹</button>
      <button class="slider-arrow next" @click="nextSlide">›</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  slides: { type: Array, required: true }
})

const currentSlide = ref(0)
let autoPlay = null

const goToSlide = (i) => { currentSlide.value = i }
const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % 3 }
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + 3) % 3 }

onMounted(() => { autoPlay = setInterval(nextSlide, 5000) })
onUnmounted(() => { clearInterval(autoPlay) })
</script>

<style scoped>
.hero-section { position: relative; overflow: hidden; }
.hero-slider { position: relative; }

.hero-slide {
  min-height: 580px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  padding: 64px 0;
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  margin-bottom: 12px;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 900;
  color: white;
  line-height: 0.95;
  letter-spacing: -0.02em;
  white-space: pre-line;
  text-shadow: 0 4px 32px rgba(0,0,0,0.3);
  margin-bottom: 20px;
}

.hero-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 420px;
}

.hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
.hero-cta { font-size: 0.9rem; padding: 14px 28px; }
.hero-cta-secondary {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: white;
  border: 2px solid rgba(255,255,255,0.5);
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}
.hero-cta-secondary:hover { background: rgba(255,255,255,0.15); border-color: white; }

.hero-visual { display: flex; align-items: center; justify-content: center; position: relative; }
.hero-shoe-wrap { position: relative; }
.hero-circle {
  width: 420px; height: 420px; border-radius: 50%;
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0;
}
.hero-shoe {
  width: 100%; max-width: 480px; height: 360px; object-fit: cover;
  border-radius: var(--radius-lg); position: relative; z-index: 1;
  box-shadow: 0 32px 80px rgba(0,0,0,0.4);
  transform: rotate(-3deg); transition: transform 0.5s ease;
}
.hero-shoe:hover { transform: rotate(0deg) scale(1.02); }

.slider-dots {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 8px; z-index: 10;
}
.dot {
  width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4);
  border: none; cursor: pointer; transition: var(--transition);
}
.dot.active { background: white; width: 24px; border-radius: 4px; }

.slider-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
  color: white; width: 48px; height: 48px; border-radius: 50%;
  font-size: 1.8rem; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: var(--transition-fast); z-index: 10; backdrop-filter: blur(4px);
}
.slider-arrow:hover { background: rgba(255,255,255,0.3); }
.slider-arrow.prev { left: 24px; }
.slider-arrow.next { right: 24px; }

.hero-slide-enter-active, .hero-slide-leave-active { transition: opacity 0.6s ease; }
.hero-slide-enter-from, .hero-slide-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .hero-content { grid-template-columns: 1fr; }
  .hero-visual { display: none; }
  .slider-arrow { display: none; }
}
@media (max-width: 480px) {
  .hero-slide { min-height: 400px; }
}
</style>
