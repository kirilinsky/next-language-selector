// Minimal ambient declaration so `process.env.NODE_ENV` typechecks without
// pulling in @types/node. Bundlers (Next.js, Vite, esbuild) replace the
// expression with a string literal, so the dev-only warnings are stripped
// from production builds.
declare const process:
  | { env: { NODE_ENV?: string; [key: string]: string | undefined } }
  | undefined;
