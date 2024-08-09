import Image from "next/image"

import { NetworkToken } from "@src/types/interfaces"

const AssetComboIcon = ({
  icon,
  name,
  chainIcon,
  chainName,
}: Omit<Partial<NetworkToken>, "balance" | "balanceToUsd">) => {
  return (
    <div className="relative inline-block">
      <div className="relative overflow-hidden w-[36px] h-[36px] flex justify-center items-center border border-silver-100 rounded-full">
        <Image
          src={icon ?? ""}
          alt={name || "Coin Logo"}
          fill
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <div className="absolute bottom-0 -right-[7px] flex justify-center items-center p-1 bg-black-300 rounded-full border-2 border-white dark:border-black-950 w-[18px] h-[18px]">
        <Image
          src={chainIcon ?? ""}
          alt={chainName || "Network Logo"}
          width={6}
          height={6}
        />
      </div>
    </div>
  )
}

export default AssetComboIcon
