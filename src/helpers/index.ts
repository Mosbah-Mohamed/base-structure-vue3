export function cloneItem<T>(item: T): T {
  return structuredClone(item)
}
