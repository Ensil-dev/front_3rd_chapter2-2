import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"
import { Product } from "../../../types"
import { getMaxDiscount } from "../../hooks/utils/cartUtils"

interface Props {
    product: Product
    remainingStock: number
    addToCart: (product: Product) => void
  }


export const ProductBox = ({product, remainingStock, addToCart}:Props) => {
  return (
    <div
      data-testid={`product-${product.id}`}
      className="rounded bg-white p-3 shadow"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">{product.price.toLocaleString()}원</span>
      </div>
      <div className="mb-2 text-sm text-gray-500">
        <span className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          재고: {remainingStock}개
        </span>
        {product.discounts.length > 0 && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
          </span>
        )}
      </div>
      {product.discounts.length > 0 && (
        <ul className="mb-2 list-inside list-disc text-sm text-gray-500">
          {product.discounts.map((discount: { quantity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; rate: number }, index: Key | null | undefined) => (
            <li key={index}>
              {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => addToCart(product)}
        className={`w-full rounded px-3 py-1 ${
          remainingStock > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'cursor-not-allowed bg-gray-300 text-gray-500'
        }`}
        disabled={remainingStock <= 0}
      >
        {remainingStock > 0 ? '장바구니에 추가' : '품절'}
      </button>
    </div>
  )
}
