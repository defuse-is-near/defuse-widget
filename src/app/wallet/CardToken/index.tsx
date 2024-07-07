import { EmptyTokenBalance } from "@src/app/wallet/page"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

const CardToken = ({
  chainId,
  icon,
  name,
  symbol,
  balance,
  balanceToUsd,
}: NetworkTokenWithSwapRoute | EmptyTokenBalance) => {
  return (
    <div className="flex justify-between items-start gap-3 bg-gray-200 rounded-[20px] p-5">
      <div className="relative w-[35px] h-[35px] bg-gray-400 rounded-full">
        <span className="absolute -bottom-[3.5px] -right-[3.5px] w-[14px] h-[14px] bg-gray-900 rounded-full"></span>
      </div>
      <div className="flex flex-1 flex-col justify-start items-start">
        <span>{name}</span>
        <span>{`${balance} ${symbol}`}</span>
      </div>
      <span>${balanceToUsd}</span>
    </div>
  )
}

export default CardToken
