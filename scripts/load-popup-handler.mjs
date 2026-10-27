/**
 * Compile api/popup.ts without bundling (esbuild, same shape Vercel emits)
 * so Node can import the .js extension the handler uses.
 */
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function loadPopupHandler() {
  const esbuild = await import("esbuild");
  const dir = await mkdtemp(path.join(tmpdir(), "ffla-popup-"));
  await esbuild.build({
    entryPoints: [
      path.join(root, "api/popup.ts"),
      path.join(root, "popup-kit/server/subscribe-core.ts"),
    ],
    outdir: dir,
    outbase: root,
    format: "esm",
    platform: "node",
    bundle: false,
  });
  const href = pathToFileURL(path.join(dir, "api", "popup.js")).href;
  const mod = await import(href);
  return {
    GET: mod.GET,
    POST: mod.POST,
    cleanup: () => rm(dir, { recursive: true, force: true }),
  };
}
