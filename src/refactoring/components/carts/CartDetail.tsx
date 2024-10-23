import { CartItem, Coupon } from '../../../types'

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
            <div
              key={item.product.id}
              className="flex items-center justify-between rounded bg-white p-3 shadow"
            >
              <div>
                <span className="font-semibold">{item.product.name}</span>
                <br />
                <span className="text-sm text-gray-600">
                  {item.product.price}원 x {item.quantity}
                  {appliedDiscount > 0 && (
                    <span className="ml-1 text-green-600">
                      ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
                    </span>
                  )}
                </span>
              </div>
              <div>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="mr-1 rounded bg-gray-300 px-2 py-1 text-gray-800 hover:bg-gray-400"
                >
                  -
                </button>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="mr-1 rounded bg-gray-300 px-2 py-1 text-gray-800 hover:bg-gray-400"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
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
