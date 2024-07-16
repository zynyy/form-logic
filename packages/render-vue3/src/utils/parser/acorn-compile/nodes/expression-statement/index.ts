import { AcornCompileUtils } from '@/utils/parser/acorn-compile/interface';
import { ExpressionStatement } from 'acorn';

const expressionStatement = (node: ExpressionStatement, utils: AcornCompileUtils) => {
  return utils.evaluateNode(node.expression);
};

export default expressionStatement;
