import { useTokensStore } from "@src/providers/TokensStoreProvider"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

export const useNetworkTokens = () => {
  const { data: networkTokens } = useTokensStore((state) => state)

  const getTokensDataByIds = (
    tokenId: string[]
  ): NetworkTokenWithSwapRoute[] => {
    const result: NetworkTokenWithSwapRoute[] = []

    if (!networkTokens.size) {
      return result
    }

    networkTokens.forEach((token) => {
      tokenId.forEach((id) => {
        if (token.address?.toLowerCase() === id.toLowerCase()) {
          result.push(token)
        }
      })
    })

    return result
  }

  return {
    getTokensDataByIds,
  }
}
