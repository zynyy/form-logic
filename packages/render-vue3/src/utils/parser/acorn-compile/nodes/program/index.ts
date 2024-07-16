import { AcornCompileUtils } from '@/utils/parser/acorn-compile/interface';
import { Program } from 'acorn';

const program = (node: Program, utils: AcornCompileUtils) => {
  return utils.evaluateArray(node.body);
};

export default program;
