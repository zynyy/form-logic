import { AcornCompileUtils } from '@/utils/parser/acorn-compile/interface';
import type { BinaryExpression } from 'acorn';

const binaryExpression = (node: BinaryExpression, utils: AcornCompileUtils) => {
  return utils.when(utils.evaluateArray([node.left, node.right]), function (nodes) {
    const [leftVariable, rightVariable] = nodes || [];

    switch (node.operator) {
      case '+': {
        const result = leftVariable + rightVariable;
        if (typeof result === 'number') {
          return Number(result);
        } else if (typeof result === 'string') {
          return String(result);
        } else {
          throw new Error('Invalid types for addition');
        }
      }

      case '===': {
        return leftVariable === rightVariable;
      }

      case '!==': {
        return leftVariable !== rightVariable;
      }

      case '>': {
        return leftVariable > rightVariable;
      }

      case '>=': {
        return leftVariable >= rightVariable;
      }
      case '<': {
        return leftVariable < rightVariable;
      }
      case '<=': {
        return leftVariable <= rightVariable;
      }

      case '%': {
        return Number(leftVariable % rightVariable);
      }

      default: {
        throw new Error('Unexpected operator ' + node.operator);
      }
    }
  });
};

export default binaryExpression;
