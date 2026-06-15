import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const USERS_STORAGE_KEY = 'auth_users'
const CURRENT_USER_STORAGE_KEY = 'auth_current_user'

const DEMO_USER = {
  id: 'demo-user-id',
  name: 'Khách Hàng Demo',
  email: 'demo@sneakerbuzz.com',
  password: '12345678'
}

export const useAuthStore = defineStore('auth', () => {
  // Load users from localStorage
  const users = ref(JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]'))
  const user = ref(JSON.parse(localStorage.getItem(CURRENT_USER_STORAGE_KEY) || 'null'))

  // Add demo user if it doesn't exist
  const initDemoUser = () => {
    const hasDemo = users.value.some(u => u.email === DEMO_USER.email)
    if (!hasDemo) {
      users.value.push(DEMO_USER)
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users.value))
    }
  }

  // Initialize demo user on store creation
  initDemoUser()

  const saveUsers = () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users.value))
  }

  const saveCurrentUser = () => {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user.value))
  }

  const login = (email, password) => {
    const foundUser = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) {
      return { success: false, message: 'Email này chưa được đăng ký tài khoản.' }
    }
    if (foundUser.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác.' }
    }

    // Set active user (exclude password for security)
    const { password: _, ...userWithoutPassword } = foundUser
    user.value = userWithoutPassword
    saveCurrentUser()
    return { success: true, message: 'Đăng nhập thành công!' }
  }

  const register = (name, email, password) => {
    const emailExists = users.value.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      return { success: false, message: 'Email này đã được sử dụng.' }
    }

    const newUser = {
      id: `usr_${Math.floor(Math.random() * 900000 + 100000)}`,
      name: name.trim(),
      email: email.trim(),
      password: password
    }

    users.value.push(newUser)
    saveUsers()

    // Auto-login
    const { password: _, ...userWithoutPassword } = newUser
    user.value = userWithoutPassword
    saveCurrentUser()

    return { success: true, message: 'Đăng ký tài khoản thành công!' }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    return { success: true, message: 'Đã đăng xuất.' }
  }

  const resetPassword = (email, newPassword) => {
    const foundUser = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) {
      return { success: false, message: 'Email này không tồn tại trên hệ thống.' }
    }

    foundUser.password = newPassword
    saveUsers()
    return { success: true, message: 'Đặt lại mật khẩu mới thành công!' }
  }

  const isAuthenticated = computed(() => user.value !== null)

  return {
    user,
    users,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword
  }
})
