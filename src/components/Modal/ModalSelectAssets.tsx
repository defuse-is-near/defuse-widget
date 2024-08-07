"use client"

import { useState, useDeferredValue, useEffect } from "react"
import { Text } from "@radix-ui/themes"

import ModalDialog from "@src/components/Modal/ModalDialog"
import SearchBar from "@src/components/SearchBar"
import AssetList from "@src/components/Network/AssetList"
import { NetworkToken, NetworkTokenWithSwapRoute } from "@src/types/interfaces"
import { useModalStore } from "@src/providers/ModalStoreProvider"
import { ModalType } from "@src/stores/modalStore"
import { useTokensStore } from "@src/providers/TokensStoreProvider"

export type ModalSelectAssetsPayload = {
  modalType?: ModalType.MODAL_SELECT_ASSETS
  token?: NetworkToken
  fieldName?: string
}

export interface TokenListWithNotSelectableToken
  extends NetworkTokenWithSwapRoute {
  isNotSelectable?: boolean
}

const ModalSelectAssets = () => {
  const [searchValue, setSearchValue] = useState("")
  const [assetList, setAssetList] = useState<NetworkTokenWithSwapRoute[]>([])
  const [assetListWithBalances, setAssetListWithBalances] = useState<
    NetworkTokenWithSwapRoute[]
  >([])

  const { onCloseModal, modalType, payload } = useModalStore((state) => state)
  const { data, isLoading } = useTokensStore((state) => state)
  const deferredQuery = useDeferredValue(searchValue)

  const handleSearchClear = () => setSearchValue("")

  const filterPattern = (asset: NetworkToken) =>
    asset
      .name!.toLocaleUpperCase()
      .includes(deferredQuery.toLocaleUpperCase()) ||
    asset
      .chainName!.toLocaleUpperCase()
      .includes(deferredQuery.toLocaleUpperCase())

  const handleSelectToken = (token: NetworkToken) => {
    onCloseModal({
      ...(payload as { fieldName: string }),
      modalType,
      token,
    })
  }

  useEffect(() => {
    if (!data.size && !isLoading) {
      return
    }
    const { selectToken, fieldName } = payload as {
      selectToken: NetworkTokenWithSwapRoute | undefined
      fieldName: string
    }

    const getAssetList: TokenListWithNotSelectableToken[] = []
    const getAssetListWithBalances: TokenListWithNotSelectableToken[] = []
    data.forEach((value) => {
      let isNotSelectable = false
      // We do not filter "tokenIn" as give full access to tokens in first step
      // Filtration by routes should happen only at "tokenOut"
      const isAlreadySelected =
        selectToken && value.defuse_asset_id === selectToken.defuse_asset_id
      const isTokenOutAndNotSelectable =
        selectToken &&
        fieldName === "tokenOut" &&
        !selectToken?.routes?.includes(value.defuse_asset_id)
      if (isAlreadySelected || isTokenOutAndNotSelectable) {
        isNotSelectable = true
      }

      if (value?.balance) {
        getAssetListWithBalances.push({
          ...value,
          balance: value?.balance,
          isNotSelectable,
        })
      }
      getAssetList.push({ ...value, isNotSelectable })
    })
    setAssetList(getAssetList)
    setAssetListWithBalances(getAssetListWithBalances)
  }, [data, isLoading])

  return (
    <ModalDialog>
      <div className="flex flex-col min-h-[680px] max-h-[680px] h-full">
        <div className="flex-none p-5 border-b border-gray-100 dark:border-black-950">
          <SearchBar
            query={searchValue}
            setQuery={setSearchValue}
            handleOverrideCancel={onCloseModal}
          />
        </div>
        {!deferredQuery.length && assetListWithBalances.length ? (
          <div className="relative flex-1 border-b border-gray-100 px-2.5 min-h-[228px] h-full max-h-[228px] overflow-y-auto dark:border-black-950">
            <AssetList
              assets={assetListWithBalances}
              title="Your tokens"
              handleSelectToken={handleSelectToken}
            />
          </div>
        ) : null}
        <div className="flex-1 flex flex-col justify-between border-b border-gray-100 px-2.5 overflow-y-auto dark:border-black-950">
          <AssetList
            assets={deferredQuery ? assetList.filter(filterPattern) : assetList}
            title={deferredQuery ? "Search results" : "Popular tokens"}
            className="h-full"
            handleSelectToken={handleSelectToken}
          />
          {deferredQuery && (
            <div className="flex justify-center items-center">
              <button
                onClick={handleSearchClear}
                className="mb-2.5 px-3 py-1.5 bg-red-100 rounded-full"
              >
                <Text size="2" weight="medium" className="text-red-400">
                  Clear results
                </Text>
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalDialog>
  )
}

export default ModalSelectAssets
