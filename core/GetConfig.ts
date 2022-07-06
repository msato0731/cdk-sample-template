import { config as insConfig } from "../env/ins"
import { config as stgConfig } from "../env/stg"
import { config as prdConfig } from "../env/prd"

export function getConfig(envName: string) {
  if (envName === "ins") {
    return insConfig
  } else if (envName === "stg") {
    return stgConfig
  } else if (envName === "prd") {
    return prdConfig
    // jest テスト用
  } else if (process.env.TEST) {
    return insConfig
  } else {
    throw new Error("No Support Envionment")
  }
}
