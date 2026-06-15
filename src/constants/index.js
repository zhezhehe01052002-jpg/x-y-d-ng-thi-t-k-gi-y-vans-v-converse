/**
 * Constants: Payment methods, promo codes, and other business constants
 * Centralizes magic values that were scattered across CartView
 */

export const PAYMENT_METHODS = [
  { id: 'card', icon: '💳', name: 'Thẻ ngân hàng', desc: 'VISA / Mastercard' },
  { id: 'momo', icon: '📱', name: 'MoMo', desc: 'Ví điện tử MoMo' },
  { id: 'qr', icon: '🏦', name: 'QR Chuyển khoản', desc: 'Ngân hàng nội địa' },
  { id: 'cod', icon: '💵', name: 'COD', desc: 'Thanh toán khi nhận hàng' },
]

export const PROMO_CODES = {
  SALE10: 0.1,
  BUZZ20: 0.2,
}

export const QR_TIMEOUT_SECONDS = 15 * 60  // 15 minutes

export const BANK_INFO = {
  bankName: 'Vietcombank (VCB)',
  accountNumber: '1234567890',
  accountName: 'SNEAKER BUZZ',
  momoPhone: '0901234567',
}

export const COD_NOTES = [
  { icon: '✅', text: 'Kiểm tra hàng trước khi thanh toán' },
  { icon: '📦', text: 'Giao hàng 24H tại Hà Nội & TP.HCM' },
  { icon: '🔄', text: 'Đổi trả miễn phí 30 ngày nếu lỗi' },
  { icon: '📞', text: 'Hotline: 1800 1234 (miễn phí)' },
]

export const PRODUCT_PERKS = [
  { icon: '✓', text: '100% hàng chính hãng' },
  { icon: '🚚', text: 'Giao hàng 24H tại Hà Nội & HCM' },
  { icon: '🔄', text: 'Đổi trả miễn phí 30 ngày' },
  { icon: '💳', text: 'Hỗ trợ COD, MOMO, VISA' },
]

export const ORDER_STATUS_LABELS = {
  processing: 'Đang xử lý',
  delivered: 'Đã giao thành công',
  cancelled: 'Đã hủy',
}

export const PAYMENT_METHOD_LABELS = {
  card: 'Thẻ ngân hàng',
  momo: 'Ví điện tử MoMo',
  qr: 'Chuyển khoản QR',
  cod: 'Thanh toán COD',
}
