import { Text } from "@radix-ui/themes"

const WidgetEmpty = () => {
  return (
    <div className="block">
      <div className="mt-2 mb-[26px]">
        <Text size="4" weight="bold">
          Transactions
        </Text>
      </div>
      <div className="w-full min-h-[36px] md:min-h-[204px] h-full bg-gray rounded-2xl flex justify-center items-center">
        <div className="w-full md:max-w-[102px] text-center text-gray-600">
          <Text size="1">Your transactions will appear here </Text>
        </div>
      </div>
    </div>
  )
}

export default WidgetEmpty
