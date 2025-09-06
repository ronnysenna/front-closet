// biome-ignore assist/source/organizeImports: <explanation>
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do arquivo .env
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      open: true,
      cors: true,
    },
    define: {
      // Disponibiliza variáveis de ambiente para o cliente
      "import.meta.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:3000/api"
      ),
      "import.meta.env.VITE_ASSETS_URL": JSON.stringify(
        env.VITE_ASSETS_URL || "http://localhost:3000"
      ),
    },
  };
});
