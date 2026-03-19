import { defineConfig } from "astro/config";

/**
 * GitHub Pages:
 * - User/organization site (repo name: <username>.github.io): keep base as "/" (default).
 * - Project site: set base to "/<repository-name>/" (leading/trailing slashes optional; Astro normalizes).
 *
 * Replace `site` with your real URL before going live.
 */
export default defineConfig({
  site: "https://YOUR_USERNAME.github.io",
  // base: "/YOUR_REPO_NAME/",
  output: "static",
  compressHTML: true,
});
