import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { lazyPlugins } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
  plugins: lazyPlugins(() => [react()]),
  test: {
    passWithNoTests: true,
  },
  run: {
    tasks: {
      dev: {
        command: [
          "vp run --filter 'react-example^...' build",
          "vp run --filter 'react-example...' --parallel watch",
        ],
        cache: false,
      },
      watch: {
        command: "vp dev",
        cache: false,
      },
      check: {
        command: ["vp check", "stylelint 'src/**/*.css'"],
        dependsOn: [
          { task: "build", from: ["dependencies", "devDependencies", "peerDependencies"] },
        ],
      },
      test: {
        command: "vp test",
        dependsOn: [
          { task: "build", from: ["dependencies", "devDependencies", "peerDependencies"] },
        ],
      },
    },
  },
});
