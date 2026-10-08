import { cp, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const destination = new URL("../dist/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const file of [
  "index.html",
  "src",
  "sw.js",
  "manifest.webmanifest",
  "icon.svg",
  "research/technical-report.md",
  "research/technical-report.pdf",
  "research/figures",
]) {
  await cp(new URL("../" + file, import.meta.url), new URL(file, destination), {
    recursive: true,
  });
}
await writeFile(new URL(".nojekyll", destination), "");
console.log("Static deployment prepared in " + root + "dist");
