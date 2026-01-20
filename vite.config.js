import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration. Outputs build files to "dist" directory and uses React plugin.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});