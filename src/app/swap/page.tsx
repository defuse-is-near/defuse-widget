"use client"

import React, { useEffect, useState } from "react"
import { FieldValues } from "react-hook-form"

import Paper from "@src/components/Paper"
import Form from "@src/components/Form"
import FieldComboInput from "@src/components/Form/FieldComboInput"
import Button from "@src/components/Button"
import Switch from "@src/components/Switch"
import { useSwap } from "@src/hooks/useSwap"
import { LIST_NETWORKS_TOKENS } from "@src/constants/tokens"
import { useWalletSelector } from "@src/providers/WalletSelectorProvider"
import { useModalStore } from "@src/providers/ModalStoreProvider"
import { ModalType } from "@src/stores/modalStore"
import { NetworkToken } from "@src/types/interfaces"
import { ModalSelectAssetsPayload } from "@src/components/Modal/ModalSelectAssets"
import useSwapEstimateBot from "@src/hooks/useSwapEstimateBot"

type FormValues = {
  tokenIn: string
  tokenOut: string
}

export default function Swap() {
  const [selectTokenIn, setSelectTokenIn] = useState<NetworkToken | undefined>(
    LIST_NETWORKS_TOKENS[0]
  )
  const [selectTokenOut, setSelectTokenOut] = useState<
    NetworkToken | undefined
  >(LIST_NETWORKS_TOKENS[1])

  const { selector, accountId } = useWalletSelector()
  const { setModalType, payload } = useModalStore((state) => state)
  const { onChangeInputToken, onChangeOutputToken, callRequestIntent } =
    useSwap({ selector, accountId })
  const { getSwapEstimateBot } = useSwapEstimateBot()

  const handleResetToken = (
    token: NetworkToken,
    checkToken: NetworkToken,
    setSelectToken: (value?: NetworkToken) => void
  ) => {
    if (
      token.address === checkToken?.address &&
      token.chainId === checkToken?.chainId
    ) {
      setSelectToken(undefined)
    }
  }

  useEffect(() => {
    if (
      (payload as ModalSelectAssetsPayload)?.modalType !==
      ModalType.MODAL_SELECT_ASSETS
    ) {
      return
    }
    const { modalType, fieldName, token } = payload as ModalSelectAssetsPayload
    if (modalType === ModalType.MODAL_SELECT_ASSETS && fieldName && token) {
      switch (fieldName) {
        case "tokenIn":
          setSelectTokenIn(token)
          onChangeInputToken(token)
          handleResetToken(
            token,
            selectTokenOut as NetworkToken,
            setSelectTokenOut
          )
          break
        case "tokenOut":
          setSelectTokenOut(token)
          onChangeOutputToken(token)
          handleResetToken(
            token,
            selectTokenIn as NetworkToken,
            setSelectTokenIn
          )
          break
      }
    }
  }, [payload, selectTokenIn, selectTokenOut])

  const handleSubmit = async (values: FieldValues) => {
    await callRequestIntent({
      inputAmount: values.tokenIn,
    })
  }

  const handleSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const tempCopy = Object.assign({}, selectTokenIn)
    setSelectTokenIn(selectTokenOut)
    setSelectTokenOut(tempCopy)
  }

  const handleSetMax = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("form set max")
  }

  const handleSelect = (fieldName: string) => {
    setModalType(ModalType.MODAL_SELECT_ASSETS, { fieldName })
  }

  return (
    <Paper
      title="Swap"
      description="Cross-chain swap across any network, any token."
    >
      <Form<FormValues> onSubmit={handleSubmit}>
        <FieldComboInput<FormValues>
          fieldName="tokenIn"
          price={selectTokenIn?.balanceToUds}
          balance={selectTokenIn?.balance}
          selected={selectTokenIn}
          handleChange={(e) =>
            getSwapEstimateBot({
              tokenIn: selectTokenIn!.address as string,
              tokenOut: selectTokenOut!.address as string,
              amountIn: e.target.value,
            })
          }
          handleSelect={() => handleSelect("tokenIn")}
          handleSetMax={handleSetMax}
          className="border rounded-t-xl"
        />
        <Switch onClick={handleSwitch} />
        <FieldComboInput<FormValues>
          fieldName="tokenOut"
          price={selectTokenOut?.balanceToUds}
          selected={selectTokenOut}
          handleSelect={() => handleSelect("tokenOut")}
          className="border rounded-b-xl mb-5"
        />
        <Button type="submit" size="lg" fullWidth>
          Swap
        </Button>
      </Form>
    </Paper>
  )
}
