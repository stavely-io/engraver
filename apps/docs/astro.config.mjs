import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://stavely-io.github.io",
  base: "/engraver",
  integrations: [
    starlight({
      title: "Engraver",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/stavely-io/engraver" }],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "Introduction", slug: "index" },
        { label: "Getting started", items: [{ autogenerate: { directory: "getting-started" } }] },
        { label: "Demo", slug: "demo" },
      ],
    }),
    react(),
  ],
});
