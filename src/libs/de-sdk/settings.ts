import { Settings } from "@src/libs/de-sdk/types/interfaces"

let settings: Settings = {
  providerIds: [],
}

export const getSettings = (): Settings => settings

export const setSettings = (newSettings: Partial<Settings>) => {
  settings = { ...settings, ...newSettings }
}
