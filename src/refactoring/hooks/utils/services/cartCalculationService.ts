import { CartItem, Coupon } from '../../../../types'
import { calculateItemTotal } from '../cartItem'

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0
  let totalAfterDiscount = 0

  cart.forEach((item) => {
    const { price } = item.product
    const { quantity } = item

    totalBeforeDiscount += price * quantity
    totalAfterDiscount += calculateItemTotal(item)
  })

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount
  }

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  }
}


