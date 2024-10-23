import { Coupon } from '../../../types'

interface Props {
  coupon: Coupon
  index: number
}

export const CouponBox = ({ coupon, index }: Props) => {
  return (
    <div data-testid={`coupon-${index + 1}`} className="rounded bg-gray-100 p-2">
      {coupon.name} ({coupon.code}):
      {coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`}{' '}
      할인
    </div>
  )
}
