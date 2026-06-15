<template>
  <div class="support-chat-wrapper">
    <!-- Chat Toggle Button -->
    <button 
      class="chat-trigger-btn" 
      :class="{ 'chat-active': isOpen }"
      @click="toggleChat"
      aria-label="Hỗ trợ khách hàng"
    >
      <div v-if="!isOpen" class="trigger-icon-wrap">
        <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="unread-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
      </div>
      <span v-else class="close-icon">✕</span>
    </button>

    <!-- Chat Box Window -->
    <transition name="chat-slide">
      <div v-if="isOpen" class="chat-window">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="agent-info">
            <div class="agent-avatar-wrap">
              <span class="agent-avatar">🤖</span>
              <span class="status-dot"></span>
            </div>
            <div>
              <p class="agent-name">Sneaker Buzz Assistant</p>
              <p class="agent-status">Hỗ trợ tự động (Online)</p>
            </div>
          </div>
          <button class="chat-close" @click="isOpen = false">✕</button>
        </div>

        <!-- Chat Messages Area -->
        <div class="chat-messages" ref="messagesContainer">
          <div 
            v-for="(msg, idx) in messages" 
            :key="idx" 
            :class="['message-bubble-wrap', msg.sender]"
          >
            <span class="message-avatar" v-if="msg.sender === 'agent'">SB</span>
            <div class="message-bubble">
              <p class="message-text" v-html="formatMessageText(msg.text)"></p>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message-bubble-wrap agent">
            <span class="message-avatar">SB</span>
            <div class="message-bubble typing-bubble">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Replies -->
        <div class="quick-replies-wrap" v-if="showQuickReplies">
          <p class="quick-title">💡 Chọn câu hỏi nhanh:</p>
          <div class="quick-chips">
            <button 
              v-for="chip in quickReplies" 
              :key="chip.text" 
              class="quick-chip-btn"
              @click="handleQuickReply(chip)"
            >
              {{ chip.text }}
            </button>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <div class="chat-input-bar">
          <input 
            v-model="userInput" 
            type="text" 
            placeholder="Nhập tin nhắn hỗ trợ..." 
            class="chat-input"
            @keyup.enter="sendUserMessage"
          />
          <button 
            class="send-btn" 
            :disabled="!userInput.trim()"
            @click="sendUserMessage"
            aria-label="Gửi"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)
const unreadCount = ref(0)
const messagesContainer = ref(null)
const showQuickReplies = ref(true)

const messages = ref([])

const quickReplies = [
  { text: '👟 Đổi trả hàng thế nào?', keyword: 'đổi trả' },
  { text: '🚚 Bao giờ giao hàng?', keyword: 'giao hàng' },
  { text: '🔥 Đang có khuyến mãi gì?', keyword: 'khuyến mãi' },
  { text: '📏 Tư vấn chọn size giày', keyword: 'size' }
]

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    scrollToBottom()
  }
}

const formatTime = (timestamp) => {
  const d = new Date(timestamp)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const formatMessageText = (text) => {
  return text.replace(/\n/g, '<br/>')
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Bot responses database
const botAnswers = {
  'đổi trả': 'Sneaker Buzz hỗ trợ đổi trả hàng **MIỄN PHÍ** trong vòng **30 ngày** kể từ ngày nhận hàng với điều kiện sản phẩm chưa qua sử dụng, còn nguyên tem mác và hộp giày kèm hóa đơn bạn nhé! 👟',
  'giao hàng': 'Thời gian giao hàng dự kiến:\n- **Hà Nội & TP. HCM**: Giao nhanh trong vòng **24H**.\n- **Các tỉnh thành khác**: Nhận được hàng từ **2-3 ngày làm việc**.\nĐặc biệt, mọi đơn hàng từ **500.000đ** đều được **MIỄN PHÍ VẬN CHUYỂN**! 🚚',
  'khuyến mãi': 'Hiện tại shop đang có các ưu đãi cực khủng:\n- Mã **SALE10**: Giảm ngay **10%** cho mọi đơn hàng.\n- Mã **BUZZ20**: Giảm ngay **20%** cho đơn hàng tiếp theo.\nBạn hãy nhập mã giảm giá này tại bước thanh toán trong giỏ hàng nha! 🔥',
  'size': 'Hầu hết các mẫu Vans và Converse đều chuẩn size châu Âu chuẩn (True to size). Tuy nhiên, dòng Converse Chuck 1970s form hơi dài nên bạn có thể lùi nửa size (down 0.5 size).\nBạn có thể cho mình biết số đo chiều dài chân (cm) để mình tư vấn size chính xác nhất nhé! 📏',
  'chào': 'Xin chào! Mình là trợ lý ảo Sneaker Buzz. Mình có thể giúp gì cho bạn hôm nay? 😊 Bạn có thể chọn câu hỏi nhanh hoặc gõ tin nhắn để mình hỗ trợ nhé!',
  'vans': 'Sneaker Buzz phân phối chính hãng các dòng giày VANS đình đám như Old Skool, Classic Slip-On, Sk8-Hi, Authentic... cam kết chính hãng 100%. Bạn có thể xem thêm trong danh mục sản phẩm của shop nhé! 🏁',
  'converse': 'Các dòng giày Converse chính hãng tại Sneaker Buzz luôn đầy đủ mẫu mã như Chuck Taylor All Star Classic, Chuck 70s Vintage, One Star... mẫu mã luôn được cập nhật mới nhất! ⭐️',
  'default': 'Cảm ơn bạn đã nhắn tin. Mình là Chatbot hỗ trợ tự động của Sneaker Buzz.\n\nHệ thống ghi nhận yêu cầu của bạn. Nếu cần hỗ trợ khẩn cấp hoặc trao đổi trực tiếp với nhân viên, bạn vui lòng gọi Hotline: **1800 1234** (Miễn phí) để được hỗ trợ tốt nhất nha! 📞'
}

const handleQuickReply = (chip) => {
  // Push user message
  messages.value.push({
    sender: 'user',
    text: chip.text,
    timestamp: new Date().toISOString()
  })
  scrollToBottom()

  // Trigger agent typing
  triggerBotReply(chip.keyword)
}

const sendUserMessage = () => {
  const text = userInput.value.trim()
  if (!text) return

  messages.value.push({
    sender: 'user',
    text: text,
    timestamp: new Date().toISOString()
  })
  userInput.value = ''
  scrollToBottom()

  // Analyze keywords to trigger reply
  const lowerText = text.toLowerCase()
  let matchedKeyword = 'default'

  if (lowerText.includes('đổi') || lowerText.includes('trả') || lowerText.includes('hoàn tiền') || lowerText.includes('lỗi')) {
    matchedKeyword = 'đổi trả'
  } else if (lowerText.includes('ship') || lowerText.includes('giao') || lowerText.includes('bao lâu') || lowerText.includes('nhận')) {
    matchedKeyword = 'giao hàng'
  } else if (lowerText.includes('khuyến mãi') || lowerText.includes('mã') || lowerText.includes('giảm giá') || lowerText.includes('sale') || lowerText.includes('coupon')) {
    matchedKeyword = 'khuyến mãi'
  } else if (lowerText.includes('size') || lowerText.includes('kích cỡ') || lowerText.includes('chân')) {
    matchedKeyword = 'size'
  } else if (lowerText.includes('vans') || lowerText.includes('🏁')) {
    matchedKeyword = 'vans'
  } else if (lowerText.includes('converse') || lowerText.includes('star')) {
    matchedKeyword = 'converse'
  } else if (lowerText.includes('chào') || lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('ơi')) {
    matchedKeyword = 'chào'
  }

  triggerBotReply(matchedKeyword)
}

const triggerBotReply = (keyword) => {
  isTyping.value = true
  scrollToBottom()

  // Simulate delay
  setTimeout(() => {
    isTyping.value = false
    const replyText = botAnswers[keyword] || botAnswers['default']
    messages.value.push({
      sender: 'agent',
      text: replyText,
      timestamp: new Date().toISOString()
    })
    
    // Save state
    sessionStorage.setItem('support_chat_history', JSON.stringify(messages.value))
    
    if (!isOpen.value) {
      unreadCount.value++
    }
    
    scrollToBottom()
  }, 1200)
}

// Watch messages changes to keep storage in sync
watch(messages, (newVal) => {
  sessionStorage.setItem('support_chat_history', JSON.stringify(newVal))
}, { deep: true })

onMounted(() => {
  // Load message history from sessionStorage
  const saved = sessionStorage.getItem('support_chat_history')
  if (saved) {
    messages.value = JSON.parse(saved)
  } else {
    // Initial welcome message after a small delay
    setTimeout(() => {
      if (messages.value.length === 0) {
        messages.value.push({
          sender: 'agent',
          text: 'Xin chào! Cám ơn bạn đã ghé thăm Sneaker Buzz. Mình là Bot hỗ trợ tự động. Mình có thể giúp gì cho bạn hôm nay? 😊',
          timestamp: new Date().toISOString()
        })
      }
    }, 1500)
  }
})
</script>

<style scoped>
.support-chat-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1500;
  font-family: var(--font-body);
}

/* Toggle Trigger Button */
.chat-trigger-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  outline: none;
}
.chat-trigger-btn:hover {
  transform: scale(1.1) translateY(-2px);
  background: linear-gradient(135deg, var(--color-accent) 0%, #b82531 100%);
  box-shadow: 0 12px 36px rgba(230, 57, 70, 0.4);
}
.chat-trigger-btn.chat-active {
  transform: rotate(90deg);
  background: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.trigger-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-icon {
  animation: pulse 2.5s infinite;
}
.unread-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-accent);
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}
.close-icon {
  font-size: 1.25rem;
  font-weight: 700;
}

/* Chat Window */
.chat-window {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 380px;
  height: 520px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-gray-200);
  transform-origin: bottom right;
}

/* Header */
.chat-header {
  background: var(--color-primary);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.agent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.agent-avatar-wrap {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}
.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
}
.agent-name {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.agent-status {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.6);
  margin-top: 1px;
}
.chat-close {
  color: rgba(255,255,255,0.7);
  font-size: 1.1rem;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-fast);
}
.chat-close:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

/* Messages Area */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
}

.message-bubble-wrap {
  display: flex;
  gap: 10px;
  max-width: 85%;
}
.message-bubble-wrap.agent {
  align-self: flex-start;
}
.message-bubble-wrap.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  line-height: 1.45;
  font-size: 0.85rem;
}
.agent .message-bubble {
  background: white;
  color: var(--color-gray-900);
  border-top-left-radius: 2px;
  border: 1px solid var(--color-gray-200);
}
.user .message-bubble {
  background: var(--color-primary);
  color: white;
  border-top-right-radius: 2px;
}

.message-text :deep(strong) {
  font-weight: 700;
}

.message-time {
  display: block;
  font-size: 0.62rem;
  color: var(--color-gray-500);
  margin-top: 4px;
  text-align: right;
}
.user .message-time {
  color: rgba(255,255,255,0.7);
}

/* Typing Indicator */
.typing-bubble {
  padding: 12px 16px;
}
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 12px;
}
.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--color-gray-500);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Quick Replies */
.quick-replies-wrap {
  padding: 12px 16px;
  border-top: 1px solid var(--color-gray-200);
  background: white;
}
.quick-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.quick-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.quick-chip-btn {
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  padding: 6px 12px;
  font-size: 0.78rem;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
}
.quick-chip-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Input Bar */
.chat-input-bar {
  padding: 12px 16px;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  gap: 8px;
  background: white;
}
.chat-input {
  flex: 1;
  height: 38px;
  border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  padding: 0 14px;
  font-size: 0.85rem;
  outline: none;
  transition: var(--transition-fast);
}
.chat-input:focus {
  border-color: var(--color-primary);
}
.send-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}
.send-btn:hover {
  background: var(--color-accent);
}
.send-btn:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-400);
  cursor: not-allowed;
}

/* Transitions */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(24px);
}

@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 32px);
    right: -8px;
    height: calc(80vh - 60px);
  }
}
</style>
