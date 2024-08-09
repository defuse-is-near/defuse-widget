import { useEffect, useState } from "react"

import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { SupportedTokens } from "@src/types/solver0"
import { getSupportTokenListSolver0 } from "@src/api/intent"
import parseDefuseAsset from "@src/utils/parseDefuseAsset"

export interface SolverHook {
  getTokenList: () => Promise<NetworkTokenWithSwapRoute[]>
}

const getChainIconFromId = (defuseAssetId: string): string => {
  const getAssetIdParts = defuseAssetId.split(":")
  const chain = getAssetIdParts.length ? getAssetIdParts[0] : ""
  switch (chain.toLowerCase()) {
    case "near":
      return "/static/icons/network/near.svg"
    case "eth":
      return "/static/icons/network/ethereum_white.svg"
    case "btc":
      return "/static/icons/network/btc.svg"
    default:
      return ""
  }
}

const useTokenListSolver0 = (): SolverHook => {
  const getTokenList = async (): Promise<NetworkTokenWithSwapRoute[]> => {
    const { result } = (await getSupportTokenListSolver0()) as SupportedTokens
    return result.tokens.map((token) => {
      const result = parseDefuseAsset(token.defuse_asset_id)
      return {
        defuse_asset_id: token.defuse_asset_id as string,
        address: token.defuse_asset_id.split(":")[2] as string,
        symbol: token.asset_name as string,
        name: token.asset_name as string,
        blockchain: result?.blockchain,
        decimals: token.decimals as number,
        icon: token.metadata_link as string,
        chainId: result?.network as string,
        chainName: result?.blockchain as string,
        chainIcon: getChainIconFromId(token.defuse_asset_id as string),
        routes: token.routes_to as string[],
      }
    }) as NetworkTokenWithSwapRoute[]
  }

  return {
    getTokenList,
  }
}

export const useTokensListAdapter = (solversHook: SolverHook[]) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<NetworkTokenWithSwapRoute[]>([])

  const getTokensList = async (): Promise<void> => {
    try {
      setIsFetching(true)
      const getTokensFromSolvers = await Promise.all(
        solversHook.map((hook) => hook.getTokenList())
      )
      const getTokens = getTokensFromSolvers.flat()

      setData(getTokens)
      setIsFetching(false)
    } catch (e) {
      console.log("useTokensListAdapter: ", e)
      setIsError(true)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    getTokensList()
  }, [])

  return {
    data,
    isFetching,
    isError,
  }
}

export const useCombinedTokensListAdapter = () => {
  const solver_0 = useTokenListSolver0()
  return useTokensListAdapter([solver_0])
}
