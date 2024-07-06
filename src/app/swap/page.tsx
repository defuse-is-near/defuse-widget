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
import { CONFIRM_SWAP_LOCAL_KEY } from "@src/constants/contracts"
import { useModalStore } from "@src/providers/ModalStoreProvider"
import { ModalType } from "@src/stores/modalStore"
import { NetworkToken } from "@src/types/interfaces"
import { ModalSelectAssetsPayload } from "@src/components/Modal/ModalSelectAssets"
import useSwapEstimateBot from "@src/hooks/useSwapEstimateBot"
import { DataEstimateRequest } from "@src/libs/de-sdk/types/interfaces"
import { debounce } from "@src/utils/debounce"
import { useModalSearchParams } from "@src/hooks/useModalSearchParams"
import { useAccountBalance } from "@src/hooks/useAccountBalance"
import { useCalculateTokenToUsd } from "@src/hooks/useCalculateTokenToUsd"
import { useTokensStore } from "@src/providers/TokensStoreProvider"
import { ModalConfirmSwapPayload } from "@src/components/Modal/ModalConfirmSwap"
import { useEvaluateSwapEstimation } from "@src/hooks/useEvaluateSwapEstimation"
import BlockEvaluatePrice from "@src/components/Block/BlockEvaluatePrice"

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

const ESTIMATE_BOT_AWAIT_250_MS = 250

export default function Swap() {
  const [selectTokenIn, setSelectTokenIn] = useState<SelectToken>()
  const [selectTokenOut, setSelectTokenOut] = useState<SelectToken>()
  const [errorSelectTokenIn, setErrorSelectTokenIn] = useState("")
  const [errorSelectTokenOut, setErrorSelectTokenOut] = useState("")
  const [withNativeSupport, setWithNativeSupport] = useState<boolean>(false)
  const [nativeSupportChecked, setNativeSupportChecked] =
    useState<CheckedState>(false)
  const { getAccountBalance } = useAccountBalance()
  const [nativeBalance, setNativeBalance] = useState("0")
  const {
    priceToUsd: priceToUsdTokenIn,
    calculateTokenToUsd: calculateTokenToUsdTokenIn,
  } = useCalculateTokenToUsd()
  const {
    priceToUsd: priceToUsdTokenOut,
    calculateTokenToUsd: calculateTokenToUsdTokenOut,
  } = useCalculateTokenToUsd()
  const { data, isFetched, isLoading } = useTokensStore((state) => state)
  const { data: evaluateSwapEstimation, getEvaluateSwapEstimate } =
    useEvaluateSwapEstimation()

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

  const handleValidateSelectTokens = (): boolean => {
    let isValid = true
    if (!selectTokenIn) {
      isValid = false
      setErrorSelectTokenIn("Select token is required")
    }
    if (!selectTokenOut) {
      isValid = false
      setErrorSelectTokenOut("Select token is required")
    }
    return isValid
  }

  const onSubmit = async (values: FieldValues) => {
    if (!handleValidateSelectTokens()) return
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
      const { bestOut, allEstimates } = await getSwapEstimateBot(data)
      getEvaluateSwapEstimate("tokenOut", data, allEstimates, bestOut)
      isProgrammaticUpdate.current = true
      setValue("tokenOut", bestOut ?? "0")
    },
    ESTIMATE_BOT_AWAIT_250_MS
  )

  const debouncedGetSwapEstimateBotReverse = debounce(
    async (data: DataEstimateRequest) => {
      const { bestOut, allEstimates } = await getSwapEstimateBot(data)
      getEvaluateSwapEstimate("tokenIn", data, allEstimates, bestOut)
      isProgrammaticUpdate.current = true
      setValue("tokenIn", bestOut ?? "0")
    },
    ESTIMATE_BOT_AWAIT_250_MS
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
      (name === "tokenOut" && !parseFloat(tokenOut)) ||
      !selectTokenIn ||
      !selectTokenOut
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
        tokenOut: selectTokenOut?.address,
        amountIn: unitsTokenIn,
      } as DataEstimateRequest)
    } else if (name === "tokenOut") {
      debouncedGetSwapEstimateBotReverse({
        tokenIn: selectTokenOut!.address,
        tokenOut: selectTokenIn?.address,
        amountIn: unitsTokenOut,
      } as DataEstimateRequest)
    }
  }

  useEffect(() => {
    if (!selectTokenIn && !selectTokenOut) {
      const getConfirmSwapFromLocal = localStorage.getItem(
        CONFIRM_SWAP_LOCAL_KEY
      )
      if (getConfirmSwapFromLocal) {
        const parsedData: { data: ModalConfirmSwapPayload } = JSON.parse(
          getConfirmSwapFromLocal
        )
        setSelectTokenIn(parsedData.data.selectedTokenIn)
        setSelectTokenOut(parsedData.data.selectedTokenOut)
        return
      }
      if (data.size) {
        data.forEach((token) => {
          if (token.address === "near") {
            setSelectTokenIn(token)
          }
          if (token.address === "usdt") {
            setSelectTokenOut(token)
          }
        })
        return
      }
    }
    // Do evaluate usd select tokens prices
    if (
      data.size &&
      !isLoading &&
      (!selectTokenIn?.convertedLast?.usd ||
        !selectTokenOut?.convertedLast?.usd)
    ) {
      data.forEach((token) => {
        if (selectTokenIn?.address === token.address) {
          setSelectTokenIn(token)
        }
        if (selectTokenOut?.address === token.address) {
          setSelectTokenOut(token)
        }
      })
    }
  }, [data, isFetched, isLoading])

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
      calculateTokenToUsdTokenIn(value.tokenIn as string, selectTokenIn)
      calculateTokenToUsdTokenOut(value.tokenOut as string, selectTokenOut)
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
    // Use to calculate when selectTokenIn or selectTokenOut is changed
    const valueTokenIn = getValues("tokenIn")
    const valueTokenOut = getValues("tokenOut")
    calculateTokenToUsdTokenIn(valueTokenIn, selectTokenIn)
    calculateTokenToUsdTokenOut(valueTokenOut, selectTokenOut)

    // Use watch to calculate when input is changed
    const subscription = watch((value) => {
      calculateTokenToUsdTokenIn(value.tokenIn as string, selectTokenIn)
      calculateTokenToUsdTokenOut(value.tokenOut as string, selectTokenOut)
    })
    return () => subscription.unsubscribe()
  }, [watch, selectTokenIn, selectTokenOut])

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
          setErrorSelectTokenIn("")
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
          setErrorSelectTokenOut("")
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
          price={priceToUsdTokenIn}
          balance={
            nativeSupportChecked
              ? (
                  Number(selectTokenIn?.balance) + Number(nativeBalance)
                ).toString()
              : selectTokenIn?.balance?.toString()
          }
          selected={selectTokenIn as NetworkToken}
          handleSelect={() => handleSelect("tokenIn", selectTokenOut)}
          className="border rounded-t-xl md:max-w-[472px]"
          required="This field is required"
          errors={errors}
          withNativeSupport={withNativeSupport}
          nativeSupportChecked={nativeSupportChecked}
          handleIncludeNativeToSwap={handleIncludeNativeToSwap}
          errorSelect={errorSelectTokenIn}
        />
        <div className="relative w-full">
          <ButtonSwitch onClick={handleSwitch} />
        </div>
        <FieldComboInput<FormValues>
          fieldName="tokenOut"
          price={priceToUsdTokenOut}
          label={
            <BlockEvaluatePrice
              priceEvaluation={evaluateSwapEstimation?.priceEvaluation}
              priceResults={evaluateSwapEstimation?.priceResults}
            />
          }
          balance={selectTokenOut?.balance?.toString()}
          selected={selectTokenOut as NetworkToken}
          handleSelect={() => handleSelect("tokenOut", selectTokenIn)}
          className="border rounded-b-xl mb-5 md:max-w-[472px]"
          required="This field is required"
          errors={errors}
          errorSelect={errorSelectTokenOut}
        />
        <Button type="submit" size="lg" fullWidth isLoading={isFetching}>
          Swap
        </Button>
      </Form>
    </Paper>
  )
}
