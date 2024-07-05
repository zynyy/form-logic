import less from 'less';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { CWD } from '@/utils';

export async function compileLess(filePath: string) {
  const source = readFileSync(filePath, 'utf-8');
  const { css } = await less.render(source, {
    filename: filePath,
    javascriptEnabled: true,
    paths: [join(CWD, 'node_modules')],
  });

  return css;
}
