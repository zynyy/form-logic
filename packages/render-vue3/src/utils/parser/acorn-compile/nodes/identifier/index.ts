import { Identifier } from 'acorn';

const identifier = (node: Identifier) => {
  return node.name;
};
export default identifier;
