export default function parseDefuseAsset(defuseAssetId: string): {
  blockchain: string
  network: string
  contractId: string
} | null {
  try {
    const [blockchain, network, contractId] = defuseAssetId.split(":")
    return {
      blockchain,
      network,
      contractId,
    }
  } catch (e) {
    console.error("Failed to parse defuse asset id", e)
    return null
  }
}
