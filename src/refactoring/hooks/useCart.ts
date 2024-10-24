// useCart.ts
import { useLocalStorage } from './useLocalStorage'
import { CartItem, Coupon, Product } from '../../types'
import { updateCartItemQuantity } from './utils/cartItem'
import { calculateCartTotal } from './utils/services/cartCalculationService'

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('shopping-cart', [])
  const [selectedCoupon, setSelectedCoupon] = useLocalStorage<Coupon | null>(
    'selected-coupon',
    null
  )

  const addToCart = (product: Product) => {
    const getRemainingStock = (product: Product) => {
      const cartItem = cart.find((item) => item.product.id === product.id)
      return product.stock - (cartItem?.quantity || 0)
    }

    const remainingStock = getRemainingStock(product)
    if (remainingStock <= 0) return

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id,
      )
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    )
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((cart) => updateCartItemQuantity(cart, productId, newQuantity))
  }

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
  }

  const calculateTotal = () => {
    const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
      calculateCartTotal(cart, selectedCoupon)

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    }
  }

  const clearCart = () => {
    setCart([])
    setSelectedCoupon(null)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    clearCart,
  }
}