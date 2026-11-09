import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
  run: {
    tasks: {
      "install-browsers": {
        command: "playwright install chromium --only-shell ${CI:+--with-deps}",
        cache: false,
      },
      check: {
        command: "vp check",
      },
      test: {
        command: "vp test",
        dependsOn: ["install-browsers"],
      },
    },
  },
});
