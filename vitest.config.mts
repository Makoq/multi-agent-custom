import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});
export default defineConfig({
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src/*"),
    },
  },
  test: {
    include: ["**/*.test.ts"],
    testTimeout: 1000 * 60 * 50,
    globals: true,
    environment: "node", // 根据需要调整环境
    // ...
  },
});
