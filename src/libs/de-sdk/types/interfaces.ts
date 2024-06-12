export interface Settings {
  providerIds: string[]
}

export interface DataEstimateRequest {
  tokenIn: string
  tokenOut: string
  amountIn: string
}

export interface SwapEstimateProviderResponse {
  registrarName: string
  data: (data: DataEstimateRequest) => Promise<{
    estimate: string
    inputToken: string
    outputToken: string
    providerId: string
    pool: {
      id: number
    }
  }>
}
