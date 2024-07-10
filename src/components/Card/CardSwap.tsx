import React from "react"
import { Text } from "@radix-ui/themes"
import Image from "next/image"

import { NetworkToken } from "@src/types/interfaces"
import AssetComboIcon from "@src/components/Network/AssetComboIcon"

type Type = {
  amountIn: string
  amountOut: string
  amountInToUsd: string
  amountOutToUsd: string
  selectTokenIn: NetworkToken
  selectTokenOut: NetworkToken
}
const CardSwap = ({
  selectTokenIn,
  selectTokenOut,
  amountIn,
  amountOut,
  amountInToUsd,
  amountOutToUsd,
}: Type) => {
  return (
    <div className="w-full flex mb-6 relative">
      <div className="flex-1 flex flex-col p-[18px] justify-center items-center border-[1px] border-r-0 border-gray-100 rounded-l-xl bg-gray">
        <AssetComboIcon
          icon={selectTokenIn.icon as string}
          name={selectTokenIn.name as string}
          chainIcon={selectTokenIn.chainIcon as string}
          chainName={selectTokenIn.chainName as string}
        />
        <Text size="3" weight="medium" className="mt-3.5 mb-1.5 text-black-400">
          {`${amountIn} ${selectTokenIn.symbol}`}
        </Text>
        <Text size="2" weight="medium" className="text-gray-600">
          ${amountInToUsd}
        </Text>
      </div>
      <div className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 flex justify-center items-center min-w-[77px] h-[472px] pointer-events-none">
        <Image
          src="/static/icons/swap_moving.svg"
          fill
          alt="Swap moving"
          style={{ objectFit: "fill" }}
        />
      </div>
      <div className="flex-1 flex flex-col p-[18px] justify-center items-center border-[1px] border-l-0 border-gray-100 rounded-r-xl bg-gray">
        <AssetComboIcon
          icon={selectTokenOut.icon as string}
          name={selectTokenOut.name as string}
          chainIcon={selectTokenOut.chainIcon as string}
          chainName={selectTokenOut.chainName as string}
        />
        <Text size="3" weight="medium" className="mt-3.5 mb-1.5 text-black-400">
          {`${amountOut} ${selectTokenOut.symbol}`}
        </Text>
        <Text size="2" weight="medium" className="text-gray-600">
          ${amountOutToUsd}
        </Text>
      </div>
    </div>
  )
}

export default CardSwap
