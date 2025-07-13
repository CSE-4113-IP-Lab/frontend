import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve("./src"),
      "@/components": resolve("./src/components"),
      "@/lib": resolve("./src/lib"),
      "@/utils": resolve("./src/lib/utils"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://8f786701c9bd.ngrok-free.app',
        changeOrigin: true,
        secure: true,
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }
    }
  }
});
