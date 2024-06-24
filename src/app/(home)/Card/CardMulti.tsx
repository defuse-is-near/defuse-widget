import clsx from "clsx"
import { Text } from "@radix-ui/themes"
import Image from "next/image"

type Props = {
  title: string
  description: string
  image?: string
  cover?: string
  isReverse?: boolean
  variant?: "right-bottom" | "center-bottom"
}
const CardMulti = ({
  title,
  description,
  image,
  cover,
  isReverse,
  variant = "right-bottom",
}: Props) => {
  return (
    <div className="relative w-full h-[502px] md:h-[364px]">
      <div
        className={clsx(
          "absolute w-full h-full flex flex-col md:flex-row p-[32px] md:p-[64px] shadow-card-multi bg-white rounded-[40px] overflow-hidden",
          isReverse && "md:flex-row-reverse"
        )}
      >
        <div className="flex flex-col justify-start md:justify-center items-center w-full md:max-w-[494px] flex-2">
          <Text
            className={clsx(
              "text-[20px] md:text-[32px] font-black text-black-400 mb-2 md:mb-4 self-start",
              isReverse && "md:self-end"
            )}
          >
            {title}
          </Text>
          <Text className="text-[14px] md:text-[18px] font-bold text-gray-600">
            {description}
          </Text>
        </div>
        <div className="relative w-full flex flex-1 justify-center items-center">
          {image && (
            <div
              className={clsx(
                "absolute w-[calc(100%+64px)] h-[calc(100%+64px)] md:w-[calc(100%+72px)] md:h-[calc(100%+72px)] flex justify-center items-center",
                variant === "center-bottom" && "-bottom-[88px] md:inset-y-auto"
              )}
            >
              <Image
                src={image}
                fill
                alt="Card Multi Image"
                className={clsx(
                  "object-contain z-10",
                  isReverse ? "object-left-bottom" : "object-right-bottom",
                  variant === "center-bottom" && "object-top"
                )}
              />
            </div>
          )}
          {cover && (
            <div className="absolute w-[calc(100%+64px)] h-[calc(100%+64px)] md:w-[calc(100%+128px)] md:h-[calc(100%+128px)] flex justify-center items-center">
              <Image
                src={cover}
                fill
                alt="Card Multi Cover"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardMulti
