import { getNearFinalBlock } from "@src/api/transaction"
import { NearBlock, NearHeader } from "@src/types/interfaces"

export const useNearBlock = () => {
  const getNearBlock = async (): Promise<NearHeader> => {
    const { result } = (await getNearFinalBlock()) as NearBlock
    return {
      height: result.header.height,
      prev_height: result.header.prev_height,
      timestamp: result.header.timestamp,
    }
  }

  return {
    getNearBlock,
  }
}
