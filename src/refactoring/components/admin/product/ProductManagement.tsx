import { Discount, Product } from '../../../../types'
import { CreateProductFormBox } from './CreateProductFormBox'
import { ProductList } from './ProductList'

interface Props {
  products: Product[]
  newProduct: Omit<Product, 'id'>
  showNewProductForm: boolean
  openProductIds: Set<string>
  editingProduct: Product | null
  newDiscount: Discount
  setNewProduct: (product: Product) => void
  setNewDiscount: (discount: Discount) => void
  onToggleNewProductForm: (showNewProductForm: boolean) => void
  toggleProductAccordion: (productId: string) => void

  handleProductNameUpdate: (productId: string, newName: string) => void
  handleAddNewProduct: (newProduct: Product) => void
  handlePriceUpdate: (productId: string, newPrice: number) => void
  handleStockUpdate: (productId: string, newStock: number, products: Product[]) => void

  handleEditComplete: () => void
  handleEditProduct: (product: Product) => void
  handleAddDiscount: (productId: string, products: Product[]) => void
  handleRemoveDiscount: (productId: string, index: number, products: Product[]) => void
}

export const ProductManagement = ({
  showNewProductForm,
  onToggleNewProductForm,
  newProduct,
  setNewProduct,
  products,
  handleAddNewProduct,
  toggleProductAccordion,
  openProductIds,
  editingProduct,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
  handleRemoveDiscount,
  newDiscount,
  setNewDiscount,
  handleAddDiscount,
  handleEditProduct,
  handleEditComplete,
}: Props) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">상품 관리</h2>
      <button
        onClick={() => onToggleNewProductForm(!showNewProductForm)}
        className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <CreateProductFormBox
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddNewProduct={handleAddNewProduct}
        />
      )}

      <ProductList
        products={products}
        openProductIds={openProductIds}
        editingProduct={editingProduct}
        newDiscount={newDiscount}
        setNewDiscount={setNewDiscount}
        toggleProductAccordion={toggleProductAccordion}
        handleProductNameUpdate={handleProductNameUpdate}
        handlePriceUpdate={handlePriceUpdate}
        handleStockUpdate={handleStockUpdate}
        handleEditComplete={handleEditComplete}
        handleEditProduct={handleEditProduct}
        handleAddDiscount={handleAddDiscount}
        handleRemoveDiscount={handleRemoveDiscount}
      />
    </div>
  )
}
