import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/games" : "/",
  integrations: [react()],
  output: "static",
  vite: {
    base: process.env.NODE_ENV === "production" ? "/games" : "/",
    ssr: {
      noExternal: ["@weareour/*"]
    }
  }
});
