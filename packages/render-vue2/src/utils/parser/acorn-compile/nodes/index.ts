import BinaryExpression from './binary-expression';
import CallExpression from './call-expression';
import ExpressionStatement from './expression-statement';
import Identifier from './identifier';
import LogicalExpression from './logical-expression';

import { AcornCompileNode } from '@/utils/parser/acorn-compile/interface';
import ConditionalExpression from './conditional-expression';
import Literal from './literal';
import Program from './program';
import UnaryExpression from './unary-expression';
export default {
  LogicalExpression,
  ExpressionStatement,
  CallExpression,
  BinaryExpression,
  Program,
  Identifier,
  Literal,
  UnaryExpression,
  ConditionalExpression,
} as Record<string, AcornCompileNode>;
