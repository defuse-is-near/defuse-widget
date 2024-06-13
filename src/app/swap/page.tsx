"use client"

import React, { useEffect, useRef, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { parseUnits } from "viem"

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
import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"
import { debounce } from "@src/utils/debounce"

type FormValues = {
  tokenIn: string
  tokenOut: string
}

export default function Swap() {
  const { handleSubmit, register, watch, setValue, getValues } =
    useForm<FormValues>()
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
  const isProgrammaticUpdate = useRef(false)

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

  const onSubmit = async (values: FieldValues) => {
    await callRequestIntent({
      inputAmount: values.tokenIn,
    })
  }

  const handleSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const tempTokenInCopy = Object.assign({}, selectTokenIn)
    setSelectTokenIn(selectTokenOut)
    setSelectTokenOut(tempTokenInCopy)

    // Use isProgrammaticUpdate as true to prevent unnecessary estimate
    const tempValueTokenInCopy = getValues("tokenIn")
    isProgrammaticUpdate.current = true
    setValue("tokenIn", getValues("tokenOut"))
    isProgrammaticUpdate.current = true
    setValue("tokenOut", tempValueTokenInCopy)
  }

  const handleSetMax = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("form set max")
  }

  const handleSelect = (fieldName: string) => {
    setModalType(ModalType.MODAL_SELECT_ASSETS, { fieldName })
  }

  const debouncedGetSwapEstimateBot = debounce(
    async (data: DataEstimateRequest) => {
      const estimatedAmountOut = await getSwapEstimateBot(data)
      isProgrammaticUpdate.current = true
      setValue("tokenOut", estimatedAmountOut)
    },
    2000
  )

  const debouncedGetSwapEstimateBotReverse = debounce(
    async (data: DataEstimateRequest) => {
      const estimatedAmountIn = await getSwapEstimateBot(data)
      isProgrammaticUpdate.current = true
      setValue("tokenIn", estimatedAmountIn)
    },
    2000
  )

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (isProgrammaticUpdate.current) {
        isProgrammaticUpdate.current = false
        return
      }

      const unitsTokenIn = parseUnits(
        String(value.tokenIn),
        selectTokenIn?.decimals as number
      ).toString()
      const unitsTokenOut = parseUnits(
        String(value.tokenOut),
        selectTokenOut?.decimals as number
      ).toString()

      if (name === "tokenIn") {
        debouncedGetSwapEstimateBot({
          tokenIn: selectTokenIn!.address,
          tokenOut: selectTokenOut!.address,
          amountIn: unitsTokenIn,
        } as DataEstimateRequest)
      } else if (name === "tokenOut") {
        debouncedGetSwapEstimateBotReverse({
          tokenIn: selectTokenOut!.address,
          tokenOut: selectTokenIn!.address,
          amountIn: unitsTokenOut,
        } as DataEstimateRequest)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, selectTokenIn, selectTokenOut, getSwapEstimateBot, setValue])

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

  return (
    <Paper
      title="Swap"
      description="Cross-chain swap across any network, any token."
    >
      <Form<FormValues>
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
      >
        <FieldComboInput<FormValues>
          fieldName="tokenIn"
          price={selectTokenIn?.balanceToUds as string}
          balance={selectTokenIn?.balance as string}
          selected={selectTokenIn as NetworkToken}
          handleSelect={() => handleSelect("tokenIn")}
          handleSetMax={handleSetMax}
          className="border rounded-t-xl"
        />
        <Switch onClick={handleSwitch} />
        <FieldComboInput<FormValues>
          fieldName="tokenOut"
          price={selectTokenOut?.balanceToUds as string}
          selected={selectTokenOut as NetworkToken}
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
