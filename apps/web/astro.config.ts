import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  base: "/games",
  integrations: [react()],
  output: "static",
  vite: {
    base: "/games/",
    ssr: {
      noExternal: ["@weareour/*"]
    }
  }
});
