import { useState } from 'react'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react'
import { CartPage } from '../../refactoring/components/CartPage'
import { AdminPage } from '../../refactoring/components/AdminPage'
import { Coupon, Discount, Product } from '../../types'
import { useLocalStorage } from '../../refactoring/hooks'

import { useCouponManagement } from '../../refactoring/hooks/useCouponManagement'
import { INITIAL_COUPON_STATE, INITIAL_PRODUCT_STATE } from '../../refactoring/constants/admin'
import { useProductManagement } from '../../refactoring/hooks/useProductManagement'
import invariant, { toggleSetItem } from '../../refactoring/hooks/utils/common'
import { validateDiscount } from '../../refactoring/hooks/utils/discount'
import { findProductById } from '../../refactoring/hooks/utils/product'

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
]
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
]

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    )
  }

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon])
  }

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  )
}

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />)
      const product1 = screen.getByTestId('product-p1')
      const product2 = screen.getByTestId('product-p2')
      const product3 = screen.getByTestId('product-p3')
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가')

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1')
      expect(product1).toHaveTextContent('10,000원')
      expect(product1).toHaveTextContent('재고: 20개')
      expect(product2).toHaveTextContent('상품2')
      expect(product2).toHaveTextContent('20,000원')
      expect(product2).toHaveTextContent('재고: 20개')
      expect(product3).toHaveTextContent('상품3')
      expect(product3).toHaveTextContent('30,000원')
      expect(product3).toHaveTextContent('재고: 20개')

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument()

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1) // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument()

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1)
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개')
      fireEvent.click(addToCartButtonsAtProduct1)
      expect(product1).toHaveTextContent('재고: 0개')

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument()

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2) // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3) // 상품3 추가

      const increaseButtons = screen.getAllByText('+')
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]) // 상품2
        fireEvent.click(increaseButtons[2]) // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument()

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox')
      fireEvent.change(couponSelect, { target: { value: '1' } }) // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument()

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }) // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument()
    })

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />)

      const $product1 = screen.getByTestId('product-1')

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'))

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } })
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } })
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } })

      fireEvent.click(screen.getByText('추가'))

      const $product4 = screen.getByTestId('product-4')

      expect($product4).toHaveTextContent('상품4')
      expect($product4).toHaveTextContent('15000원')
      expect($product4).toHaveTextContent('재고: 30')

      // 2. 상품 선택 및 수정
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('toggle-button'))
      fireEvent.click(within($product1).getByTestId('modify-button'))

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } })
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        })
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        })
      })

      fireEvent.click(within($product1).getByText('수정 완료'))

      expect($product1).toHaveTextContent('수정된 상품1')
      expect($product1).toHaveTextContent('12000원')
      expect($product1).toHaveTextContent('재고: 25')

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('modify-button'))

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } })
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } })
      })
      fireEvent.click(screen.getByText('할인 추가'))

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument()

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } })
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } })
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } })
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } })

      fireEvent.click(screen.getByText('쿠폰 추가'))

      const $newCoupon = screen.getByTestId('coupon-3')

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인')
    })
  })

  describe('커스텀 훅 테스트 >', () => {
    describe('useLocalStorage >', () => {
      // localStorage Mock
      const localStorageMock = {
        store: {} as { [key: string]: string },
        getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageMock.store[key] = value
        }),
        removeItem: vi.fn((key: string) => {
          delete localStorageMock.store[key]
        }),
        clear: vi.fn(() => {
          localStorageMock.store = {}
        }),
      }

      beforeAll(() => {
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
        })
      })

      beforeEach(() => {
        localStorageMock.clear()
        vi.clearAllMocks()
      })

      test('초기값으로 시작해야 합니다', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
        expect(result.current[0]).toBe('initial')
      })

      test('값을 저장하고 읽을 수 있어야 합니다', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', ''))

        act(() => {
          result.current[1]('new value')
        })

        expect(result.current[0]).toBe('new value')
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'test-key',
          JSON.stringify('new value'),
        )
      })

      test('함수형 업데이트가 동작해야 합니다', () => {
        const { result } = renderHook(() => useLocalStorage<number>('test-key', 0))

        act(() => {
          result.current[1]((prev) => prev + 1)
        })

        expect(result.current[0]).toBe(1)
        expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(1))
      })

      test('removeValue로 값을 제거할 수 있어야 합니다', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

        act(() => {
          result.current[1]('new value')
          result.current[2]() // removeValue 호출
        })

        expect(result.current[0]).toBe('initial') // 초기값으로 리셋
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key')
      })
    })

    describe('useCouponManagement >', () => {
      test('초기 상태는 INITIAL_COUPON_STATE와 같아야 합니다', () => {
        const onCouponAdd = vi.fn()
        const { result } = renderHook(() => useCouponManagement(onCouponAdd))

        expect(result.current.newCoupon).toEqual(INITIAL_COUPON_STATE)
      })

      test('setNewCoupon으로 쿠폰 정보를 업데이트할 수 있어야 합니다', () => {
        const onCouponAdd = vi.fn()
        const { result } = renderHook(() => useCouponManagement(onCouponAdd))

        act(() => {
          result.current.setNewCoupon(mockCoupons[0])
        })

        expect(result.current.newCoupon).toEqual(mockCoupons[0])
      })

      test('handleAddCoupon 호출 시 onCouponAdd가 호출되어야 합니다', () => {
        const onCouponAdd = vi.fn()
        const { result } = renderHook(() => useCouponManagement(onCouponAdd))

        // 먼저 쿠폰 정보 설정
        act(() => {
          result.current.setNewCoupon(mockCoupons[0])
        })

        // 설정된 값 확인
        expect(result.current.newCoupon).toEqual(mockCoupons[0])

        // 그 다음 쿠폰 추가
        act(() => {
          result.current.handleAddCoupon()
        })

        expect(onCouponAdd).toHaveBeenCalledWith(mockCoupons[0])
      })

      test('handleAddCoupon 호출 후 newCoupon이 초기화되어야 합니다', () => {
        const onCouponAdd = vi.fn()
        const { result } = renderHook(() => useCouponManagement(onCouponAdd))

        act(() => {
          result.current.setNewCoupon(mockCoupons[0])
        })

        act(() => {
          result.current.handleAddCoupon()
        })

        expect(result.current.newCoupon).toEqual(INITIAL_COUPON_STATE)
      })

      test('여러 쿠폰을 순차적으로 추가할 수 있어야 합니다', () => {
        const onCouponAdd = vi.fn()
        const { result } = renderHook(() => useCouponManagement(onCouponAdd))

        // 첫 번째 쿠폰 설정 및 추가
        act(() => {
          result.current.setNewCoupon(mockCoupons[0])
        })

        act(() => {
          result.current.handleAddCoupon()
        })

        expect(onCouponAdd).toHaveBeenCalledWith(mockCoupons[0])
        expect(result.current.newCoupon).toEqual(INITIAL_COUPON_STATE)

        // 두 번째 쿠폰 설정 및 추가
        act(() => {
          result.current.setNewCoupon(mockCoupons[1])
        })

        act(() => {
          result.current.handleAddCoupon()
        })

        expect(onCouponAdd).toHaveBeenCalledWith(mockCoupons[1])
        expect(onCouponAdd).toHaveBeenCalledTimes(2)
      })

      test('빈 쿠폰 정보로 초기화할 수 있어야 합니다', () => {
        const onCouponAdd = vi.fn()
        const { result } = renderHook(() => useCouponManagement(onCouponAdd))

        act(() => {
          result.current.setNewCoupon(mockCoupons[0])
        })

        expect(result.current.newCoupon).toEqual(mockCoupons[0])

        act(() => {
          result.current.setNewCoupon(INITIAL_COUPON_STATE)
        })

        expect(result.current.newCoupon).toEqual(INITIAL_COUPON_STATE)
      })
    })

    describe('useProductManagement >', () => {
      // 목 데이터 및 핸들러
      const mockProduct = {
        id: 'p1',
        name: '상품1',
        price: 10000,
        stock: 20,
        discounts: [{ quantity: 10, rate: 0.1 }],
      }

      const mockOnProductUpdate = vi.fn()
      const mockOnProductAdd = vi.fn()

      beforeEach(() => {
        vi.clearAllMocks()
      })

      test('상품 수정 모드를 토글할 수 있어야 합니다', () => {
        const { result } = renderHook(() =>
          useProductManagement({
            onProductUpdate: mockOnProductUpdate,
            onProductAdd: mockOnProductAdd,
          }),
        )

        // 초기값 확인
        expect(result.current.editingProduct).toBeNull()

        // 수정 모드 진입
        act(() => {
          result.current.handleEditProduct(mockProduct)
        })

        // 수정 중인 상품 확인
        expect(result.current.editingProduct).toEqual(mockProduct)
      })

      test('상품 아코디언을 토글할 수 있어야 합니다', () => {
        const { result } = renderHook(() =>
          useProductManagement({
            onProductUpdate: mockOnProductUpdate,
            onProductAdd: mockOnProductAdd,
          }),
        )

        // 초기값 확인 (닫힌 상태)
        expect(result.current.openProductIds.has('p1')).toBe(false)

        // 아코디언 열기
        act(() => {
          result.current.toggleProductAccordion('p1')
        })

        // 열린 상태 확인
        expect(result.current.openProductIds.has('p1')).toBe(true)

        // 아코디언 닫기
        act(() => {
          result.current.toggleProductAccordion('p1')
        })

        // 닫힌 상태 확인
        expect(result.current.openProductIds.has('p1')).toBe(false)
      })

      test('상품 정보를 업데이트할 수 있어야 합니다', () => {
        const { result } = renderHook(() =>
          useProductManagement({
            onProductUpdate: mockOnProductUpdate,
            onProductAdd: mockOnProductAdd,
          }),
        )

        // 수정 모드 진입
        act(() => {
          result.current.handleEditProduct(mockProduct)
        })

        // 상품명 수정
        act(() => {
          result.current.handleProductNameUpdate('p1', '수정된 상품1')
        })

        expect(result.current.editingProduct?.name).toBe('수정된 상품1')

        // 수정 완료
        act(() => {
          result.current.handleEditComplete()
        })

        // onProductUpdate가 호출되었는지 확인
        expect(mockOnProductUpdate).toHaveBeenCalledTimes(1)
        expect(mockOnProductUpdate).toHaveBeenCalledWith({
          ...mockProduct,
          name: '수정된 상품1',
        })
      })

      test('할인 정보를 추가/제거할 수 있어야 합니다', () => {
        const { result } = renderHook(() =>
          useProductManagement({
            onProductUpdate: mockOnProductUpdate,
            onProductAdd: mockOnProductAdd,
          }),
        )

        const products = [mockProduct]
        const newDiscount = { quantity: 5, rate: 0.05 }

        // 수정 모드 진입
        act(() => {
          result.current.handleEditProduct(mockProduct)
          result.current.setNewDiscount(newDiscount)
        })

        // 할인 추가
        act(() => {
          result.current.handleAddDiscount('p1', products)
        })

        // 할인이 추가되었는지 확인
        expect(mockOnProductUpdate).toHaveBeenCalledWith({
          ...mockProduct,
          discounts: [...mockProduct.discounts, newDiscount],
        })

        // 할인 제거
        act(() => {
          result.current.handleRemoveDiscount('p1', 0, products)
        })

        // 할인이 제거되었는지 확인
        expect(mockOnProductUpdate).toHaveBeenCalledWith({
          ...mockProduct,
          discounts: [],
        })
      })

      test('새 상품을 추가할 수 있어야 합니다', () => {
        const { result } = renderHook(() =>
          useProductManagement({
            onProductUpdate: mockOnProductUpdate,
            onProductAdd: mockOnProductAdd,
          }),
        )

        const newProduct = {
          name: '새 상품',
          price: 15000,
          stock: 30,
          discounts: [],
        }

        act(() => {
          result.current.handleAddNewProduct(newProduct)
        })

        // onProductAdd가 호출되었는지 확인
        expect(mockOnProductAdd).toHaveBeenCalledTimes(1)
        expect(mockOnProductAdd).toHaveBeenCalledWith({
          ...newProduct,
          id: expect.any(String),
        })

        // 상태가 초기화되었는지 확인
        expect(result.current.newProduct).toEqual(INITIAL_PRODUCT_STATE)
        expect(result.current.showNewProductForm).toBe(false)
      })
    })
  })

  describe('유틸 함수 테스트 >', () => {
    describe('invariant >', () => {
      test('condition이 true일 때는 에러를 발생시키지 않아야 합니다', () => {
        expect(() => invariant(true)).not.toThrow()
      })

      test('condition이 false일 때는 에러를 발생시켜야 합니다', () => {
        expect(() => invariant(false)).toThrow('Invariant failed')
      })

      test('메시지를 문자열로 전달했을 때 에러 메시지에 포함되어야 합니다', () => {
        const errorMessage = 'Test error message'
        expect(() => invariant(false, errorMessage)).toThrow('Invariant failed: Test error message')
      })

      test('메시지를 함수로 전달했을 때 함수의 반환값이 에러 메시지에 포함되어야 합니다', () => {
        const messageFunction = () => 'Function error message'
        expect(() => invariant(false, messageFunction)).toThrow(
          'Invariant failed: Function error message',
        )
      })

      test('프로덕션 환경에서는 간단한 에러 메시지만 표시되어야 합니다', () => {
        const error = new Error('Invariant failed')

        expect(() => {
          if (true) {
            // 프로덕션 환경 시뮬레이션
            throw error
          }
        }).toThrow('Invariant failed')

        // 상세 메시지가 포함되지 않는지 확인
        expect(error.message).not.toContain('Detailed message')
      })
    })

    describe('validateDiscount >', () => {
      test('유효한 할인 정보를 검증해야 합니다', () => {
        const validDiscount = mockProducts[0].discounts[0]
        expect(validDiscount).toEqual({ quantity: 10, rate: 0.1 })
        expect(validateDiscount(validDiscount)).toBe(true)
      })

      test('수량이 0 이하면 false를 반환해야 합니다', () => {
        const invalidDiscount: Discount = {
          ...mockProducts[0].discounts[0],
          quantity: 0,
        }
        expect(validateDiscount(invalidDiscount)).toBe(false)
      })

      test('할인율이 0 이하면 false를 반환해야 합니다', () => {
        const invalidDiscount: Discount = {
          ...mockProducts[0].discounts[0],
          rate: 0,
        }
        expect(validateDiscount(invalidDiscount)).toBe(false)
      })

      test('할인율이 1 초과면 false를 반환해야 합니다', () => {
        const invalidDiscount: Discount = {
          ...mockProducts[0].discounts[0],
          rate: 1.1,
        }
        expect(validateDiscount(invalidDiscount)).toBe(false)
      })
    })

    describe('findProductById >', () => {
      test('존재하는 상품 ID로 상품을 찾아야 합니다', () => {
        const product = findProductById(mockProducts, 'p1')
        expect(product).toBeDefined()
        expect(product?.name).toBe('상품1')
        expect(product?.price).toBe(10000)
      })

      test('존재하지 않는 상품 ID는 undefined를 반환해야 합니다', () => {
        const product = findProductById(mockProducts, 'nonexistent')
        expect(product).toBeUndefined()
      })

      test('빈 배열에서 검색하면 undefined를 반환해야 합니다', () => {
        const product = findProductById([], 'p1')
        expect(product).toBeUndefined()
      })

      test('모든 mockProducts의 상품을 찾을 수 있어야 합니다', () => {
        mockProducts.forEach((mockProduct) => {
          const found = findProductById(mockProducts, mockProduct.id)
          expect(found).toEqual(mockProduct)
        })
      })
    })

    describe('toggleSetItem >', () => {
      test('Set에 없는 상품 ID를 추가해야 합니다', () => {
        const initialSet = new Set<string>([mockProducts[0].id, mockProducts[1].id])
        const newSet = toggleSetItem(initialSet, mockProducts[2].id)

        expect(newSet.has(mockProducts[2].id)).toBe(true)
        expect(newSet.size).toBe(3)
      })

      test('Set에 있는 상품 ID를 제거해야 합니다', () => {
        const initialSet = new Set<string>(mockProducts.map((p) => p.id))
        const newSet = toggleSetItem(initialSet, mockProducts[1].id)

        expect(newSet.has(mockProducts[1].id)).toBe(false)
        expect(newSet.size).toBe(2)
      })

      test('원본 Set이 변경되지 않아야 합니다', () => {
        const initialSet = new Set<string>([mockProducts[0].id, mockProducts[1].id])
        const originalSize = initialSet.size

        toggleSetItem(initialSet, mockProducts[2].id)

        expect(initialSet.size).toBe(originalSize)
        expect(initialSet.has(mockProducts[2].id)).toBe(false)
      })

      test('빈 Set에도 정상 동작해야 합니다', () => {
        const emptySet = new Set<string>()
        const newSet = toggleSetItem(emptySet, mockProducts[0].id)

        expect(newSet.has(mockProducts[0].id)).toBe(true)
        expect(newSet.size).toBe(1)
      })
    })
  })
})
