import { Button, Text } from "@radix-ui/themes"
import Image from "next/image"
import { PropsWithChildren } from "react"

import Section from "@src/app/(home)/Section"

const ButtonFAQ = ({ children }: PropsWithChildren) => {
  return (
    <Button className="h-[74px] md:h-[76px] w-full flex justify-between items-center bg-gray-950 px-6 md:px-8 py-6 rounded-2xl">
      <Text className="leading-6 text-base md:text-xl text-black-400 font-bold">
        {children}
      </Text>
      <Image
        src="/static/icons/plus.svg"
        alt="Plus Icon"
        width={24}
        height={24}
      />
    </Button>
  )
}

const FAQ = () => {
  return (
    <Section title="FAQ">
      <div className="mx-auto flex flex-col gap-4 mt-[40px] mb-[54px] md:mb-[74px] max-w-[512px]">
        <ButtonFAQ>What is Defuse?</ButtonFAQ>
        <ButtonFAQ>How does Defuse work?</ButtonFAQ>
        <ButtonFAQ>What is AccountFi?</ButtonFAQ>
        <ButtonFAQ>Staking & ETFs</ButtonFAQ>
      </div>
    </Section>
  )
}

export default FAQ
