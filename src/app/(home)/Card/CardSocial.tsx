import { Text } from "@radix-ui/themes"
import Image from "next/image"
import Link from "next/link"

type Props = {
  name: string
  icon: string
  link: string
}
const CardSocial = ({ name, icon, link }: Props) => {
  return (
    <div className="relative p-4 ld:p-8 shadow-card-multi bg-white rounded-2xl min-w-full lg:min-w-[335px]">
      <div className="flex items-center lg:items-start  lg:flex-col gap-4">
        <Image src={icon} width={48} height={48} alt="Social Icon" />
        <Text className="text-base md:text-xl font-bold">{name}</Text>
      </div>
      <Link
        href={link}
        target="_blank"
        className="absolute inset-y-1/2 -translate-y-[12px] lg:translate-y-0 lg:top-5 right-5"
      >
        <Image
          src="/static/icons/arrow-top-right.svg"
          width={24}
          height={24}
          alt="Link Icon"
        />
      </Link>
    </div>
  )
}

export default CardSocial
