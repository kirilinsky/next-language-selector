// Fails the build when the "use client" directive is missing from the bundle.
// Without it, importing the component from a Server Component crashes.
import { readFileSync } from "node:fs";

for (const file of ["dist/index.mjs", "dist/index.cjs"]) {
  const head = readFileSync(file, "utf8").slice(0, 200);
  if (!head.startsWith('"use client"')) {
    console.error(`${file} does not start with "use client"`);
    process.exit(1);
  }
}
