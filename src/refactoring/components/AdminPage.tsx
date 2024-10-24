import { useState } from 'react'
import { Coupon, Discount, Product } from '../../types.ts'
import { ProductManagement } from './admin/ProductManagement.tsx'
import { CouponManagement } from './admin/CouponManagement.tsx'
import {
  INITIAL_PRODUCT_STATE,
  INITIAL_COUPON_STATE,
  INITIAL_DISCOUNT_STATE,
} from '../constants/admin'
import { findProductById, toggleSetItem, validateDiscount } from '../hooks/utils/adminUtils.ts'

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
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set())
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newDiscount, setNewDiscount] = useState<Discount>(INITIAL_DISCOUNT_STATE)
  const [newCoupon, setNewCoupon] = useState<Coupon>(INITIAL_COUPON_STATE)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(INITIAL_PRODUCT_STATE)
  const [showNewProductForm, setShowNewProductForm] = useState(false)

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => toggleSetItem(prev, productId))
  }

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
  }

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName }
      setEditingProduct(updatedProduct)
    }
  }

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice }
      setEditingProduct(updatedProduct)
    }
  }

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct)
      setEditingProduct(null)
    }
  }

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = findProductById(products, productId)
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock }
      onProductUpdate(newProduct)
      setEditingProduct(newProduct)
    }
  }

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId)
    if (updatedProduct && editingProduct) {
      // 👉 여기에 validateDiscount 추가
      if (!validateDiscount(newDiscount)) {
        alert('유효하지 않은 할인 정보입니다.')
        return
      }

      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      }
      onProductUpdate(newProduct)
      setEditingProduct(newProduct)
      setNewDiscount({ quantity: 0, rate: 0 })
    }
  }

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = findProductById(products, productId)
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      }
      onProductUpdate(newProduct)
      setEditingProduct(newProduct)
    }
  }

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon)
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    })
  }

  const handleAddNewProduct = (newProduct: Product) => {
    const productWithId = { ...newProduct, id: Date.now().toString() }
    onProductAdd(productWithId)
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    })
    setShowNewProductForm(false)
  }

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
          handleAddDiscount={handleAddDiscount}
          handleEditComplete={handleEditComplete}
          handleEditProduct={handleEditProduct}
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
