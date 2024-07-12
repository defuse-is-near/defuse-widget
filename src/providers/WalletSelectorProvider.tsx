"use client"

import type {
  AccountState,
  NetworkId,
  Wallet,
  WalletSelector,
  WalletSelectorParams,
} from "@near-wallet-selector/core"
import { setupWalletSelector } from "@near-wallet-selector/core"
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui"
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet"
import { setupHereWallet } from "@near-wallet-selector/here-wallet"
import { setupMathWallet } from "@near-wallet-selector/math-wallet"
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet"
import { setupNarwallets } from "@near-wallet-selector/narwallets"
import { setupModal } from "@near-wallet-selector/modal-ui"
import { setupNearFi } from "@near-wallet-selector/nearfi"
import { setupNightly } from "@near-wallet-selector/nightly"
import { setupSender } from "@near-wallet-selector/sender"
import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet"
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect"
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet"
import { setupNearSnap } from "@near-wallet-selector/near-snap"
import { setupNeth } from "@near-wallet-selector/neth"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet"
import { setupLedger } from "@near-wallet-selector/ledger"
import { setupXDEFI } from "@near-wallet-selector/xdefi"
import { setupRamperWallet } from "@near-wallet-selector/ramper-wallet"
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet"
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet"
import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react"
import { distinctUntilChanged, map } from "rxjs"
import { WalletModuleFactory } from "@near-wallet-selector/core/src/lib/wallet/wallet.types"

declare global {
  interface Window {
    selector: WalletSelector
    modal: WalletSelectorModal
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector
  modal: WalletSelectorModal
  accounts: Array<AccountState>
  accountId: string | null
}

import { Loading } from "@src/components/Loading"
import { CONTRACTS_REGISTER } from "@src/constants/contracts"

interface ExtendedWalletSelectorParams extends WalletSelectorParams {
  nodeUrl?: string
}

const NEAR_ENV = process.env.NEAR_ENV ?? "testnet"
const NEAR_NODE_URL = process.env.nearNodeUrl ?? "https://rpc.mainnet.near.org"
const WALLET_CONNECT_PROJECT_ID = process.env.walletConnectProjectId ?? ""

export const WalletSelectorContext =
  createContext<WalletSelectorContextValue | null>(null)

export const WalletSelectorProvider: React.FC<{
  children: ReactNode
}> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null)
  const [modal, setModal] = useState<WalletSelectorModal | null>(null)
  const [accounts, setAccounts] = useState<Array<AccountState>>([])
  const [loading, setLoading] = useState<boolean>(true)

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      nodeUrl: NEAR_NODE_URL,
      network: NEAR_ENV as NetworkId,
      debug: true,
      modules: [
        setupMyNearWallet(),
        setupLedger(),
        setupSender(),
        setupBitgetWallet(),
        setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
        setupNearSnap(),
        setupNarwallets(),
        setupWelldoneWallet(),
        setupHereWallet(),
        setupCoin98Wallet(),
        setupNearFi(),
        setupRamperWallet(),
        setupNeth({
          gas: "300000000000000",
          bundle: false,
        }),
        setupXDEFI(),
        setupWalletConnect({
          projectId: WALLET_CONNECT_PROJECT_ID,
          metadata: {
            name: "Defuse Protocol",
            description:
              "Defuse: the premier platform for cross-chain liquidity and trading. Experience efficient, secure, and transparent swaps across multiple blockchains.",
            url: "https://github.com/defuse-protocol",
            icons: ["https://defuse.org/static/icons/Logo.svg"],
          },
        }),
        setupNearMobileWallet(),
        setupMintbaseWallet({
          contractId: "", // Example guest-book.testnet
        }) as WalletModuleFactory<Wallet>,
      ],
    } as ExtendedWalletSelectorParams)
    const _modal = setupModal(_selector, {
      contractId: CONTRACTS_REGISTER.INTENT,
    })
    const state = _selector.store.getState()
    setAccounts(state.accounts)

    // this is added for debugging purpose only
    // for more information (https://github.com/near/wallet-selector/pull/764#issuecomment-1498073367)
    window.selector = _selector
    window.modal = _modal

    setSelector(_selector)
    setModal(_modal)
    setLoading(false)
  }, [])

  useEffect(() => {
    init().catch((err) => {
      console.error(err)
      alert("Failed to initialise wallet selector")
    })
  }, [init])

  useEffect(() => {
    if (!selector) {
      return
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts)

        setAccounts(nextAccounts)
      })

    const onHideSubscription = modal!.on("onHide", ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`)
    })

    return () => {
      subscription.unsubscribe()
      onHideSubscription.remove()
    }
  }, [selector, modal])

  const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(
    () => ({
      selector: selector!,
      modal: modal!,
      accounts,
      accountId: accounts.find((account) => account.active)?.accountId || null,
    }),
    [selector, modal, accounts]
  )

  if (loading) {
    return <Loading />
  }

  return (
    <WalletSelectorContext.Provider value={walletSelectorContextValue}>
      {children}
    </WalletSelectorContext.Provider>
  )
}

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext)

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    )
  }

  return context
}
