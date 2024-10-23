import { CartItem, Coupon } from '../../../types'
import { CartBox } from './CartBox'
import { CouponApplyBox } from './CouponApplyBox'
import { OrderSummaryBox } from './OrderSummaryBox'

interface Props {
  coupons: Coupon[]
  cart: CartItem[]
  selectedCoupon: Coupon | null
  applyCoupon: (coupon: Coupon) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, newQuantity: number) => void
  calculateTotal: () => {
    totalBeforeDiscount: number
    totalAfterDiscount: number
    totalDiscount: number
  }
}

export const CartDetail = ({
  coupons,
  cart,
  selectedCoupon,
  calculateTotal,
  updateQuantity,
  removeFromCart,
  applyCoupon,
}: Props) => {
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal()

  const getAppliedDiscount = (item: CartItem) => {
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

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">장바구니 내역</h2>

      <div className="space-y-2">
        {cart.map((item) => {
          const appliedDiscount = getAppliedDiscount(item)
          return (
            <CartBox
              key={item.product.id}
              item={item}
              appliedDiscount={appliedDiscount}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          )
        })}
      </div>

      <CouponApplyBox coupons={coupons} selectedCoupon={selectedCoupon} applyCoupon={applyCoupon} />

      <OrderSummaryBox
        totalBeforeDiscount={totalBeforeDiscount}
        totalDiscount={totalDiscount}
        totalAfterDiscount={totalAfterDiscount}
      />
    </div>
  )
}
