export enum Navigation {
  HOME = "/",
  SWAP = "/swap",
  DEPOSIT = "/deposit",
  WITHDRAW = "/withdraw",
  WALLET = "/wallet",
}

export type NavigationLinks = {
  action?: () => void
  href?: Navigation
  label: string
  comingSoon?: true
}

export const LINKS_HEADER: NavigationLinks[] = [
  { href: Navigation.SWAP, label: "Swap" },
  { href: Navigation.DEPOSIT, label: "Deposit", comingSoon: true },
  { href: Navigation.WITHDRAW, label: "Withdraw", comingSoon: true },
]
