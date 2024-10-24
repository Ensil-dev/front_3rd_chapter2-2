import { useCallback, useState } from 'react'
import { Coupon } from '../../types'
import { INITIAL_COUPON_STATE } from '../constants/admin'

export const useCouponManagement = (onCouponAdd: (coupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(INITIAL_COUPON_STATE)

  const handleAddCoupon = useCallback(() => {
    onCouponAdd(newCoupon)
    setNewCoupon(INITIAL_COUPON_STATE)
  }, [newCoupon, onCouponAdd])

  return {
    newCoupon,
    setNewCoupon,
    handleAddCoupon,
  }
}
