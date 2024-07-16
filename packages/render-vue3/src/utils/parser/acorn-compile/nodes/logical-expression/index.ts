import { AcornCompileUtils } from '@/utils/parser/acorn-compile/interface';
import { LogicalExpression } from 'acorn';

const logicalExpression = (node: LogicalExpression, utils: AcornCompileUtils) => {
  return utils.when(utils.evaluateArray([node.left, node.right]), function (nodes) {
    const [leftVariable, rightVariable] = nodes || [];

    switch (node.operator) {
      case '&&': {
        return leftVariable && rightVariable;
      }

      case '||': {
        return leftVariable || rightVariable;
      }

      default:
        throw new Error('Unexpected operator ' + node.operator);
    }
  });
};

export default logicalExpression;
