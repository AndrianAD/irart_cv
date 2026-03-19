import { defineConfig } from "astro/config";

/**
 * GitHub Pages — project repo: site = user pages host, base = repo path segment.
 */
export default defineConfig({
  site: "https://andrianad.github.io",
  base: "/irart_cv/",
  output: "static",
  compressHTML: true,
});
