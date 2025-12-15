export type HealthResponse = Readonly<{
  status: "ok";
  timestamp: string;
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


