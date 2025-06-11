import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": "/src",
            "@app": "/src/app",
            "@components": "/src/components",
            "@engine": "/src/engine",
            "@game": "/src/game",
        },
    },
});
