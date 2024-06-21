export const useTimeFormatMinutes = () => {
  const formatTwoNumbers = (minutes: number): string => {
    return minutes < 10 ? `0${minutes}` : minutes.toString()
  }

  return {
    formatTwoNumbers,
  }
}
