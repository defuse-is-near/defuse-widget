import { setSettings } from "@src/libs/de-sdk/settings"
import { concurrentEstimateSwap } from "@src/libs/de-sdk"
import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"

const useSwapEstimateBot = (externalProviders: unknown[] = []) => {
  const providerIds = externalProviders.filter(
    (provider): provider is string => typeof provider === "string"
  )

  setSettings({ providerIds })

  const getSwapEstimateBot = async (
    data: DataEstimateRequest
  ): Promise<string> => {
    const estimate = await concurrentEstimateSwap(data)
    console.log(estimate, "Estimate response")
    return "2"
  }

  return {
    getSwapEstimateBot,
  }
}

export default useSwapEstimateBot
