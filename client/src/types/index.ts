export type Region = "us-east" | "eu-west" | "eu-central" | "us-west" | "sa-east" | "ap-southeast";


export interface EndpointStatus {
  status: "ok" | "error" | "timeout" | "unknown";
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Type for the status map received from the server.
 */
export type StatusMap = Record<Region, EndpointStatus>;

/**
 * Type for the expected response data from the endpoint.
 */
export interface RegionResponse {
  status: string;
  region: string;
  roles: string[];
  results: {
    services: {
      database: boolean;
      redis: boolean;
    };
    stats: {
      servers_count: number;
      online: number;
      session: number;
      server: {
        cpus: number;
        active_connections: number;
        wait_time: number;
        workers: [string, WorkerStats][];
        cpu_load: number;
        timers: number;
      };
    };
  };
  strict: boolean;
  server_issue: string | null;
  version: string;
}

export interface WorkerStats {
  wait_time: number;
  workers: number;
  waiting: number;
  idle: number;
  time_to_return: number;
  recently_blocked_keys: [string, number, string][];
  top_keys: [string, number][];
}

export interface WSMessage {
  type: "status_update";
  payload: StatusMap;
}