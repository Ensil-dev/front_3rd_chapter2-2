import { CartItem } from '../../../types'

interface Props {
  item: CartItem
  appliedDiscount: number
  updateQuantity: (productId: string, newQuantity: number) => void
  removeFromCart: (productId: string) => void
}

export const CartBox = ({ item, appliedDiscount, updateQuantity, removeFromCart }: Props) => {
  return (
    <div className="flex items-center justify-between rounded bg-white p-3 shadow">
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {item.product.price}원 x {item.quantity}
          {appliedDiscount > 0 && (
            <span className="ml-1 text-green-600">
              ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
        </span>
      </div>
      <div>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="mr-1 rounded bg-gray-300 px-2 py-1 text-gray-800 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="mr-1 rounded bg-gray-300 px-2 py-1 text-gray-800 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
