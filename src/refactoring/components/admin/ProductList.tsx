import { Discount, Product } from '../../../types'
import { ProductBox } from './ProductBox'

interface Props {
  products: Product[]
  openProductIds: Set<string>
  editingProduct: Product | null
  newDiscount: Discount
  setNewDiscount: (discount: Discount) => void
  toggleProductAccordion: (productId: string) => void
  handleProductNameUpdate: (productId: string, newName: string) => void
  handlePriceUpdate: (productId: string, newPrice: number) => void
  handleStockUpdate: (productId: string, newStock: number) => void
  handleAddDiscount: (productId: string) => void
  handleEditComplete: () => void
  handleEditProduct: (product: Product) => void
  handleRemoveDiscount: (productId: string, index: number) => void
}

export const ProductList = ({
  products,
  openProductIds,
  editingProduct,
  newDiscount,
  setNewDiscount,
  toggleProductAccordion,
  handleProductNameUpdate,
  handlePriceUpdate,
  handleStockUpdate,
  handleAddDiscount,
  handleEditComplete,
  handleEditProduct,
  handleRemoveDiscount,
}: Props) => {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <ProductBox
          key={product.id}
          index={index}
          product={product}
          openProductIds={openProductIds}
          editingProduct={editingProduct}
          newDiscount={newDiscount}
          setNewDiscount={setNewDiscount}
          toggleProductAccordion={toggleProductAccordion}
          handleProductNameUpdate={handleProductNameUpdate}
          handlePriceUpdate={handlePriceUpdate}
          handleStockUpdate={handleStockUpdate}
          handleAddDiscount={handleAddDiscount}
          handleEditComplete={handleEditComplete}
          handleEditProduct={handleEditProduct}
          handleRemoveDiscount={handleRemoveDiscount}
        />
      ))}
    </div>
  )
}
