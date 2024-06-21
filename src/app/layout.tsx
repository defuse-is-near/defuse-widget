import { Theme } from "@radix-ui/themes"
import { ThemeProvider } from "next-themes"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import queryClient from "@src/constants/queryClient"
import { WalletSelectorProvider } from "@src/providers/WalletSelectorProvider"
import { HistoryStoreProvider } from "@src/providers/HistoryStoreProvider"
import { ModalStoreProvider } from "@src/providers/ModalStoreProvider"
import Modal from "@src/components/Modal"
import "@radix-ui/themes/styles.css"
import "@near-wallet-selector/modal-ui/styles.css"
import "@near-wallet-selector/account-export/styles.css"
import "../styles/global.scss"

const DEV_MODE = process?.env?.ENVIRONMENT === "development" ?? false

const RootLayout = ({
  children,
}: Readonly<{
  children?: React.ReactNode
}>) => {
  // CONTEXT: Could be used to share global concerns, theme
  //          like the current theme etc.
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <WalletSelectorProvider>
            <ThemeProvider attribute="class">
              <Theme>
                <HistoryStoreProvider>
                  <ModalStoreProvider>
                    {children}
                    <Modal />
                  </ModalStoreProvider>
                </HistoryStoreProvider>
              </Theme>
            </ThemeProvider>
          </WalletSelectorProvider>
          {DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
