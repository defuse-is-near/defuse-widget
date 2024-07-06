import React, { ReactNode } from "react"
import { Text } from "@radix-ui/themes"
import clsx from "clsx"
import Image from "next/image"

import AssetComboIcon from "@src/components/Network/AssetComboIcon"
import { NetworkToken } from "@src/types/interfaces"

type Props = {
  title?: string
  assets: NetworkToken[]
  emptyState?: ReactNode
  className?: string
  handleSelectToken?: (token: NetworkToken) => void
}

const EmptyAssetList = ({ className }: Pick<Props, "className">) => {
  return (
    <div
      className={clsx(
        "flex-1 w-full flex flex-col justify-center items-center text-center -mt-10",
        className && className
      )}
    >
      <div className="flex justify-center items-center rounded-full bg-gray-950 p-6 mb-4">
        <Image
          src="/static/icons/cross-1.svg"
          alt="Close"
          width={32}
          height={32}
        />
      </div>
      <Text size="4" weight="bold">
        Your token not found
      </Text>
      <Text size="2" weight="medium" className="text-gray-600">
        Try depositing to your wallet.
      </Text>
    </div>
  )
}

const AssetList = ({
  title,
  assets,
  emptyState,
  className,
  handleSelectToken,
}: Props) => {
  if (!assets.length) {
    return emptyState || <EmptyAssetList className={className} />
  }
  return (
    <div className={clsx("flex flex-col", className && className)}>
      <div className="sticky top-0 z-10 px-5 h-[46px] flex items-center bg-white dark:bg-black-700 dark:text-white">
        <Text as="p" size="1" weight="medium" className="pt-2.5 text-gray-600">
          {title}
        </Text>
      </div>
      {assets.map(
        ({ name, chainName, symbol, balance, balanceToUds, ...rest }, i) => (
          <button
            key={i}
            className="flex justify-between items-center gap-3 p-2.5 rounded-md hover:bg-gray-950"
            onClick={() => handleSelectToken && handleSelectToken(assets[i])}
          >
            <AssetComboIcon
              name={name as string}
              chainName={chainName as string}
              {...rest}
            />
            <div className="grow flex flex-col">
              <div className="flex justify-between items-center">
                <Text as="span" size="2" weight="medium">
                  {name}
                </Text>
                <Text as="span" size="2" weight="medium">
                  {balance
                    ? balance < 0.00001
                      ? "< 0.00001"
                      : balance.toFixed(7)
                    : null}
                </Text>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <Text as="span" size="2">
                  {symbol ? symbol : null}
                </Text>
                <Text as="span" size="2">
                  {balanceToUds ? `$${balanceToUds.toFixed(7)}` : null}
                </Text>
              </div>
            </div>
          </button>
        )
      )}
    </div>
  )
}

export default AssetList
