import { Discount } from "../../../../types"

export const validateDiscount = (discount: Discount): boolean => {
    return discount.quantity > 0 && discount.rate > 0 && discount.rate <= 1
  }

  export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
  }