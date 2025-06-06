import { WebSocketServer, WebSocket } from "ws";
import fetch, { RequestInit, Response } from 'node-fetch';
import { Region, EndpointStatus, WSMessage } from "./types";
import { POLL_INTERVAL_MS, FETCH_TIMEOUT_MS, REGIONS, MESSAGE_TYPES, ERROR_MESSAGES } from "./constants";

/**
 * Stores latest status of all regions
 */
let latestStatus: Record<Region, EndpointStatus> = {
  "us-east": { status: "unknown" },
  "eu-west": { status: "unknown" },
  "eu-central": { status: "unknown" },
  "us-west": { status: "unknown" },
  "sa-east": { status: "unknown" },
  "ap-southeast": { status: "unknown" }
}

/**
 * Check if a value is a plain object
 * @param value - The value to check
 * @returns True if the value is a plain object, false otherwise
 */
const isRecordStringUnknown = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Fetch the status of an endpoint
 * @param url - The URL to fetch the status from
 * @returns The status of the endpoint
 */
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
      return { status: "error", error: ERROR_MESSAGES.INVALID_RESPONSE }
    }
    return { status: "ok", data }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return { status: "timeout", error: ERROR_MESSAGES.TIMEOUT };
    }
    return { status: "error", error: (error as Error).message }
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Poll all endpoints for their status
 * @returns void
 */
async function pollAllEndpoints(): Promise<void> {
  const entries = await Promise.all(
    (Object.entries(REGIONS) as [Region, string][]).map(async ([region, url]) => {
      const status = await fetchStatus(url);
      return [region, status] as [Region, EndpointStatus]
    })
  )
  latestStatus = Object.fromEntries(entries) as Record<Region, EndpointStatus>;
}

/**
 * Start polling loop and broadcast to all clients
 * @param wss - The WebSocket server instance
 * @returns void
 */
async function startPolling(wss: WebSocketServer): Promise<void> {
  setInterval(async () => {
    await pollAllEndpoints();
    const message: WSMessage = {
      type: MESSAGE_TYPES.STATUS_UPDATE,
      payload: latestStatus
    };
    const data = JSON.stringify(message);
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  }, POLL_INTERVAL_MS);
}

/**
 * Start the WebSocket server
 * Listens for incoming connections and sends the latest status
 * @returns void
 */
function startServer(): void {
  const port = parseInt(process.env.PORT || "8080");
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

  const wss = new WebSocketServer({
    port, host
  });

  wss.on("connection", (ws: WebSocket) => {
    // Send the latest status immediately upon connection
    const message: WSMessage = {
      type: MESSAGE_TYPES.STATUS_UPDATE,
      payload: latestStatus
    }
    ws.send(JSON.stringify(message));
  })

  startPolling(wss);

  // eslint-disable-next-line no-console
  console.log(`WebSocket server started on ws://${host}:${port}`);
}

startServer();

export { isRecordStringUnknown, fetchStatus, pollAllEndpoints, startPolling, startServer };