export interface CoingeckoMarkets {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: Date
  atl: number
  atl_change_percentage: number
  atl_date: Date
  roi: null
  last_updated: Date
}

export interface CoingeckoTickers {
  base: string
  target: string
  market: {
    name: string
    identifier: string
    has_trading_incentive: boolean
  }
  last: number
  volume: number
  converted_last: {
    btc: number
    eth: number
    usd: number
  }
  converted_volume: {
    btc: number
    eth: number
    usd: number
  }
  coin_id: string
  target_coin_id: string
}

export interface CoingeckoExchanges {
  name: string
  tickers: CoingeckoTickers[]
}
