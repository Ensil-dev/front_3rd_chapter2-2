import { Coupon, Product } from '../../types.ts'
import { ProductManagement } from './admin/product/ProductManagement.tsx'
import { CouponManagement } from './admin/coupon/CouponManagement.tsx'
import { useProductManagement } from '../hooks/useProductManagement.ts'
import { useCouponManagement } from '../hooks/useCouponManagement.ts'

interface Props {
  products: Product[]
  coupons: Coupon[]
  onProductUpdate: (updatedProduct: Product) => void
  onProductAdd: (newProduct: Product) => void
  onCouponAdd: (newCoupon: Coupon) => void
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const {
    editingProduct,
    newDiscount,
    openProductIds,
    newProduct,
    showNewProductForm,
    setNewProduct,
    setShowNewProductForm,
    setNewDiscount,
    handleEditProduct,
    handleProductNameUpdate,
    handleEditComplete,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleAddNewProduct,
    toggleProductAccordion,
  } = useProductManagement({ onProductUpdate, onProductAdd })

  const { newCoupon, setNewCoupon, handleAddCoupon } = useCouponManagement(onCouponAdd)

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">관리자 페이지</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProductManagement
          products={products}
          newProduct={newProduct}
          showNewProductForm={showNewProductForm}
          openProductIds={openProductIds}
          editingProduct={editingProduct}
          newDiscount={newDiscount}
          setNewProduct={setNewProduct}
          setNewDiscount={setNewDiscount}
          onToggleNewProductForm={setShowNewProductForm}
          toggleProductAccordion={toggleProductAccordion}
          handleProductNameUpdate={handleProductNameUpdate}
          handleAddNewProduct={handleAddNewProduct}
          handlePriceUpdate={handlePriceUpdate}
          handleStockUpdate={handleStockUpdate}
          handleEditComplete={handleEditComplete}
          handleEditProduct={handleEditProduct}
          handleAddDiscount={handleAddDiscount}
          handleRemoveDiscount={handleRemoveDiscount}
        />

        <CouponManagement
          coupons={coupons}
          newCoupon={newCoupon}
          setNewCoupon={setNewCoupon}
          handleAddCoupon={handleAddCoupon}
        />
      </div>
    </div>
  )
}
