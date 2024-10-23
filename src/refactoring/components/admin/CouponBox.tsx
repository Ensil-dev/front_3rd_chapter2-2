import { Coupon } from '../../../types'

interface Props {
  coupon: Coupon
}

export const CouponBox = ({ coupon }: Props) => {
  return (
    <div className="rounded bg-gray-100 p-2">
      {coupon.name} ({coupon.code}):
      {coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`}{' '}
      할인
    </div>
  )
}
