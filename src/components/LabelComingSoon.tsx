import clsx from "clsx"

type Props = {
  className?: string
}
const LabelComingSoon = ({ className }: Props) => {
  return (
    <span
      className={clsx(
        "absolute -top-2 -right-3 text-[8px] text-nowrap text-primary",
        className && className
      )}
    >
      Coming Soon
    </span>
  )
}

export default LabelComingSoon
