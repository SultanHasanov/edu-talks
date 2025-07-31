// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/login": {
        target: "http://85.143.175.100:8080",
        changeOrigin: true,
        secure: false,
      },
      "/logout": {
        target: "http://85.143.175.100:8080",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://85.143.175.100:8080",
        changeOrigin: true,
        secure: false,
      },
      "/news": {
        target: "http://85.143.175.100:8080",
        changeOrigin: true,
        secure: false,
      },
      "/register": {
        target: "http://85.143.175.100:8080",
        changeOrigin: true,
        secure: false,
      },
      "/resend-verification": {
        target: "http://85.143.175.100:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
