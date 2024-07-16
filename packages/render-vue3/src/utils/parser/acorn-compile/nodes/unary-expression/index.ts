import { AcornCompileUtils } from '@/utils/parser/acorn-compile/interface';
import { UnaryExpression } from 'acorn';

const unaryExpression = (node: UnaryExpression, utils: AcornCompileUtils) => {
  return utils.when(utils.evaluateNode(node.argument), function (argument) {
    switch (node.operator) {
      case '+': {
        const result = +argument;
        if (typeof result === 'number') {
          return Number(result);
        } else {
          throw new Error('Invalid types for + unary operator');
        }
      }

      case '!': {
        if (argument === undefined) {
          return utils.evaluateArray([node.argument]);
        }
        return !argument;
      }

      default: {
        throw new Error('Unexpected operator ' + node.operator);
      }
    }
  });
};

export default unaryExpression;
