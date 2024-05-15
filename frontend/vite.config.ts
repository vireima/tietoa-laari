import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.RAILWAY_BACKEND_PUBLIC_DOMAIN": JSON.stringify(
        env.RAILWAY_BACKEND_PUBLIC_DOMAIN
      ),
      "process.env.RAILWAY_BACKEND_PRIVATE_DOMAIN": JSON.stringify(
        env.RAILWAY_BACKEND_PRIVATE_DOMAIN
      ),
    },
    plugins: [react()],
  };
});
