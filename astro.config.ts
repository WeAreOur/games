import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  root: "apps/web",
  outDir: "../../dist",
  publicDir: "../../public",
  integrations: [react()],
  output: "static",
  vite: {
    ssr: {
      noExternal: ["@core/*", "@games/*"]
    }
  }
});
