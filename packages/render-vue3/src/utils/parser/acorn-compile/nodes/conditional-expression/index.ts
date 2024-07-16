import { AcornCompileUtils } from '@/utils/parser/acorn-compile/interface';
import { ConditionalExpression } from 'acorn';

const conditionalExpression = (node: ConditionalExpression, utils: AcornCompileUtils) => {
  return utils.when(utils.evaluateNode(node.test), (val) => {
    return val ? utils.evaluateNode(node.consequent) : utils.evaluateNode(node.alternate);
  });
};

export default conditionalExpression;
