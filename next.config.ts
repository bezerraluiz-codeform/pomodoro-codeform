import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Configurações para deploy estático no GitHub Pages
  output: "export",
  reactCompiler: true,
  basePath: isProduction ? "/pomodoro-codeform" : undefined,
  assetPrefix: isProduction ? "/pomodoro-codeform/" : undefined,
  images: {
    // Necessário para export estático, sem otimização de imagem no servidor
    unoptimized: true,
  },
};

export default nextConfig;

