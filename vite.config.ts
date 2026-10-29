import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // GitHub Pages publica este proyecto dentro de /Outfittario/, no en la raíz del dominio.
  base: "/Outfittario/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Outfitario · Armario digital",
        short_name: "Outfitario",
        description: "Tu armario digital privado, con outfits a tu estilo.",
        theme_color: "#f7f3ed",
        background_color: "#f7f3ed",
        display: "standalone",
        orientation: "portrait",
        start_url: "/Outfittario/",
        scope: "/Outfittario/",
        icons: [
          {
            src: "/Outfittario/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        navigateFallback: "/Outfittario/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2}"]
      }
    })
  ],
  server: { port: 5173 }
});
