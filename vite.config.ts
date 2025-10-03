import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), viteSingleFile()],
    base: "./",
    resolve: {
        alias: {
            "@": "/src",
            "@app": "/src/app",
            "@components": "/src/components",
            "@engine": "/src/engine",
            "@game": "/src/game",
        },
    },
    build: {},
});
