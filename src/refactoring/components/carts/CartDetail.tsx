import { CartItem, Coupon } from '../../../types'
import { CartBox } from './CartBox'

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

      <div className="mt-6 rounded bg-white p-4 shadow">
        <h2 className="mb-2 text-2xl font-semibold">쿠폰 적용</h2>
        <select
          onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
          className="mb-2 w-full rounded border p-2"
        >
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon, index) => (
            <option key={coupon.code} value={index}>
              {coupon.name} -{' '}
              {coupon.discountType === 'amount'
                ? `${coupon.discountValue}원`
                : `${coupon.discountValue}%`}
            </option>
          ))}
        </select>
        {selectedCoupon && (
          <p className="text-green-600">
            적용된 쿠폰: {selectedCoupon.name}(
            {selectedCoupon.discountType === 'amount'
              ? `${selectedCoupon.discountValue}원`
              : `${selectedCoupon.discountValue}%`}{' '}
            할인)
          </p>
        )}
      </div>

      <div className="mt-6 rounded bg-white p-4 shadow">
        <h2 className="mb-2 text-2xl font-semibold">주문 요약</h2>
        <div className="space-y-1">
          <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
          <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
          <p className="text-xl font-bold">
            최종 결제 금액: {totalAfterDiscount.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  )
}
