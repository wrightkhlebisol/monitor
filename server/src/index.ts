import { WebSocketServer, WebSocket } from "ws";
import fetch, { RequestInit, Response } from 'node-fetch';
import { Region, EndpointStatus } from "./types";
import { POLL_INTERVAL, FETCH_TIMEOUT_MS } from "./constants";

const REGIONS: Record<Region, string> = {
  "us-east": "https://data--us-east.upscope.io/status?stats=1",
  "eu-west": "https://data--eu-west.upscope.io/status?stats=1",
  "eu-central": "https://data--eu-central.upscope.io/status?stats=1",
  "us-west": "https://data--us-west.upscope.io/status?stats=1",
  "sa-east": "https://data--sa-east.upscope.io/status?stats=1",
  "ap-southeast": "https://data--ap-southeast.upscope.io/status?stats=1"
}


let latestStatus: Record<Region, EndpointStatus> = {
  "us-east": { status: "unknown" },
  "eu-west": { status: "unknown" },
  "eu-central": { status: "unknown" },
  "us-west": { status: "unknown" },
  "sa-east": { status: "unknown" },
  "ap-southeast": { status: "unknown" }
}

const isRecordStringUnknown = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function fetchStatus(url: string): Promise<EndpointStatus> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response: Response = await fetch(url, { signal: controller.signal } as RequestInit);
    if (!response.ok) {
      return { status: "error", error: `HTTP ${response.status}` }
    }
    const data = await response.json();
    if (!isRecordStringUnknown(data)) {
      return { status: "error", error: "Invalid response format" }
    }
    return { status: "ok", data }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return { status: "timeout", error: "Request timed out" };
    }
    return { status: "error", error: (error as Error).message }
  } finally {
    clearTimeout(timeout);
  }
}

function startServer(): void {

}

export { fetchStatus, isRecordStringUnknown }