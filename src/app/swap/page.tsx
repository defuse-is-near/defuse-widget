"use client"

import React, { useEffect, useRef, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { formatUnits, parseUnits } from "viem"
import { CheckedState } from "@radix-ui/react-checkbox"

import Paper from "@src/components/Paper"
import Form from "@src/components/Form"
import FieldComboInput from "@src/components/Form/FieldComboInput"
import Button from "@src/components/Button/Button"
import ButtonSwitch from "@src/components/Button/ButtonSwitch"
import { LIST_NATIVE_TOKENS } from "@src/constants/tokens"
import { useModalStore } from "@src/providers/ModalStoreProvider"
import { ModalType } from "@src/stores/modalStore"
import { NetworkToken } from "@src/types/interfaces"
import { ModalSelectAssetsPayload } from "@src/components/Modal/ModalSelectAssets"
import useSwapEstimateBot from "@src/hooks/useSwapEstimateBot"
import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"
import { debounce } from "@src/utils/debounce"
import { useModalSearchParams } from "@src/hooks/useModalSearchParams"
import { useAccountBalance } from "@src/hooks/useAccountBalance"

type FormValues = {
  tokenIn: string
  tokenOut: string
}

type SelectToken = NetworkToken | undefined

type EstimateSwap = {
  tokenIn: string
  tokenOut: string
  name: string
  selectTokenIn: SelectToken
  selectTokenOut: SelectToken
}

export default function Swap() {
  const [selectTokenIn, setSelectTokenIn] = useState<SelectToken>()
  const [selectTokenOut, setSelectTokenOut] = useState<SelectToken>()
  const [withNativeSupport, setWithNativeSupport] = useState<boolean>(false)
  const [nativeSupportChecked, setNativeSupportChecked] =
    useState<CheckedState>(false)
  const { getAccountBalance } = useAccountBalance()
  const [nativeBalance, setNativeBalance] = useState("0")

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>()
  const { setModalType, payload, onCloseModal } = useModalStore(
    (state) => state
  )
  const { getSwapEstimateBot, isFetching } = useSwapEstimateBot()
  const isProgrammaticUpdate = useRef(false)
  useModalSearchParams()

  const handleResetToken = (
    token: NetworkToken,
    checkToken: NetworkToken,
    setSelectToken: (value?: NetworkToken) => void
  ): boolean => {
    if (
      token.address === checkToken?.address &&
      token.chainId === checkToken?.chainId
    ) {
      setSelectToken(undefined)
      return true
    }
    return false
  }

  const onSubmit = async (values: FieldValues) => {
    setModalType(ModalType.MODAL_REVIEW_SWAP, {
      tokenIn: values.tokenIn,
      tokenOut: values.tokenOut,
      selectedTokenIn: selectTokenIn,
      selectedTokenOut: selectTokenOut,
    })
  }

  const handleSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isFetching) {
      return
    }
    const tempTokenInCopy = Object.assign({}, selectTokenIn)
    setSelectTokenIn(selectTokenOut)
    setSelectTokenOut(tempTokenInCopy)

    // Use isProgrammaticUpdate as true to prevent unnecessary estimate
    const valueTokenIn = getValues("tokenIn")
    const valueTokenOut = getValues("tokenOut")
    isProgrammaticUpdate.current = true
    setValue("tokenIn", valueTokenOut)
    isProgrammaticUpdate.current = true
    setValue("tokenOut", valueTokenIn)
  }

  const handleIncludeNativeToSwap = (checked: CheckedState) => {
    setNativeSupportChecked(checked)
  }

  const handleSelect = (fieldName: string, selectToken: SelectToken) => {
    setModalType(ModalType.MODAL_SELECT_ASSETS, { fieldName, selectToken })
  }

  const debouncedGetSwapEstimateBot = debounce(
    async (data: DataEstimateRequest) => {
      const estimatedAmountOut = await getSwapEstimateBot(data)
      isProgrammaticUpdate.current = true
      setValue("tokenOut", estimatedAmountOut)
    },
    1000
  )

  const debouncedGetSwapEstimateBotReverse = debounce(
    async (data: DataEstimateRequest) => {
      const estimatedAmountIn = await getSwapEstimateBot(data)
      isProgrammaticUpdate.current = true
      setValue("tokenIn", estimatedAmountIn)
    },
    2000
  )

  const handleEstimateSwap = ({
    tokenIn,
    tokenOut,
    name,
    selectTokenIn,
    selectTokenOut,
  }: EstimateSwap) => {
    if (
      (name === "tokenIn" && !parseFloat(tokenIn)) ||
      (name === "tokenOut" && !parseFloat(tokenOut))
    ) {
      return
    }

    const unitsTokenIn = parseUnits(
      tokenIn,
      selectTokenIn?.decimals ?? 0
    ).toString()
    const unitsTokenOut = parseUnits(
      tokenOut,
      selectTokenOut?.decimals ?? 0
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
  }

  useEffect(() => {
    if (selectTokenIn?.defuse_asset_id) {
      const getNativeTokenToSwap = LIST_NATIVE_TOKENS.find((nativeToken) =>
        nativeToken.routes?.includes(selectTokenIn?.defuse_asset_id as string)
      )
      if (!getNativeTokenToSwap) {
        setNativeBalance("0")
        return setWithNativeSupport(false)
      }
      ;(async () => {
        const { balance } = await getAccountBalance()
        const formattedAmountOut = formatUnits(
          BigInt(balance),
          selectTokenIn.decimals as number
        )
        setNativeBalance(formattedAmountOut)
      })()
      setWithNativeSupport(true)
    }
  }, [selectTokenIn?.defuse_asset_id])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (isProgrammaticUpdate.current) {
        isProgrammaticUpdate.current = false
        return
      }
      handleEstimateSwap({
        tokenIn: String(value.tokenIn),
        tokenOut: String(value.tokenOut),
        name: name as string,
        selectTokenIn,
        selectTokenOut,
      })
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
          const isSelectTokenOutReset = handleResetToken(
            token,
            selectTokenOut as NetworkToken,
            setSelectTokenOut
          )
          isSelectTokenOutReset && setValue("tokenOut", "")
          !isSelectTokenOutReset &&
            handleEstimateSwap({
              tokenIn: getValues("tokenIn"),
              tokenOut: "",
              name: "tokenIn",
              selectTokenIn: token,
              selectTokenOut,
            })
          isProgrammaticUpdate.current = false
          break
        case "tokenOut":
          setSelectTokenOut(token)
          const isSelectTokenInReset = handleResetToken(
            token,
            selectTokenIn as NetworkToken,
            setSelectTokenIn
          )
          isSelectTokenInReset && setValue("tokenIn", "")
          !isSelectTokenInReset &&
            handleEstimateSwap({
              tokenIn: "",
              tokenOut: getValues("tokenOut"),
              name: "tokenOut",
              selectTokenIn,
              selectTokenOut: token,
            })
          isProgrammaticUpdate.current = false
          break
      }
      onCloseModal(undefined)
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
          balance={
            nativeSupportChecked
              ? (
                  Number(selectTokenIn?.balance) + Number(nativeBalance)
                ).toString()
              : (selectTokenIn?.balance as string)
          }
          selected={selectTokenIn as NetworkToken}
          handleSelect={() => handleSelect("tokenIn", selectTokenOut)}
          className="border rounded-t-xl md:max-w-[472px]"
          required="This field is required"
          errors={errors}
          withNativeSupport={withNativeSupport}
          nativeSupportChecked={nativeSupportChecked}
          handleIncludeNativeToSwap={handleIncludeNativeToSwap}
        />
        <div className="relative w-full">
          <ButtonSwitch onClick={handleSwitch} />
        </div>
        <FieldComboInput<FormValues>
          fieldName="tokenOut"
          price={selectTokenOut?.balanceToUds as string}
          balance={selectTokenOut?.balance as string}
          selected={selectTokenOut as NetworkToken}
          handleSelect={() => handleSelect("tokenOut", selectTokenIn)}
          className="border rounded-b-xl mb-5 md:max-w-[472px]"
          required="This field is required"
          errors={errors}
        />
        <Button type="submit" size="lg" fullWidth isLoading={isFetching}>
          Swap
        </Button>
      </Form>
    </Paper>
  )
}
