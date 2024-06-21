import clsx from "clsx"
import { Text } from "@radix-ui/themes"

export enum StatsGroupType {
  MAIN = "main",
  REGULAR = "regular",
  PRIMARY = "primary",
}

export type StatsGroupProps = {
  label: string
  type: StatsGroupType
  data: {
    description: string
    icon?: string
  }[]
}

const CardStats = ({ label, type, data }: StatsGroupProps) => {
  return (
    <div
      className={clsx(
        "flex flex-1 flex-col min-w-[241px]",
        type !== StatsGroupType.PRIMARY && "mr-[20px]"
      )}
    >
      <div className="flex justify-center items-center">
        <Text>{label}</Text>
      </div>
      {data.map(({ description, icon }, index) => (
        <div key={index}>{description}</div>
      ))}
    </div>
  )
}

export default CardStats
