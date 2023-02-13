import { join } from 'node:path';
import { setBuildTarget } from '../common';
import { CWD, DIST_DIR, ESM_DIR, LIB_DIR } from '../common/constant';
import type { InlineConfig } from 'vite';
import type { BundleOption } from '../compiler/compile-bundles';

const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // 样式由 build:style 进行打包，所以要删除入口文件上的 `import './style'`

    if (id.endsWith("/esm/index.js")) {
      return  code.replaceAll('import "./style"', "")

    }


    return code;
  },
});

export function getViteConfigForPackage({
  minify,
  formats,
  external = [],
}: BundleOption): InlineConfig {
  setBuildTarget('package');

  const name = 'formlogic';

  const entryExtension = '.js';
  const entry = join(ESM_DIR, `index${entryExtension}`);
  const shouldReplaceEnv = minify || formats?.includes('umd');

  return {
    root: CWD,

    logLevel: 'silent',

    define: shouldReplaceEnv
      ? {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }
      : undefined,

    build: {
      emptyOutDir: false,

      lib: {
        name,
        entry,
        formats,
        fileName: (format: string) => {
          const suffix = `.${format}`;
          return minify ? `${name}${suffix}.min.js` : `${name}${suffix}.js`;
        },
      },

      // terser has better compression than esbuild
      minify: minify ? 'terser' : false,
      rollupOptions: {
        external: [...external, 'vue'],
        output: {
          dir: DIST_DIR,
          globals: {
            vue: 'Vue',
          },

        },
        plugins: [removeImportStyleFromInputFilePlugin()],
      },
    },
  };
}
