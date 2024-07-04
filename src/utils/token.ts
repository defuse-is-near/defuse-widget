import { BigNumber } from "ethers"
import { formatUnits } from "viem"

export const smallBalanceToFormat = (balance: string): string => {
  const isSmallBalance = !parseFloat(balance.substring(0, 7))
  if (isSmallBalance) {
    return "~0.00001"
  }
  return balance.substring(0, 14)
}

export const tokenBalanceToFormatUnits = ({
  balance,
  decimals,
}: {
  balance: string | BigNumber | undefined
  decimals: number
}): string => {
  const balanceToString =
    balance !== undefined ? BigNumber.from(balance || "0").toString() : "0"
  if (!parseFloat(balanceToString)) {
    return "0"
  }
  const balanceToUnits = formatUnits(
    BigInt(balanceToString),
    decimals
  ).toString()

  return smallBalanceToFormat(balanceToUnits)
}
