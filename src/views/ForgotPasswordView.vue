<template>
  <main class="auth-page">
    <div class="container">
      <div class="auth-card">
        <!-- Auth Header -->
        <div class="auth-header">
          <h2 class="auth-title">Quên Mật Khẩu</h2>
          <p class="auth-subtitle">
            {{ step === 1 ? 'Nhập email để nhận mã khôi phục tài khoản' : 'Nhập mã xác thực OTP và mật khẩu mới' }}
          </p>
        </div>

        <!-- Auth Body -->
        <div class="auth-body">
          <!-- Toast Alert Inside Form -->
          <div v-if="alertMsg" :class="['auth-alert', alertSuccess ? 'auth-alert-success' : 'auth-alert-error']">
            <span>{{ alertSuccess ? '✓' : '⚠️' }}</span>
            <span>{{ alertMsg }}</span>
          </div>

          <!-- Step 1: Request OTP -->
          <form v-if="step === 1" @submit.prevent="handleRequestOtp">
            <div class="auth-form-group">
              <label for="email" class="auth-label">Địa chỉ Email của bạn</label>
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

            <!-- Submit Request -->
            <button type="submit" class="btn btn-primary auth-submit-btn" :disabled="isLoading">
              <span v-if="isLoading">Đang kiểm tra...</span>
              <span v-else>Gửi Mã Xác Thực OTP</span>
              <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
            </button>
          </form>

          <!-- Step 2: Verification and Reset Password -->
          <form v-else @submit.prevent="handleResetPassword">
            <!-- Simulated OTP Hint -->
            <div class="demo-account-hint" style="background: #eff6ff; border-color: #bfdbfe; color: #1e3a8a;">
              <p>🔑 Mã xác thực OTP giả lập của bạn:</p>
              <p style="font-size: 1.4rem; font-weight: 800; text-align: center; letter-spacing: 0.2em; margin: 8px 0; color: var(--color-primary);">
                {{ generatedOtp }}
              </p>
              <p style="font-size: 0.78rem; text-align: center; font-weight: normal; margin-bottom: 0;">
                (Hệ thống tự động hiển thị mã này để giả lập hành vi nhận email)
              </p>
            </div>

            <!-- OTP Input -->
            <div class="auth-form-group">
              <label for="otp" class="auth-label">Nhập mã OTP (6 số)</label>
              <div class="auth-input-wrapper">
                <input
                  id="otp"
                  v-model="otpInput"
                  type="text"
                  placeholder="------"
                  maxlength="6"
                  class="auth-input"
                  style="text-align: center; letter-spacing: 0.1em; font-weight: 700;"
                  required
                />
              </div>
            </div>

            <!-- New Password -->
            <div class="auth-form-group">
              <label for="password" class="auth-label">Mật khẩu mới</label>
              <div class="auth-input-wrapper">
                <input
                  id="password"
                  v-model="newPassword"
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

            <!-- Confirm New Password -->
            <div class="auth-form-group">
              <label for="confirmPassword" class="auth-label">Xác nhận mật khẩu mới</label>
              <div class="auth-input-wrapper">
                <input
                  id="confirmPassword"
                  v-model="confirmNewPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Nhập lại mật khẩu mới"
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

            <!-- Submit Reset -->
            <button type="submit" class="btn btn-primary auth-submit-btn" :disabled="isLoading">
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>Cập Nhật Mật Khẩu</span>
              <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            <!-- Back to step 1 -->
            <div style="text-align: center; margin-top: 10px;">
              <a href="#" @click.prevent="step = 1" style="font-size: 0.85rem; color: var(--color-gray-500); text-decoration: none;">
                ← Quay lại nhập email
              </a>
            </div>
          </form>
        </div>

        <!-- Auth Footer -->
        <div class="auth-footer">
          Quay lại trang 
          <router-link to="/login" class="auth-footer-link">Đăng nhập</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useToastStore } from '../stores/toast.js'

const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()

const step = ref(1)
const email = ref('')
const otpInput = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

const generatedOtp = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const alertMsg = ref('')
const alertSuccess = ref(false)

const handleRequestOtp = async () => {
  if (!email.value) return

  isLoading.value = true
  alertMsg.value = ''

  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Check if email exists in auth store
  const emailExists = authStore.users.some(u => u.email.toLowerCase() === email.value.toLowerCase())
  isLoading.value = false

  if (!emailExists) {
    alertSuccess.value = false
    alertMsg.value = 'Địa chỉ email này chưa được đăng ký trên hệ thống.'
    toastStore.showToast(alertMsg.value, 'error')
    return
  }

  // Generate 6-digit random OTP code
  generatedOtp.value = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Transition to step 2
  step.value = 2
  alertSuccess.value = true
  alertMsg.value = `Mã OTP đã được gửi đến email của bạn. Hãy kiểm tra!`
  toastStore.showToast(`Gửi mã OTP thành công! Mã OTP của bạn là: ${generatedOtp.value}`, 'success', 8000)
}

const handleResetPassword = async () => {
  alertMsg.value = ''

  if (otpInput.value !== generatedOtp.value) {
    alertSuccess.value = false
    alertMsg.value = 'Mã xác thực OTP không chính xác. Vui lòng thử lại.'
    toastStore.showToast(alertMsg.value, 'error')
    return
  }

  if (newPassword.value.length < 6) {
    alertSuccess.value = false
    alertMsg.value = 'Mật khẩu mới phải có độ dài ít nhất 6 ký tự.'
    toastStore.showToast(alertMsg.value, 'error')
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    alertSuccess.value = false
    alertMsg.value = 'Mật khẩu xác nhận không khớp.'
    toastStore.showToast(alertMsg.value, 'error')
    return
  }

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  const result = authStore.resetPassword(email.value, newPassword.value)
  isLoading.value = false

  if (result.success) {
    alertSuccess.value = true
    alertMsg.value = result.message
    toastStore.showToast(result.message, 'success')
    
    // Redirect to login page after 1.5 seconds
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } else {
    alertSuccess.value = false
    alertMsg.value = result.message
    toastStore.showToast(result.message, 'error')
  }
}
</script>
