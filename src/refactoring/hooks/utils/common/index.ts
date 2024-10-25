export const toggleSetItem = (set: Set<string>, itemId: string): Set<string> => {
  const newSet = new Set(set)
  if (newSet.has(itemId)) {
    newSet.delete(itemId)
  } else {
    newSet.add(itemId)
  }
  return newSet
}

export default function invariant(
  condition: any,
  message?: string | (() => string),
): asserts condition {
  const isProduction: boolean = import.meta.env.PROD === true
  const prefix: string = 'Invariant failed'

  if (condition) {
    return
  }

  if (isProduction) {
    throw new Error(prefix)
  }

  const provided: string | undefined = typeof message === 'function' ? message() : message

  const value: string = provided ? `${prefix}: ${provided}` : prefix
  throw new Error(value)
}
