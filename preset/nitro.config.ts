import { dirname, resolve, relative } from "pathe";
// import { writeFile } from "nitro-custom/src/utils";
import { defineNitroPreset } from "nitropack";
import type { Nitro } from "nitropack";
import { fileURLToPath } from "url";
import fsp from "node:fs/promises";
import consola from "consola";
import chalk from "chalk";

export function hl(str: string) {
  return chalk.cyan(str);
}

function prettyPath(p: string, highlight = true) {
  p = relative(process.cwd(), p);
  return highlight ? hl(p) : p;
}

async function writeFile(
  file: string,
  contents: Buffer | string,
  log = false
) {
  await fsp.mkdir(dirname(file), { recursive: true });
  await fsp.writeFile(
    file,
    contents,
    typeof contents === "string" ? "utf8" : undefined
  );
  if (log) {
    consola.info("Generated", prettyPath(file));
  }
}

export default defineNitroPreset({
  extends: "base-worker",
  // entry: "#internal/nitro/entries/cloudflare-esm",
  entry: fileURLToPath(new URL('./entry.ts', import.meta.url)),
  // entry: (new URL("./entry.ts", import.meta.url)).href,
  // entry: "./entry.ts",
  commands: {
    preview: "npx wrangler dev ./server/index.mjs --site ./public --local",
    deploy: "npx wrangler publish",
  },
  rollupConfig: {
    external: "__STATIC_CONTENT_MANIFEST",
    output: {
      format: "esm",
      exports: "named",
    },
  },
  hooks: {
    async compiled(nitro: Nitro) {
      await writeFile(
        resolve(nitro.options.output.dir, "package.json"),
        JSON.stringify({ private: true, main: "./server/index.mjs" }, null, 2)
      );
      await writeFile(
        resolve(nitro.options.output.dir, "package-lock.json"),
        JSON.stringify({ lockfileVersion: 1 }, null, 2)
      );
    },
  },
});
