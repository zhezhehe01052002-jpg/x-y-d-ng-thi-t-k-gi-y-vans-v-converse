<template>
  <div class="toast-container">
    <transition-group name="toast-list">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id" 
        :class="['toast-item', `toast-${toast.type}`]"
      >
        <span class="toast-icon">
          <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else-if="toast.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="toastStore.remove(toast.id)">&times;</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '../../stores/toast.js'

const toastStore = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;
  width: calc(100% - 48px);
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  padding: 14px 20px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.toast-success {
  background: var(--color-vans);
}

.toast-error {
  background: var(--color-converse);
}

.toast-info {
  background: var(--color-primary);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}
.toast-close:hover {
  color: white;
}

/* Animations transition-group */
.toast-list-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-list-leave-active {
  transition: all 0.25s ease;
  position: absolute; /* cần thiết cho move transition */
  width: 100%;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
