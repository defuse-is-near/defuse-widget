import { Button, Text } from "@radix-ui/themes"

const Interested = () => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full min-h-[420px] py-8 px-[34px] md:px-16 shadow-card-multi rounded-[40px] mb-[96px] md:mb-[128px]">
      <Text className="text-[32px] md:text-5xl font-black">
        Interested in Defuse?
      </Text>
      <Text
        weight="bold"
        className="text-sm md:text-xl max-w-[558px] text-gray-600"
      >
        Connect with us to explore how Defuse is revolutionizing multichain
        financial products and how you can be a part of this groundbreaking
        journey.
      </Text>
      <div className="w-full md:max-w-[558px] flex flex-wrap justify-center items-center gap-2.5 md:gap-5 px-[24px] md:px-[51px]">
        <div className="flex-1 md:min-w-[170px] w-full">
          <Button variant="solid" color="orange" size="4" className="w-full">
            <Text size="4" weight="medium">
              Contact us
            </Text>
          </Button>
        </div>
        <div className="flex-1 md:min-w-[170px] w-full">
          <Button color="orange" size="4" variant="outline" className="w-full">
            <Text size="4" weight="medium" className="text-nowrap">
              Subscribe to updates
            </Text>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Interested
