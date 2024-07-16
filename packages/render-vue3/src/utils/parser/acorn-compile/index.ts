import { AnyNode } from 'acorn';
import { AcornCompileUtils } from './interface';
import nodeEvaluators from './nodes';

const evaluateProgram = (ast: any) => {
  return evaluateNode(ast);
};

const isPromise = (val: any) => {
  return (
    !!val &&
    (typeof val === 'object' || typeof val === 'function') &&
    typeof val.then === 'function'
  );
};
const when = (value: any, gotValue: (...args: any[]) => any) => {
  if (isPromise(value)) {
    return value.then(gotValue);
  } else {
    return gotValue(value);
  }
};
const evaluateNode = (ast: AnyNode | undefined | null) => {
  return when('', function () {
    if (ast === undefined) {
      return undefined;
    }
    if (ast === null) {
      return undefined;
    }

    if (nodeEvaluators[ast.type]) {
      return nodeEvaluators[ast.type](ast, utils);
    }

    throw new Error('Unexpected token type ' + JSON.stringify(ast.type));
  });
};

const evaluateArray = (commands: any[]) => {
  let i = 0;
  let result: any[] = [];
  let done: any = false;
  function next() {
    let ready = true;
    while (i < commands.length && ready) {
      const value = evaluateNode(commands[i++]);
      if (isPromise(value)) {
        ready = false;
        value.done(function (value: any) {
          if (value && value.bubbles) {
            result = value;
            i = commands.length;
            return next();
          }
          result.push(value);
          next();
        });
      } else {
        if (value && value.bubbles) {
          result = value;
          i = commands.length;
          return next();
        }
        result.push(value);
      }
    }
    if (ready) {
      if (done === false) {
        done = true;
      } else {
        done?.(result);
      }
    }
  }
  next();
  if (done) {
    return result;
  } else {
    return new Promise(function (resolve) {
      done = resolve;
    });
  }
  return i === commands.length;
};

const utils: AcornCompileUtils = {
  evaluateNode: evaluateNode,
  evaluateArray: evaluateArray,
  isPromise: isPromise,
  when: when,
};

export default evaluateProgram;
