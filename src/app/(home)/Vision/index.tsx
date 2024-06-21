import { Text } from "@radix-ui/themes"

import Section from "@src/app/(home)/Section"
import CardMulti from "@src/app/(home)/Card/CardMulti"

const Vision = () => {
  return (
    <Section title="Our vision">
      <div className="flex flex-col justify-center">
        <p className="text-center text-[20px] md:text-[32px] font-black text-gray-600 mb-4 md:mb-5">
          <Text as="span">Defuse is ther first platform that&nbsp;</Text>
          <Text as="span" className="text-primary">
            bridges the gap between centralized and decentralized exchanges
          </Text>
          <Text as="span">
            , creating a seamless, scalable, and secure multi-chain DeFi
            ecosystem.
          </Text>
        </p>
        <p className="text-center text-[20px] md:text-[32px] font-black text-gray-600 mb-[40px] md:mb-[56px]">
          <Text as="span">
            With Defuse, you can create, trade, and innovate without
            limitations, enjoying unified liquidity.
          </Text>
        </p>
        <div className="w-full flex flex-col gap-[20px] md:gap-[32px]">
          <CardMulti
            title="AccountFi"
            description="Trade, stake, and manage a wide range of assets, including NFTs, FTs, SBTs, and more, across multiple chains without moving funds from their native chains."
            image="/static/logos/Group AccountFi.svg"
          />
          <CardMulti
            title="Decentralized and Multi-Chain"
            description="Defuse is built on a decentralized, multi-chain infrastructure with sharded contracts, supporting any load and unifying liquidity across the crypto ecosystem. It's fully non-custodial and it eliminates the need for bridges."
            isReverse
            image="/static/logos/Group 17.svg"
            cover="/static/logos/bg-light.svg"
          />
          <CardMulti
            title="Bringing Everyone Together"
            description="Defuse fosters collaboration among protocol developers, distribution channels, Solvers/MMs, ecosystems, and token founders. It promotes transparency, simplifies relationships, and encourages active contributions from all market participants."
            image="/static/logos/Group 27.svg"
            variant="center-bottom"
          />
        </div>
      </div>
    </Section>
  )
}

export default Vision
