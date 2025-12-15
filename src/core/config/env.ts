export type AppEnv = Readonly<{
  API_URL: string;
  ENV_NAME: string;
  DEBUG: boolean;
}>;

type RequiredKey = keyof AppEnv;

function getRequiredString(
  source: Record<string, unknown>,
  key: RequiredKey,
): string {
  const value = source[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Variável obrigatória ausente: ${key}`);
  }

  return value.trim();
}

function parseRequiredBoolean(
  source: Record<string, unknown>,
  key: RequiredKey,
): boolean {
  const value = source[key];

  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  throw new Error(`Variável obrigatória inválida: ${key}`);
}

function assertValidHttpUrl(value: string, key: RequiredKey): void {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported_protocol");
    }
  } catch {
    throw new Error(`Variável obrigatória inválida: ${key}`);
  }
}

function readClientEnv(): AppEnv {
  const env = window.__APP_ENV__;

  if (env === undefined) {
    throw new Error(
      "Configuração de runtime ausente. Verifique se /env.js foi carregado antes da hidratação.",
    );
  }

  const apiUrl = getRequiredString(env, "API_URL");
  assertValidHttpUrl(apiUrl, "API_URL");

  return {
    API_URL: apiUrl,
    ENV_NAME: getRequiredString(env, "ENV_NAME"),
    DEBUG: parseRequiredBoolean(env, "DEBUG"),
  };
}

function getRequiredServerEnvValue(key: RequiredKey): string {
  const value = process.env[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Variável obrigatória ausente: ${key}`);
  }

  return value.trim();
}

function readServerEnv(): AppEnv {
  const apiUrl = getRequiredServerEnvValue("API_URL");
  assertValidHttpUrl(apiUrl, "API_URL");

  const debugRaw = getRequiredServerEnvValue("DEBUG");
  if (debugRaw !== "true" && debugRaw !== "false") {
    throw new Error('Variável obrigatória inválida: DEBUG (use "true" ou "false")');
  }

  return {
    API_URL: apiUrl,
    ENV_NAME: getRequiredServerEnvValue("ENV_NAME"),
    DEBUG: debugRaw === "true",
  };
}

export function getAppEnv(): AppEnv {
  if (typeof window === "undefined") {
    return readServerEnv();
  }

  return readClientEnv();
}


