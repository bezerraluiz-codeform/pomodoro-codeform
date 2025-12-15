import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const TEMPLATE_RELATIVE_PATH = "public/env.template.js";
const OUTPUT_RELATIVE_PATH = "public/env.js";

type RequiredEnvKey = "API_URL" | "ENV_NAME" | "DEBUG";

function getRequiredEnvValue(key: RequiredEnvKey): string {
  const value = process.env[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `[runtime-env] Variável obrigatória ausente: ${key}. Declare no docker-compose da plataforma.`,
    );
  }

  return value.trim();
}

function parseStrictBoolean(value: string, key: RequiredEnvKey): boolean {
  if (value === "true") return true;
  if (value === "false") return false;

  throw new Error(
    `[runtime-env] Variável ${key} inválida. Use "true" ou "false". Valor recebido: "${value}"`,
  );
}

function assertValidUrl(value: string, key: RequiredEnvKey): void {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported_protocol");
    }
  } catch {
    throw new Error(
      `[runtime-env] Variável ${key} inválida. Informe uma URL http/https válida. Valor recebido: "${value}"`,
    );
  }
}

function escapeForJsStringLiteral(value: string): string {
  const jsonString = JSON.stringify(value);
  return jsonString.slice(1, jsonString.length - 1);
}

async function generateRuntimeEnvFile(): Promise<void> {
  const templatePath = resolve(process.cwd(), TEMPLATE_RELATIVE_PATH);
  const outputPath = resolve(process.cwd(), OUTPUT_RELATIVE_PATH);

  const apiUrl = getRequiredEnvValue("API_URL");
  assertValidUrl(apiUrl, "API_URL");

  const envName = getRequiredEnvValue("ENV_NAME");
  const debug = parseStrictBoolean(getRequiredEnvValue("DEBUG"), "DEBUG");

  let template = await readFile(templatePath, "utf8");

  const debugString = debug ? "true" : "false";

  const replacements: ReadonlyArray<readonly [string, string]> = [
    ["__API_URL__", escapeForJsStringLiteral(apiUrl)],
    ["__ENV_NAME__", escapeForJsStringLiteral(envName)],
    ["__DEBUG__", escapeForJsStringLiteral(debugString)],
  ];

  for (const [token, replacement] of replacements) {
    if (!template.includes(token)) {
      throw new Error(
        `[runtime-env] Token ${token} não encontrado em ${TEMPLATE_RELATIVE_PATH}.`,
      );
    }

    template = template.replaceAll(token, replacement);
  }

  await writeFile(outputPath, `${template.trim()}\n`, "utf8");

  // Log técnico em português (padronização CodeForm).
  // eslint-disable-next-line no-console
  console.log(`[runtime-env] Gerado: ${OUTPUT_RELATIVE_PATH}`);
}

generateRuntimeEnvFile().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Erro desconhecido";
  // eslint-disable-next-line no-console
  console.error(`[runtime-env] Falha ao gerar env.js: ${message}`);
  process.exit(1);
});


