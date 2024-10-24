// constants/admin.ts
import type { Product, Coupon, Discount } from '../../types'

export const INITIAL_PRODUCT_STATE: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
} as const

export const INITIAL_COUPON_STATE: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
} as const

export const INITIAL_DISCOUNT_STATE: Discount = {
  quantity: 0,
  rate: 0,
} as const
