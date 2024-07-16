import { Literal } from 'acorn';

const literal = (node: Literal) => {
  return node.value;
};

export default literal;
