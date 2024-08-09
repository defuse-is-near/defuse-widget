export default function sortBigIntDesc(a: string, b: string) {
  const left = BigInt(a)
  const right = BigInt(b)
  if (left < right) {
    return 1
  }
  if (left > right) {
    return -1
  }

  return 0
}
