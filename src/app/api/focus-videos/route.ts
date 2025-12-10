import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

// Esta rota é gerada de forma estática no build (output: "export")
export const dynamic = "force-static";

// Rota para listar vídeos de foco disponíveis em /public/videos
export async function GET() {
  try {
    const videosDirectoryPath = path.join(process.cwd(), "public", "videos");

    const entries = await fs.readdir(videosDirectoryPath, {
      withFileTypes: true,
    });

    const files = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mp4"))
      .map((entry) => entry.name)
      .sort((firstFileName, secondFileName) => {
        // Ordena por número no nome do arquivo (ex: focus7.mp4 > focus3.mp4 > focus.mp4)
        const extractOrder = (fileName: string) => {
          const match = fileName.match(/^focus(\d*)\.mp4$/);

          if (!match || match[1] === "") {
            return 1;
          }

          return Number(match[1]);
        };

        return extractOrder(secondFileName) - extractOrder(firstFileName);
      });

    return NextResponse.json({ files });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Erro ao listar vídeos de foco", error);

    return NextResponse.json({ files: [] });
  }
}

