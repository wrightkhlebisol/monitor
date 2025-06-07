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

export const REGIONS: Record<Region, string> = {
  "us-east": "https://data--us-east.upscope.io/status?stats=1",
  "eu-west": "https://data--eu-west.upscope.io/status?stats=1",
  "eu-central": "https://data--eu-central.upscope.io/status?stats=1",
  "us-west": "https://data--us-west.upscope.io/status?stats=1",
  "sa-east": "https://data--sa-east.upscope.io/status?stats=1",
  "ap-southeast": "https://data--ap-southeast.upscope.io/status?stats=1"
}
