import postcss from 'postcss';
import { transform } from 'esbuild';

export async function compileCss(source: string | Buffer) {
  const { css } = await postcss().process(source, {
    from: undefined,
  });
  const result = await transform(css, {
    loader: 'css',
    minify: true,
    target: ['chrome53', 'safari10'],
  });
  return result.code;
}
