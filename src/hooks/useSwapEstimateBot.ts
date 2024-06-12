import { setSettings } from "@src/libs/de-sdk/settings"
import { concurrentEstimateSwap } from "@src/libs/de-sdk"
import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"

const useSwapEstimateBot = (externalProviders: unknown[] = []) => {
  const providerIds = externalProviders.filter(
    (provider): provider is string => typeof provider === "string"
  )

  setSettings({ providerIds })

  const getSwapEstimateBot = async (data: DataEstimateRequest) => {
    return await concurrentEstimateSwap(data)
  }

  return {
    getSwapEstimateBot,
  }
}

export default useSwapEstimateBot
