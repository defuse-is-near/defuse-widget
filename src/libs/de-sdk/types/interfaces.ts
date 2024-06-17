export interface Settings {
  providerIds: string[]
}

export interface DataEstimateRequest {
  tokenIn: string
  tokenOut: string
  amountIn: string
}

export interface SwapEstimateProviderResponse {
  registrarId: string
  estimateOut: string
}
