"use client"

import { useState, useDeferredValue } from "react"
import { Text } from "@radix-ui/themes"

import ModalDialog from "@src/components/Modal/ModalDialog"
import SearchBar from "@src/components/SearchBar"
import AssetList from "@src/components/Network/AssetList"
import { NetworkToken } from "@src/types/interfaces"
import { LIST_NETWORKS_TOKENS } from "@src/constants/tokens"
import { useModalStore } from "@src/providers/ModalStoreProvider"
import { ModalType } from "@src/stores/modalStore"

export type ModalSelectAssetsPayload = {
  modalType?: ModalType.MODAL_SELECT_ASSETS
  token?: NetworkToken
  fieldName?: string
}

const ModalSelectAssets = () => {
  const { onCloseModal, modalType, payload } = useModalStore((state) => state)
  const [searchValue, setSearchValue] = useState("")
  const deferredQuery = useDeferredValue(searchValue)

  const handleSearchClear = () => setSearchValue("")

  const filterPattern = (asset: NetworkToken) =>
    asset
      .name!.toLocaleUpperCase()
      .includes(deferredQuery.toLocaleUpperCase()) ||
    asset
      .chainName!.toLocaleUpperCase()
      .includes(deferredQuery.toLocaleUpperCase())

  // TODO Add useGetTokenBalances and apply it to "Your tokens" tokens list

  const handleSelectToken = (token: NetworkToken) => {
    onCloseModal({
      ...(payload as { fieldName: string }),
      modalType,
      token,
    })
  }

  return (
    <ModalDialog>
      <div className="flex flex-col min-h-[680px] max-h-[680px] h-full">
        <div className="flex-none p-5 border-b border-gray-100">
          <SearchBar
            query={searchValue}
            setQuery={setSearchValue}
            handleOverrideCancel={onCloseModal}
          />
        </div>
        {!deferredQuery.length && (
          <div className="flex-1 border-b border-gray-100 px-2.5 min-h-[228px] h-full max-h-[228px] overflow-y-auto">
            <AssetList
              assets={LIST_NETWORKS_TOKENS.slice(0, 5)}
              title="Your tokens"
              handleSelectToken={handleSelectToken}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between border-b border-gray-100 px-2.5 overflow-y-auto">
          <AssetList
            assets={
              deferredQuery
                ? LIST_NETWORKS_TOKENS.filter(filterPattern)
                : LIST_NETWORKS_TOKENS
            }
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
