export interface Token {
  defuse_asset_id: string
  decimals: number
  asset_name: string
  metadata_link: string
}

export interface Result<T> {
  result: T
}

export type SupportedTokens = Result<{ tokens: Token[] }>
