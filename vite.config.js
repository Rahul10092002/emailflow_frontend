import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        (await import("@tailwindcss/postcss")).default({
          config: "./tailwind.config.js",
        }),
        (await import("autoprefixer")).default,
      ],
    },
  },
});
