import { AcornCompileUtils } from '@/utils/parser/acorn-compile/interface';
import { CallExpression } from 'acorn';

const callExpression = (node: CallExpression, utils: AcornCompileUtils) => {
  function gotCallee(self: any, callee: any) {
    return utils.when(utils.evaluateArray(node.arguments), function (args) {
      return callee.value(self, args);
    });
  }

  return utils.when(utils.evaluateNode(node.callee), function (callee) {
    return gotCallee(undefined, callee);
  });
};

export default callExpression;
