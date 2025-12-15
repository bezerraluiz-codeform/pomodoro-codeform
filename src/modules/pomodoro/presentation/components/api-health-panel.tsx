"use client";

import { useCallback, useEffect, useState } from "react";
import { getAppEnv } from "@/core/config/env";
import { parseHealthResponse, type HealthResponse } from "@/core/api/health";

type HealthPanelState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "success"; health: HealthResponse }>
  | Readonly<{ status: "error"; message: string }>;

async function fetchHealth(apiUrl: string): Promise<HealthResponse> {
  const url = new URL("/health", apiUrl);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar /health (HTTP ${response.status})`);
  }

  const payload: unknown = await response.json();
  return parseHealthResponse(payload);
}

export function ApiHealthPanel(): React.ReactNode {
  const env = getAppEnv();

  const [state, setState] = useState<HealthPanelState>({ status: "idle" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const health = await fetchHealth(env.API_URL);
      setState({ status: "success", health });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Falha desconhecida ao consultar /health";
      setState({ status: "error", message });
    }
  }, [env.API_URL]);

  useEffect(() => {
    if (!env.DEBUG) {
      return;
    }

    void load();
  }, [env.DEBUG, load]);

  if (!env.DEBUG) {
    return null;
  }

  return (
    <section
      aria-label="Painel de diagnóstico da API (DEBUG)"
      className="mt-6 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-slate-400">
            DEBUG · Runtime API
          </p>
          <p className="mt-1 break-all">
            <span className="text-slate-400">API_URL:</span> {env.API_URL}
          </p>
          <p className="mt-1">
            <span className="text-slate-400">ENV_NAME:</span> {env.ENV_NAME}
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="shrink-0 rounded-full border border-slate-700 bg-transparent px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050815]"
        >
          Refresh
        </button>
      </div>

      <div className="mt-3 border-t border-slate-800 pt-3">
        {state.status === "idle" && (
          <p className="text-slate-400">Aguardando…</p>
        )}
        {state.status === "loading" && (
          <p className="text-slate-400">Consultando /health…</p>
        )}
        {state.status === "success" && (
          <p>
            <span className="text-slate-400">/health:</span>{" "}
            <span className="font-semibold text-emerald-300">ok</span>{" "}
            <span className="text-slate-400">· timestamp:</span>{" "}
            <span className="font-medium">{state.health.timestamp}</span>
          </p>
        )}
        {state.status === "error" && (
          <p className="text-rose-300">
            <span className="text-slate-400">/health:</span> {state.message}
          </p>
        )}
      </div>
    </section>
  );
}


