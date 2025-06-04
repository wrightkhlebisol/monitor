// types.ts
export type Region = "us-east" | "eu-west" | "eu-central" | "us-west" | "sa-east" | "ap-southeast";

export interface EndpointStatus {
  status: "ok" | "error" | "timeout" | "unknown";
  error?: string;
  data?: Record<string, unknown>;
}

export interface WSMessage {
  type: "status_update";
  payload: Record<Region, EndpointStatus>
}