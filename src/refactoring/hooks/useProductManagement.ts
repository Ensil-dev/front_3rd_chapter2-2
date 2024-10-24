import { useCallback, useState } from 'react'
import { Discount, Product } from '../../types'
import { INITIAL_DISCOUNT_STATE, INITIAL_PRODUCT_STATE } from '../constants/admin'
import { findProductById, validateDiscount, toggleSetItem } from './utils/adminUtils'

interface UseProductManagementProps {
  onProductUpdate: (product: Product) => void
  onProductAdd: (product: Product) => void
}

export const useProductManagement = ({
  onProductUpdate,
  onProductAdd,
}: UseProductManagementProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newDiscount, setNewDiscount] = useState<Discount>(INITIAL_DISCOUNT_STATE)
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set())
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(INITIAL_PRODUCT_STATE)
  const [showNewProductForm, setShowNewProductForm] = useState(false)

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct({ ...product })
  }, [])

  const handleProductNameUpdate = useCallback(
    (productId: string, newName: string) => {
      if (editingProduct && editingProduct.id === productId) {
        const updatedProduct = { ...editingProduct, name: newName }
        setEditingProduct(updatedProduct)
      }
    },
    [editingProduct],
  )

  const handleEditComplete = useCallback(() => {
    if (editingProduct) {
      onProductUpdate(editingProduct)
      setEditingProduct(null)
    }
  }, [editingProduct, onProductUpdate])

  const handlePriceUpdate = useCallback(
    (productId: string, newPrice: number) => {
      if (editingProduct?.id === productId) {
        setEditingProduct((prev) => ({
          ...prev!,
          price: newPrice,
        }))
      }
    },
    [editingProduct],
  )

  const handleStockUpdate = useCallback(
    (productId: string, newStock: number, products: Product[]) => {
      const updatedProduct = findProductById(products, productId)
      if (updatedProduct) {
        const newProduct = { ...updatedProduct, stock: newStock }
        onProductUpdate(newProduct)
        setEditingProduct(newProduct)
      }
    },
    [onProductUpdate],
  )

  const handleAddDiscount = useCallback(
    (productId: string, products: Product[]) => {
      const updatedProduct = findProductById(products, productId)
      if (updatedProduct && editingProduct) {
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
        setNewDiscount(INITIAL_DISCOUNT_STATE)
      }
    },
    [editingProduct, newDiscount, onProductUpdate],
  )

  const handleRemoveDiscount = useCallback(
    (productId: string, index: number, products: Product[]) => {
      const updatedProduct = findProductById(products, productId)
      if (updatedProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: updatedProduct.discounts.filter((_, i) => i !== index),
        }
        onProductUpdate(newProduct)
        setEditingProduct(newProduct)
      }
    },
    [onProductUpdate],
  )

  const handleAddNewProduct = useCallback(
    (product: Omit<Product, 'id'>) => {
      const productWithId = { ...product, id: Date.now().toString() }
      onProductAdd(productWithId)
      setNewProduct(INITIAL_PRODUCT_STATE)
      setShowNewProductForm(false)
    },
    [onProductAdd],
  )

  const toggleProductAccordion = useCallback((productId: string) => {
    setOpenProductIds((prev) => toggleSetItem(prev, productId))
  }, [])

  return {
    editingProduct,
    newDiscount,
    openProductIds,
    newProduct,
    showNewProductForm,

    setEditingProduct,
    setNewDiscount,
    setNewProduct,
    setShowNewProductForm,

    handleEditProduct,
    handleProductNameUpdate,
    handleEditComplete,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleAddNewProduct,
    toggleProductAccordion,
  }
}
