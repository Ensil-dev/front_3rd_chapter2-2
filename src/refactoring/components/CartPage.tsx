import { useEffect } from 'react'
import { Coupon, Product } from '../../types.ts'
import { useCart } from '../hooks'
import { CartDetail } from './carts/CartDetail.tsx'
import { ProductList } from './carts/ProductList.tsx'
import invariant from '../hooks/utils/common/index.ts'

interface Props {
  products: Product[]
  coupons: Coupon[]
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    calculateTotal,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    selectedCoupon,
  } = useCart()

  useEffect(() => {
    invariant(cart.length !== products.length + 1, '장바구니는 상품 갯수를 초과할 수 없습니다.')
  }, [cart.length, products.length])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">장바구니</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProductList products={products} cart={cart} addToCart={addToCart} />
        <CartDetail
          coupons={coupons}
          cart={cart}
          applyCoupon={applyCoupon}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          calculateTotal={calculateTotal}
          selectedCoupon={selectedCoupon}
        />
      </div>
    </div>
  )
}
