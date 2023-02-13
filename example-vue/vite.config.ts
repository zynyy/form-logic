import { fileURLToPath, URL } from "node:url";

import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { visualizer } from "rollup-plugin-visualizer";

import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    visualizer({
      emitFile: true,
    }) as PluginOption,
    Components({ resolvers: [AntDesignVueResolver()] }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "formlogic": ["@formlogic/render-vue"],
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
});
