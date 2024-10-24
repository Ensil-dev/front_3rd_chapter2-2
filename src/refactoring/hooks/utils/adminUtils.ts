import type { Product, Discount } from '../../../types'

export const validateDiscount = (discount: Discount): boolean => {
  return discount.quantity > 0 && discount.rate > 0 && discount.rate <= 1
}

export const findProductById = (products: Product[], productId: string): Product | undefined => {
  return products.find((p) => p.id === productId)
}

export const toggleSetItem = (set: Set<string>, itemId: string): Set<string> => {
  const newSet = new Set(set)
  if (newSet.has(itemId)) {
    newSet.delete(itemId)
  } else {
    newSet.add(itemId)
  }
  return newSet
}
