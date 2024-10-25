import { Coupon } from '../../../../types'
import { CouponList } from './CouponList'
import { CreateCouponFormBox } from './CreateCouponFormBox'

interface Props {
  coupons: Coupon[]
  newCoupon: Coupon
  setNewCoupon: (coupon: Coupon) => void
  handleAddCoupon: () => void
}

export const CouponManagement = ({ newCoupon, setNewCoupon, handleAddCoupon, coupons }: Props) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">쿠폰 관리</h2>
      <div className="rounded bg-white p-4 shadow">
        <CreateCouponFormBox
          newCoupon={newCoupon}
          setNewCoupon={setNewCoupon}
          handleAddCoupon={handleAddCoupon}
        />
        <CouponList coupons={coupons} />
      </div>
    </div>
  )
}
