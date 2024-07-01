"use client"

import React from "react"
import { FieldValues, useForm } from "react-hook-form"
import Image from "next/image"

import Paper from "@src/components/Paper"
import Form from "@src/components/Form"
import FieldComboInput from "@src/components/Form/FieldComboInput"
import ButtonSwitch from "@src/components/Button/ButtonSwitch"
import Accordion from "@src/components/Accordion"
import Button from "@src/components/Button/Button"
import { NetworkToken } from "@src/types/interfaces"

type FormValues = {
  tokenIn: string
  tokenOut: string
}

export default function Deposit() {
  const { handleSubmit, register } = useForm<FormValues>()

  const onSubmit = (values: FieldValues) => {
    console.log(values, "form submit")
  }
  const handleSwitch = () => {
    console.log("form switch")
  }
  const handleSetMax = () => {
    console.log("form set max")
  }
  return (
    <Paper title="Deposit">
      <Form<FormValues>
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
      >
        <FieldComboInput<FormValues>
          fieldName="tokenIn"
          label="You pay"
          selected={{ name: "USD" } as NetworkToken}
        />
        <ButtonSwitch onClick={handleSwitch} />
        <FieldComboInput<FormValues>
          fieldName="tokenOut"
          label="You receive"
          selected={{ name: "AURORA" } as NetworkToken}
        />
        <Accordion
          leftHeaderElement={
            <>
              <span className="text-sm font-medium">0.184 ETH = €2,681.60</span>
              <span className="text-sm text-gray-700">($0.361)</span>
            </>
          }
          rightHeaderElement={
            <>
              <Image
                src="/static/icons/fire.svg"
                width={12}
                height={16}
                alt="caret-down"
              />
              <span className="text-sm font-medium text-gray-700">$5.56</span>
            </>
          }
        />
        <Button type="submit" size="lg" fullWidth disabled>
          Coming soon
        </Button>
      </Form>
    </Paper>
  )
}
