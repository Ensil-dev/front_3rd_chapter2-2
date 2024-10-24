import { Discount, Product } from '../../../types'

interface Props {
  product: Product
  products: Product[]
  openProductIds: Set<string>
  editingProduct: Product | null
  newDiscount: Discount
  index: number
  setNewDiscount: (discount: Discount) => void
  toggleProductAccordion: (productId: string) => void
  handleProductNameUpdate: (productId: string, newName: string) => void
  handlePriceUpdate: (productId: string, newPrice: number) => void
  handleStockUpdate: (productId: string, newStock: number, products: Product[]) => void
  handleEditComplete: () => void
  handleEditProduct: (product: Product) => void
  handleAddDiscount: (productId: string, products: Product[]) => void
  handleRemoveDiscount: (productId: string, index: number, products: Product[]) => void
}

export const ProductBox = ({
  product,
  products,
  openProductIds,
  editingProduct,
  newDiscount,
  index,
  setNewDiscount,
  toggleProductAccordion,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
  handleEditComplete,
  handleEditProduct,
  handleAddDiscount,
  handleRemoveDiscount,
}: Props) => {
  return (
    <div data-testid={`product-${index + 1}`} className="rounded bg-white p-4 shadow">
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {editingProduct && editingProduct.id === product.id ? (
            <div>
              <div className="mb-4">
                <label className="mb-1 block">상품명: </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block">가격: </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => handlePriceUpdate(product.id, parseInt(e.target.value))}
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block">재고: </label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    handleStockUpdate(product.id, parseInt(e.target.value), products)
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              {/* 할인 정보 수정 부분 */}
              <div>
                <h4 className="mb-2 text-lg font-semibold">할인 정보</h4>
                {editingProduct.discounts.map((discount, index) => (
                  <div key={index} className="mb-2 flex items-center justify-between">
                    <span>
                      {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                    </span>
                    <button
                      onClick={() => handleRemoveDiscount(product.id, index, products)}
                      className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="수량"
                    value={newDiscount.quantity}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })
                    }
                    className="w-1/3 rounded border p-2"
                  />
                  <input
                    type="number"
                    placeholder="할인율 (%)"
                    value={newDiscount.rate * 100}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })
                    }
                    className="w-1/3 rounded border p-2"
                  />
                  <button
                    onClick={() => handleAddDiscount(product.id, products)}
                    className="w-1/3 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                  >
                    할인 추가
                  </button>
                </div>
              </div>
              <button
                onClick={handleEditComplete}
                className="mt-2 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
              >
                수정 완료
              </button>
            </div>
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <div key={index} className="mb-2">
                  <span>
                    {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                  </span>
                </div>
              ))}
              <button
                data-testid="modify-button"
                onClick={() => handleEditProduct(product)}
                className="mt-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
