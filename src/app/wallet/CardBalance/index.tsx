type Props = {
  handleCopy?: () => void
  label: string
  balance: string
}

const CardBalance = ({ handleCopy, label, balance }: Props) => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-2 bg-gray-800 rounded-[40px] h-[170px] dark:bg-black-600">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="text-4xl">{balance}</span>
    </div>
  )
}

export default CardBalance
