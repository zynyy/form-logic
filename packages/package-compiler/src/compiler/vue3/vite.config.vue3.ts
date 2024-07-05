import { join } from 'node:path';
import { CWD, ES_DIR, getConfig, ROOT_DIST_DIR } from '@/utils';
import type { InlineConfig } from 'vite';
import type { BundleOption } from '../vue2/compile-bundles-vue2';

import vue from '@vitejs/plugin-vue';

import consola from 'consola';

export function getViteConfigForPackage({
  minify,
  formats,
  external = [],
}: BundleOption): InlineConfig {
  const { name } = getConfig();

  const entryExtension = '.js';
  const entry = join(ES_DIR, `index${entryExtension}`);
  const shouldReplaceEnv = minify || formats?.includes('umd');

  if (!name) {
    consola.error(`请在formlogic.config.mjs文件中配置name`);
  }

  return {
    root: CWD,

    logLevel: 'silent',
    plugins: [vue()],
    resolve: {
      alias: [
        {
          find: /^~(.*)$/,
          replacement: '$1',
        },
      ],
      extensions: ['.mjs', '.cjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.node', '.vue'],
    },

    define: shouldReplaceEnv
      ? {
          'process.env.NODE_ENV': 'production',
        }
      : undefined,

    build: {
      emptyOutDir: false,
      lib: {
        name,
        entry,
        formats,
        fileName: (format: string) => {
          const suffix = format === 'umd' ? '' : `.${format}`;
          return minify
            ? `${name}${suffix === 'es' ? 'esm' : suffix}.min.js`
            : `${name}${suffix}.js`;
        },
      },
      // terser has better compression than esbuild
      minify: minify ? 'terser' : false,
      rollupOptions: {
        external: [...external, 'vue'],
        output: {
          dir: ROOT_DIST_DIR,
          exports: 'named',
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  };
}
