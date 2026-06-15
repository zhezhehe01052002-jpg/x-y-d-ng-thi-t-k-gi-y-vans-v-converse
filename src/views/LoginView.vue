<template>
  <main class="auth-page">
    <div class="container">
      <div class="auth-card">
        <!-- Auth Header -->
        <div class="auth-header">
          <h2 class="auth-title">Đăng Nhập</h2>
          <p class="auth-subtitle">Chào mừng bạn trở lại với Sneaker Buzz</p>
        </div>

        <!-- Auth Body -->
        <div class="auth-body">
          <!-- Demo Hint -->
          <div class="demo-account-hint">
            <p>💡 Tài khoản trải nghiệm nhanh:</p>
            <ul>
              <li><strong>Email:</strong> demo@sneakerbuzz.com</li>
              <li><strong>Mật khẩu:</strong> 12345678</li>
            </ul>
          </div>

          <!-- Toast Alert Inside Form if needed -->
          <div v-if="alertMsg" :class="['auth-alert', alertSuccess ? 'auth-alert-success' : 'auth-alert-error']">
            <span>{{ alertSuccess ? '✓' : '⚠️' }}</span>
            <span>{{ alertMsg }}</span>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Email -->
            <div class="auth-form-group">
              <label for="email" class="auth-label">Địa chỉ Email</label>
              <div class="auth-input-wrapper">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="name@example.com"
                  class="auth-input"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div class="auth-form-group">
              <label for="password" class="auth-label">Mật khẩu</label>
              <div class="auth-input-wrapper">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="auth-input"
                  required
                />
                <button
                  type="button"
                  class="toggle-pw-btn"
                  @click="showPassword = !showPassword"
                  :title="showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'"
                >
                  <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Form Footer -->
            <div class="auth-form-footer">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <router-link to="/forgot-password" class="forgot-pw-link">Quên mật khẩu?</router-link>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary auth-submit-btn" :disabled="isLoading">
              <span v-if="isLoading">Đang đăng nhập...</span>
              <span v-else>Đăng Nhập</span>
              <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/>
              </svg>
            </button>
          </form>
        </div>

        <!-- Auth Footer -->
        <div class="auth-footer">
          Chưa có tài khoản? 
          <router-link :to="registerRoute" class="auth-footer-link">Đăng ký ngay</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useToastStore } from '../stores/toast.js'

const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)
const isLoading = ref(false)

const alertMsg = ref('')
const alertSuccess = ref(false)

const registerRoute = '/register'

const handleSubmit = async () => {
  if (!email.value || !password.value) return

  isLoading.value = true
  alertMsg.value = ''
  
  // Artificial delay for better UX feel
  await new Promise(resolve => setTimeout(resolve, 800))

  const result = authStore.login(email.value, password.value)
  isLoading.value = false

  if (result.success) {
    alertSuccess.value = true
    alertMsg.value = result.message
    toastStore.showToast(result.message, 'success')
    
    // Luôn đưa thẳng tới trang chủ
    setTimeout(() => {
      router.push('/')
    }, 500)
  } else {
    alertSuccess.value = false
    alertMsg.value = result.message
    toastStore.showToast(result.message, 'error')
  }
}


</script>
