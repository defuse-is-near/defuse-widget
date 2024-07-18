import { Button } from "@radix-ui/themes"
import { ArrowTopRightIcon } from "@radix-ui/react-icons"

const WidgetCardLink = () => {
  return (
    <Button
      variant="classic"
      color="gray"
      className="relative w-[32px] h-[32px] cursor-pointer"
    >
      <div className="absolute">
        <ArrowTopRightIcon width={16} height={16} />
      </div>
    </Button>
  )
}

export default WidgetCardLink
