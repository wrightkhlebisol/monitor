import type { Region } from "../types"

export const POLL_INTERVAL_MS = 10000
export const FETCH_TIMEOUT_MS = 5000
export const RECONNECT_BASE_DELAY_MS = 1000; //Initial reconnect delay
export const RECONNECT_MAX_DELAY_MS = 10000; // Max reconnect delay

export const MESSAGE_TYPES = Object.freeze({
  STATUS_UPDATE: "status_update"
})
export const ERROR_MESSAGES = Object.freeze({
  INVALID_RESPONSE: "Invalid response format",
  TIMEOUT: "Request timed out"
})

export const REGIONS: Region[] = [
  "us-east",
  "eu-west",
  "eu-central",
  "us-west",
  "sa-east",
  "ap-southeast",
]
