enum CONTRACTS_MAINNET {
  INTENT = "",
}

enum CONTRACTS_TESTNET {
  INTENT = "dintent.testnet",
}

export const CONTRACTS_REGISTER =
  process.env.environment === "development"
    ? Object.assign({}, CONTRACTS_TESTNET)
    : Object.assign({}, CONTRACTS_MAINNET)

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
export const MAX_GAS_TRANSACTION = "300" + "0".repeat(12)
export const FT_STORAGE_DEPOSIT_GAS = "30000000000000"
export const FT_MINIMUM_STORAGE_BALANCE_LARGE = "12500000000000000000000"
export const FT_TRANSFER_GAS = ""
export const TOKEN_TRANSFER_DEPOSIT = ""