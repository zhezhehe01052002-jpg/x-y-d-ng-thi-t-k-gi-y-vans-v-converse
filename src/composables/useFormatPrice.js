/**
 * Composable: Format price in Vietnamese Dong
 * Replaces 6 duplicate implementations across the codebase
 */
export const useFormatPrice = () => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
  }

  return { formatPrice }
}

// Also export standalone for non-setup usage
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}
