export function greaterThanTime(value: string, [min]: [string]) {
  if (!value?.length) return true
  return new Date(`2000-01-01 ${value}`) > new Date(`2000-01-01 ${min}`)
}

export function lessThanTime(value: string, [max]: [string]) {
  if (!value?.length) return true
  return new Date(`2000-01-01 ${value}`) < new Date(`2000-01-01 ${max}`)
}

export function minWords(value: string, [min]: [number]) {
  if (!value?.length) return true
  return value.trim().split(/\s+/).length >= min
}

export function validIcloud(value: string) {
  if (!value?.length) return true
  return /^[a-zA-Z0-9._%+-]+@icloud\.com$/i.test(value)
}

export function minDate(value: string, [min]: [string]) {
  if (!value?.length) return true
  return new Date(value) >= new Date(min)
}

export function lessThanValue(value: string, [max]: [number | string]) {
  if (!value?.length || max === undefined) return true
  return Number(value) < Number(max)
}

export function greaterThanValue(value: string, [val]: [number | string]) {
  if (!value?.length || val === undefined) return true
  return Number(value) > Number(val)
}

export function validUrl(value: string) {
  if (!value?.length) return true
  const enteredValue =
    value.startsWith('https://') || value.startsWith('http://') ? value : `https://${value}`
  const expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  return !!enteredValue.match(expression)
}

export function isNumber(value: string) {
  if (!value?.length) return true
  return !Number.isNaN(Number(value))
}

export function isEqual(value: string, [val]: [string | number]) {
  if (!value?.length || val === undefined) return true
  return value == String(val)
}

export function validVersionNumber(value: string) {
  if (!value?.length) return true
  return /^\d+(\.\d+)+(\.\d+)+$/.test(value)
}
