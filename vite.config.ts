import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
    server: {
        port: 5173
    },
    plugins: [
        viteCompression(),
        viteStaticCopy({
            targets: [
                {
                    src: './node_modules/canvaskit-wasm/bin/canvaskit.wasm',
                    dest: 'bin',
                },
            ],
        }),
    ]
})