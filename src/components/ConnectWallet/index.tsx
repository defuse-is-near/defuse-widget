"use client"

import React, { useState, useEffect } from "react"
import { Popover, Switch, Text } from "@radix-ui/themes"
import { useTheme } from "next-themes"
import clsx from "clsx"
import { EnterIcon, CopyIcon, CountdownTimerIcon } from "@radix-ui/react-icons"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import type { Account } from "@src/types/interfaces"
import { useGetAccount } from "@src/hooks/useGetAccount"
import Themes from "@src/types/themes"
import useShortAccountId from "@src/hooks/useShortAccountId"
import ConnectWalletTabs from "@src/components/ConnectWallet/ConnectWalletTabs"
import { THEME_MODE_KEY } from "@src/constants/contracts"
import CopyToClipboard from "@src/components/CopyToClipboard"
import { useHistoryStore } from "@src/providers/HistoryStoreProvider"
import { useConnectWallet } from "@src/hooks/useConnectWallet"

const TURN_OFF_APPS = process?.env?.turnOffApps === "true" ?? true

const ConnectWallet = () => {
  const { selector, accountId } = useWalletSelector()
  const { getAccount } = useGetAccount({ accountId, selector })
  const [loading, setLoading] = useState<boolean>(false)
  const [account, setAccount] = useState<Account | null>(null)
  const { theme, setTheme } = useTheme()
  const { shortAccountId } = useShortAccountId(accountId as string)
  const { openWidget } = useHistoryStore((state) => state)
  const { handleSignIn, handleSignOut } = useConnectWallet()

  useEffect(() => {
    const getThemeFromLocal = localStorage.getItem(THEME_MODE_KEY)
    if (!getThemeFromLocal) {
      setTheme(Themes.LIGHT)
      return
    }
    if (getThemeFromLocal === "light" || getThemeFromLocal === "dark") {
      setTheme(getThemeFromLocal)
    }
  }, [])

  const onChangeTheme = () => {
    setTheme(theme === Themes.DARK ? Themes.LIGHT : Themes.DARK)
  }

  useEffect(() => {
    if (!accountId) {
      return setAccount(null)
    }

    setLoading(true)

    getAccount().then((nextAccount) => {
      setAccount(nextAccount)
      setLoading(false)
    })
  }, [accountId, getAccount])

  const handleTradeHistory = () => openWidget()

  if (!account || TURN_OFF_APPS) {
    return (
      <button
        onClick={handleSignIn}
        className={clsx(
          "rounded-full text-white px-4 py-2.5 text-sm",
          TURN_OFF_APPS ? "bg-gray-500" : "bg-primary"
        )}
        disabled={TURN_OFF_APPS}
      >
        <Text size="2" weight="medium" wrap="nowrap">
          Connect wallet
        </Text>
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <Popover.Root>
        <Popover.Trigger>
          <button
            className="rounded-full bg-gray-200 text-black-400 text-sm px-3 py-1.5"
            disabled={TURN_OFF_APPS}
          >
            {shortAccountId}
          </button>
        </Popover.Trigger>
        <Popover.Content className="min-w-[330px] mt-1 md:mr-[48px]">
          <ConnectWalletTabs />
          <div className="flex flex-col items-start gap-4 mt-[10px] mb-[22px]">
            <div
              onClick={onChangeTheme}
              className="flex justify-between items-center gap-4"
            >
              <Text size="2" weight="medium">
                Dark Mode
              </Text>
              <Switch
                className="cursor-pointer"
                size="1"
                onClick={onChangeTheme}
                color="orange"
              />
            </div>
            <button
              onClick={handleTradeHistory}
              className="flex justify-start items-center gap-2"
            >
              <CountdownTimerIcon width={16} height={16} />
              <Text size="2" weight="medium">
                Transactions
              </Text>
            </button>
            <CopyToClipboard value={account.account_id}>
              <div className="flex justify-start items-center gap-2">
                <CopyIcon width={16} height={16} />
                <Text size="2" weight="medium">
                  Copy address
                </Text>
              </div>
            </CopyToClipboard>
            <button
              onClick={handleSignOut}
              className="flex justify-start items-center gap-2"
            >
              <EnterIcon width={16} height={16} />
              <Text size="2" weight="medium">
                Disconnect wallet
              </Text>
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}

export default ConnectWallet
