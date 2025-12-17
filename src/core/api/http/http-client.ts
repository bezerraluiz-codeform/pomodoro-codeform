export type HttpClient = Readonly<{
  getJson: (path: string) => Promise<unknown>;
}>;

function createCorrelationId(): string {
  return globalThis.crypto.randomUUID();
}

function assertAbsolutePath(path: string): void {
  if (!path.startsWith("/")) {
    throw new Error('Path inválido. Use caminho absoluto iniciando com "/".');
  }
}

export function createHttpClient(baseUrl: string): HttpClient {
  const base = new URL(baseUrl);

  return {
    async getJson(path: string): Promise<unknown> {
      assertAbsolutePath(path);

      const url = new URL(path, base);
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-correlation-id": createCorrelationId(),
        },
      });

      if (!response.ok) {
        throw new Error(`Falha ao consultar ${path} (HTTP ${response.status})`);
      }

      return response.json() as Promise<unknown>;
    },
  };
}


