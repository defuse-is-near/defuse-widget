"use client"

import React from "react"
import Image from "next/image"
import { Text } from "@radix-ui/themes"
import Link from "next/link"

import { HistoryData } from "@src/stores/historyStore"
import Button from "@src/components/Button/Button"

const NEAR_EXPLORER = process?.env?.nearExplorer ?? ""

const WidgetCard = ({ hash, logs }: HistoryData) => {
  return (
    <div className="max-w-[260px] flex flex-col m-5 p-3 card-history bg-white rounded-[8px] border overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <Image
          className="animate-spin"
          src="/static/icons/Spinner.svg"
          width={28}
          height={28}
          alt="Spinner"
        />
        <Image
          src="/static/icons/close.svg"
          width={16}
          height={16}
          alt="Close"
        />
      </div>
      <Text size="1" weight="bold" className="mb-1">
        {logs.length && logs[0].substring(0, 37)}...
      </Text>
      <Text size="1" className="mb-3">
        Estimated time left: 2 mins
      </Text>
      <div className="flex justify-start items-center gap-3 cursor-pointer">
        <Button size="sm" variant="soft" className="bg-black cursor-pointer">
          View details
        </Button>
        <Link
          className="h-[32px] flex items-center gap-[4px] border border-gray-600 rounded-[3px] cursor-pointer px-3"
          href={NEAR_EXPLORER + "/txns/" + hash}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Text size="1" className="text-gray-600 text-nowrap">
            See in Explorer
          </Text>
          <Image
            src="/static/icons/arrow-top-right.svg"
            width={16}
            height={16}
            alt="Link"
          />
        </Link>
      </div>
    </div>
  )
}

export default WidgetCard
