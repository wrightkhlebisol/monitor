import { WebSocketServer, WebSocket } from "ws";
import fetch, { RequestInit, Response } from 'node-fetch';
import { Region, EndpointStatus } from '../../shared/src/index';
import { POLL_INTERVAL, FETCH_TIMEOUT_MS } from './constants';

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