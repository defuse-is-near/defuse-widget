"use client"

import React from "react"
import { Grid, Text, TextArea } from "@radix-ui/themes"

import CardBalance from "@src/app/wallet/CardBalance"
import CardTokenList from "@src/app/wallet/CardTokenList"
import {
  nearTokenList,
  otherTokenList,
} from "@src/app/wallet/CardBalance/mocks"

export interface TokenBalance {
  name: string
  symbol: string
  balance: string
  icon?: string
  balanceToUsd?: string
  chainId?: string
}

export default function Wallet() {
  return (
    <div className="flex flex-col flex-1 mx-3 md:mx-6">
      <div className="w-full mx-auto max-w-[768px] mt-[24px] mb-[32px] md:mt-[64px] md:mb-[90px]">
        <h1 className="mb-8">Wallet</h1>
      </div>
      <div className="w-full mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 mb-[90px]">
        <div className="flex flex-col gap-8">
          <CardBalance
            label="NEAR balance (available)"
            balance="903.56"
            handleCopy={() => console.log("Copy wallet")}
          />
          <CardTokenList list={nearTokenList} />
        </div>
        <div className="flex flex-col gap-8 blur-sm">
          <CardBalance label="Deposited balance" balance="Deposited balance" />
          <CardTokenList list={otherTokenList} />
        </div>
      </div>
    </div>
  )
}
