import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import copy from "rollup-plugin-copy";

import { visualizer } from "rollup-plugin-visualizer";

import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    visualizer({
      emitFile: true,
    }) as PluginOption,
    Components({ resolvers: [AntDesignVueResolver()] }),
    copy({
      targets: [
        {
          src: "src/low-code-meta/model-page",
          dest: "public/low-code-meta",
        },
      ],
    }) as PluginOption,
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          formlogic: ["@formlogic/render-vue"],
          formily: ["@formily/core"],
          "ant-design-vue": ["ant-design-vue"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@/": `${fileURLToPath(new URL("./src", import.meta.url))}/`,
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  server: {
    proxy: {
      "/local-api": {
        target: `http://127.0.0.1:3200`,
        changeOrigin: true,
      },
    },
  },
});
