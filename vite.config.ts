import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // 개발 중에도 동작하도록
      },
      workbox: {
        runtimeCaching: [
          /* ...타일 서버 캐시 등 */
        ],
      },
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "NOTAM Map",
        short_name: "NOTAM Map",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#707070",
        icons: [
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
