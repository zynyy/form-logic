import { compileTpl } from '@/utils';
import acornCompile from '@/utils/parser/acorn-compile';
import { parse } from 'acorn';

const whenParser = (when: string, record: Record<string, any>) => {
  if (!when) {
    return false;
  }

  const expression = compileTpl(when, record ?? {});

  const ast = parse(`${expression}`, {
    ecmaVersion: 'latest',
  });

  return acornCompile(ast)[0];
};

export default whenParser;
