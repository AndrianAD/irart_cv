import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

/**
 * GitHub Pages — project repo: site = user pages host, base = repo path segment.
 */
export default defineConfig({
  site: "https://irart.pp.ua",
  base: "/",
  output: "static",
  compressHTML: true,
  integrations: [mdx()],
});
