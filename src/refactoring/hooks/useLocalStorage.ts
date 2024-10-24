import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // localStorage에서 초기값 읽기
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [initialValue, key])

  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // localStorage에 값을 저장하는 함수
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 함수나 직접 값을 처리
        const valueToStore = value instanceof Function ? value(storedValue) : value
        
        // 상태 업데이트
        setStoredValue(valueToStore)
        
        // localStorage에 저장
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // localStorage에서 값을 제거하는 함수
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}