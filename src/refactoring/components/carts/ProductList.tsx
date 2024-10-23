import { CartItem, Product } from '../../../types'
import { getRemainingStock } from '../../hooks/utils/cartUtils'
import { ProductBox } from './ProductBox'

interface Props {
  products: Product[]
  cart: CartItem[]
  addToCart: (product: Product) => void
}

export const ProductList = ({ products, cart, addToCart }: Props) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => {
          const remainingStock = getRemainingStock(cart, product)
          return (
            <ProductBox key={product.id} product={product} remainingStock={remainingStock} addToCart={addToCart} />
          )
        })}
      </div>
    </div>
  )
}
