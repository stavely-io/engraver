import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      dev: {
        command: "astro dev",
        cache: false,
        dependsOn: [
          { task: "build", from: ["dependencies", "devDependencies", "peerDependencies"] },
        ],
      },
      build: {
        command: "astro build",
        dependsOn: [
          { task: "build", from: ["dependencies", "devDependencies", "peerDependencies"] },
        ],
      },
      check: {
        command: ["vp check", "astro check", "stylelint 'src/**/*.css'"],
        dependsOn: [
          { task: "build", from: ["dependencies", "devDependencies", "peerDependencies"] },
        ],
      },
    },
  },
});
