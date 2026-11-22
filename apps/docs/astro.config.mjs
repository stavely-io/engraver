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
      customCss: ["./src/styles/studio.css", "./src/styles/riso.css"],
      expressiveCode: {
        themes: ["github-dark-default", "github-light-default"],
        styleOverrides: {
          borderRadius: "10px",
          borderColor: "var(--sl-color-gray-5)",
          codeBackground: "var(--sl-color-gray-6)",
          frames: {
            shadowColor: "transparent",
            terminalTitlebarDotsOpacity: "0",
            terminalBackground: "var(--sl-color-gray-6)",
            terminalTitlebarBackground: "var(--sl-color-gray-6)",
            terminalTitlebarBorderBottomColor: "var(--sl-color-gray-5)",
            editorTabBarBackground: "var(--sl-color-black)",
            editorActiveTabBackground: "var(--sl-color-gray-6)",
            editorActiveTabIndicatorTopColor: "var(--sl-color-accent)",
            editorTabBorderRadius: "10px",
          },
        },
      },
      sidebar: [
        { label: "Introduction", slug: "introduction" },
        { label: "Getting started", items: [{ autogenerate: { directory: "getting-started" } }] },
        { label: "Demo", slug: "demo" },
      ],
    }),
    react(),
  ],
});
