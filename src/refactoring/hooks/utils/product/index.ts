import { Product } from '../../../../types'

export const findProductById = (products: Product[], productId: string): Product | undefined => {
  return products.find((p) => p.id === productId)
}