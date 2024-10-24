const isProduction: boolean = import.meta.env.PROD === true
const prefix: string = 'Invariant failed'

export default function invariant(
  condition: any,
  message?: string | (() => string),
): asserts condition {
    console.log(`import.meta.env.PROD: ${import.meta.env.PROD}`)
    console.log(`import.meta.env.DEV: ${import.meta.env.DEV}`)
    console.log(isProduction)
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