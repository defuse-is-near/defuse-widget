"use client"

import { useEffect, useRef, useState } from "react"
import { Text } from "@radix-ui/themes"

import Section from "@src/app/(home)/Section"
import { infrastructureData } from "@src/app/(home)/mocks"
import useResize from "@src/hooks/useResize"
import TableInfrastructure from "@src/app/(home)/Table/TableInfrastructure"

const Evolution = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const { width } = useResize(divRef)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  useEffect(() => {
    setContainerWidth(
      divRef.current ? (divRef.current!.offsetWidth as number) : 0
    )
  }, [divRef.current, width])

  return (
    <Section title="The Evolution of Trading Platforms">
      <div
        className="flex flex-col justify-center mb-[40px] md:mb-[96px]"
        ref={divRef}
      >
        <p className="text-center text-[20px] md:text-[32px] font-black text-gray-600">
          <Text as="span">
            Defuse unifies the best of CEXs and DEXs with a scalable,
            multi-chain infrastructure. Our goal is to&nbsp;
          </Text>
          <Text as="span" className="text-primary">
            minimize centralization risks, unify liquidity, and unlock
            DeFi&apos;s full potential
          </Text>
          <Text as="span">
            , creating the perfect hub for the next generation of decentralized
            finance.
          </Text>
        </p>
      </div>
      <TableInfrastructure
        data={infrastructureData}
        maxWidth={containerWidth}
      />
    </Section>
  )
}

export default Evolution
