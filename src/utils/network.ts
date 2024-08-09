export function isForeignNetworkToken(defuseAssetId: string): boolean {
  const keys = defuseAssetId.split(":")
  if (keys.length) {
    const [chain] = keys
    return chain !== "near"
  }
  return false
}
