"use client";

import { getAppEnv } from "@/core/config/env";

export function RuntimeEnvValidator(): null {
  // Falha rápido se env.js não foi carregado ou se variáveis obrigatórias estão ausentes.
  getAppEnv();

  return null;
}


