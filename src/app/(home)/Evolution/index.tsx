import { Text } from "@radix-ui/themes"

import Section from "@src/app/(home)/Section"
import CardStats from "@src/app/(home)/Card/CardStats"
import { group_1, group_2, group_3, group_4 } from "@src/app/(home)/mocks"

const Evolution = () => {
  return (
    <Section title="The Evolution of Trading Platforms">
      <div className="flex flex-col justify-center">
        <p className="text-center text-[20px] md:text-[32px] font-black text-gray-600 mb-4 md:mb-5">
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
        <div className="w-full flex overflow-x-auto">
          {/*<div className="mx-auto flex flex-nowrap">*/}
          {/*  <CardStats {...group_1} />*/}
          {/*  <CardStats {...group_2} />*/}
          {/*  <CardStats {...group_3} />*/}
          {/*  <CardStats {...group_4} />*/}
          {/*</div>*/}
        </div>
      </div>
    </Section>
  )
}

export default Evolution
