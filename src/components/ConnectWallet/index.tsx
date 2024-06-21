"use client"

import { useState, useEffect } from "react"
import { Popover, Switch, Text } from "@radix-ui/themes"
import { useTheme } from "next-themes"
import clsx from "clsx"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import type { Account } from "@src/types/interfaces"
import { useGetAccount } from "@src/hooks/useGetAccount"
import Themes from "@src/types/themes"
import useShortAccountId from "@src/hooks/useShortAccountId"

const TURN_OFF_APPS = process?.env?.turnOffApps === "true" ?? true

const ConnectWallet = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector()
  const { getAccount } = useGetAccount({ accountId, selector })
  const [loading, setLoading] = useState<boolean>(false)
  const [account, setAccount] = useState<Account | null>(null)
  const { theme, setTheme } = useTheme()
  const { shortAccountId } = useShortAccountId(accountId as string)

  useEffect(() => setTheme(Themes.LIGHT), [])

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

  const handleSignIn = () => {
    modal.show()
  }

  const handleSignOut = async () => {
    const wallet = await selector.wallet()

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out")
      console.error(err)
    })
  }

  const handleSwitchWallet = () => {
    modal.show()
  }

  const handleSwitchAccount = () => {
    const currentIndex = accounts.findIndex((x) => x.accountId === accountId)
    const nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0

    const nextAccountId = accounts[nextIndex].accountId

    selector.setActiveAccount(nextAccountId)

    alert("Switched account to " + nextAccountId)
  }

  const handleTradeHistory = () => console.log("handleTradeHistory")
  const handleCopyAddress = () => console.log("handleCopyAddress")

  if (!account) {
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
        <Popover.Content className="mt-1">
          <div className="flex flex-col items-start">
            <div
              onClick={onChangeTheme}
              className="flex justify-between items-center gap-1"
            >
              <span>Dark Mode</span>
              <Switch
                className="cursor-pointer"
                size="1"
                onClick={onChangeTheme}
              />
            </div>
            <button onClick={handleTradeHistory}>Trade history</button>
            <button onClick={handleCopyAddress}>Copy address</button>
            <button onClick={handleSignOut}>Disconnect wallet</button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}

export default ConnectWallet
