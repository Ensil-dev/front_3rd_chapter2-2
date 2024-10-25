import { Coupon } from '../../../../types'
import { CouponBox } from './CouponBox'

interface Props {
  coupons: Coupon[]
}

export const CouponList = ({ coupons }: Props) => {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">현재 쿠폰 목록</h3>
      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <CouponBox key={coupon.name} coupon={coupon} index={index} />
        ))}
      </div>
    </div>
  )
}
