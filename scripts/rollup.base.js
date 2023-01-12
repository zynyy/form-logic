import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import externalGlobals from 'rollup-plugin-external-globals';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';

import minimatch from 'minimatch';

const presets = () => {
  const externals = {
    antd: 'Antd',
    react: 'React',
    'react-is': 'ReactIs',
    'react-dom': 'ReactDOM',
    '@ant-design/icons': 'icons',
  };
  return [
    typescript({
      tsconfig: './tsconfig.umd.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: false,
        },
      },
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    externalGlobals(externals, {
      exclude: ['**/*.{css,less,sass,scss}'],
    }),
    json(),
    builtins(),
  ];
};

const createEnvPlugin = (env) => {
  return injectProcessEnv(
    {
      NODE_ENV: env,
    },
    {
      exclude: ['**/*.{css,less,sass,scss}'],
      verbose: false,
    },
  );
};

const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // 样式由 build:style 进行打包，所以要删除入口文件上的 `import './style'`
    return code
      .replace(new RegExp('import (\'|")./style(\'|");'), '')
      .replace(new RegExp('import (\'|")@/style(\'|");'), '')
      .replace(new RegExp('import (\'|")./style.css(\'|");'), '')
      .replace(new RegExp('import (\'|")./style/index.css(\'|");'), '');
  },
});

const externalPattern = ['react', 'react-dom', 'react-is', '**/*.{css,less,sass,scss}'];

export default (filename, targetName, ...plugins) => {
  return [
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.development.js`,
        name: targetName,
        sourcemap: true,
        amd: {
          id: filename,
        },
      },
      external: (id) => {
        if ([].includes(id)) {
          return true;
        }

        const matchHit = externalPattern.filter((pattern) => {
          return minimatch(id, pattern);
        });

        return !!matchHit.length;
      },
      plugins: [
        ...presets(),
        removeImportStyleFromInputFilePlugin(),
        ...plugins,
        createEnvPlugin('development'),
      ],
      moduleContext: (id) => {
        const thisAsWindowForModules = ['utils/global.js'];

        if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
          return 'window';
        }
      },
    },
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.production.js`,
        name: targetName,
        sourcemap: true,
        amd: {
          id: filename,
        },
      },
      external: (id) => {
        if ([].includes(id)) {
          return true;
        }

        const matchHit = externalPattern.filter((pattern) => {
          return minimatch(id, pattern);
        });

        return !!matchHit.length;
      },
      plugins: [
        ...presets(),
        terser(),
        removeImportStyleFromInputFilePlugin(),
        ...plugins,
        createEnvPlugin('production'),
      ],
      moduleContext: (id) => {
        const thisAsWindowForModules = ['utils/global.js'];

        if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
          return 'window';
        }
      },
    },
  ];
};
