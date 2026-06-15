<template>
  <main class="auth-page">
    <div class="container">
      <div class="auth-card">
        <!-- Auth Header -->
        <div class="auth-header">
          <h2 class="auth-title">Đăng Ký</h2>
          <p class="auth-subtitle">Tạo tài khoản để nhận nhiều ưu đãi từ Sneaker Buzz</p>
        </div>

        <!-- Auth Body -->
        <div class="auth-body">
          <!-- Toast Alert Inside Form -->
          <div v-if="alertMsg" :class="['auth-alert', alertSuccess ? 'auth-alert-success' : 'auth-alert-error']">
            <span>{{ alertSuccess ? '✓' : '⚠️' }}</span>
            <span>{{ alertMsg }}</span>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Full Name -->
            <div class="auth-form-group">
              <label for="name" class="auth-label">Họ và Tên</label>
              <div class="auth-input-wrapper">
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  class="auth-input"
                  required
                />
              </div>
            </div>

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
                  placeholder="Tối thiểu 6 ký tự"
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

            <!-- Confirm Password -->
            <div class="auth-form-group">
              <label for="confirmPassword" class="auth-label">Xác nhận mật khẩu</label>
              <div class="auth-input-wrapper">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Nhập lại mật khẩu"
                  class="auth-input"
                  required
                />
                <button
                  type="button"
                  class="toggle-pw-btn"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :title="showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'"
                >
                  <svg v-if="showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary auth-submit-btn" :disabled="isLoading">
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>Đăng Ký Tài Khoản</span>
              <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </button>
          </form>
        </div>

        <!-- Auth Footer -->
        <div class="auth-footer">
          Đã có tài khoản? 
          <router-link :to="loginRoute" class="auth-footer-link">Đăng nhập</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const alertMsg = ref('')
const alertSuccess = ref(false)

const loginRoute = '/login'

const validateForm = () => {
  if (name.value.trim().length < 2) {
    alertMsg.value = 'Họ và tên phải có ít nhất 2 ký tự.'
    return false
  }

  // Regex email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    alertMsg.value = 'Địa chỉ email không đúng định dạng.'
    return false
  }

  if (password.value.length < 6) {
    alertMsg.value = 'Mật khẩu phải có độ dài ít nhất 6 ký tự.'
    return false
  }

  if (password.value !== confirmPassword.value) {
    alertMsg.value = 'Mật khẩu xác nhận không khớp.'
    return false
  }

  return true
}

const handleSubmit = async () => {
  alertMsg.value = ''
  
  if (!validateForm()) {
    toastStore.showToast(alertMsg.value, 'error')
    return
  }

  isLoading.value = true
  
  // Artificial delay for better UX feel
  await new Promise(resolve => setTimeout(resolve, 800))

  const result = authStore.register(name.value, email.value, password.value)
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
