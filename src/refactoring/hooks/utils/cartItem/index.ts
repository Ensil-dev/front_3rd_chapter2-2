import { CartItem } from '../../../../types'

export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product
  const { quantity } = item

  const discount = item.product.discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount
  }, 0)

  return price * quantity * (1 - discount)
}

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product
  const { quantity } = item
  let appliedDiscount = 0

  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate)
    }
  }

  return appliedDiscount
}

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return [...cart]
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity))
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null
      }
      return item
    })
    .filter((item): item is CartItem => item !== null)
}
