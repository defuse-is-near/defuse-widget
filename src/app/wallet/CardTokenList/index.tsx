import { EmptyTokenBalance } from "@src/app/wallet/page"
import CardToken from "@src/app/wallet/CardToken"
import { NetworkTokenWithSwapRoute } from "@src/types/interfaces"

type Props = {
  list: NetworkTokenWithSwapRoute[] | EmptyTokenBalance[]
}
const CardTokenList = ({ list }: Props) => {
  return (
    <div className="flex flex-col gap-2.5">
      {list.map((tokenProps, i) => (
        <CardToken key={i} {...tokenProps} />
      ))}
    </div>
  )
}

export default CardTokenList
