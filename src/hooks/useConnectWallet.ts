"use client"

import { useWalletSelector } from "@src/providers/WalletSelectorProvider"

interface ConnectWalletAction {
  handleSignIn: () => void
  handleSignOut: () => Promise<void>
  handleSwitchWallet: () => void
  handleSwitchAccount: () => void
}
export const useConnectWallet = (): ConnectWalletAction => {
  const { selector, modal, accounts, accountId } = useWalletSelector()

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

  return {
    handleSignIn,
    handleSignOut,
    handleSwitchWallet,
    handleSwitchAccount,
  }
}
