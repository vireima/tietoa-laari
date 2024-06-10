import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.API_URL": JSON.stringify(env.API_URL),
      "process.env.RAILWAY_PUBLIC_DOMAIN": JSON.stringify(
        env.RAILWAY_PUBLIC_DOMAIN
      ),
    },
    plugins: [react()],
  };
});
