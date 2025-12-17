import { createHttpClient } from "@/core/api/http/http-client";

export type HealthResponse = Readonly<{
  status: "ok";
  timestamp: string;
}>;

export type HealthClock = Readonly<{
  serverTimestamp: number;
  serverIsoTimestamp: string;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseHealthResponse(value: unknown): HealthResponse {
  if (!isRecord(value)) {
    throw new Error("Resposta inválida do /health");
  }

  const status = value.status;
  const timestamp = value.timestamp;

  if (status !== "ok") {
    throw new Error("Resposta inválida do /health");
  }

  if (typeof timestamp !== "string" || timestamp.trim().length === 0) {
    throw new Error("Resposta inválida do /health");
  }

  return {
    status,
    timestamp: timestamp.trim(),
  };
}

export function toHealthClock(health: HealthResponse): HealthClock {
  const date = new Date(health.timestamp);
  const time = date.getTime();

  if (Number.isNaN(time)) {
    throw new Error("Timestamp inválido do /health");
  }

  return {
    serverTimestamp: time,
    serverIsoTimestamp: health.timestamp,
  };
}

export async function fetchHealth(apiUrl: string): Promise<HealthResponse> {
  const client = createHttpClient(apiUrl);
  const payload = await client.getJson("/health");
  return parseHealthResponse(payload);
}


