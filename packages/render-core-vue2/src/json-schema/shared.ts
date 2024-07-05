import { ISchema } from '@formily/json-schema';
import { isNoNeedCompileObject, SchemaNestedMap } from '@formily/json-schema/esm/shared';
import { each, isFn, isPlainObj } from '@formily/shared';

export const traverse = (
  target: any,
  visitor: (value: any, path: Array<string | number>) => void,
) => {
  const seenObjects: object[] = [];
  const root = target;
  const traverse = (target: any, path: any[] = []) => {
    if (isPlainObj(target)) {
      const seenIndex = seenObjects.indexOf(target);
      if (seenIndex > -1) {
        return;
      }
      const addIndex = seenObjects.length;
      seenObjects.push(target);
      if (isNoNeedCompileObject(target) && root !== target) {
        visitor(target, path);
        return;
      }
      each(target, (value, key) => {
        traverse(value, path.concat(key));
      });
      seenObjects.splice(addIndex, 1);
    } else {
      visitor(target, path);
    }
  };
  traverse(target);
};

export const traverseSchema = (
  schema: ISchema,
  visitor: (value: any, path: any[], omitCompile?: boolean) => void,
) => {
  if (schema['x-validator'] !== undefined) {
    visitor(schema['x-validator'], ['x-validator'], true);
  }
  const seenObjects: object[] = [];
  const root = schema;
  const traverse = (target: any, path: string[] = []) => {
    if (
      path[0] === 'x-compile-omitted' ||
      path[0] === 'x-validator' ||
      path[0] === 'version' ||
      path[0] === '_isJSONSchemaObject' ||
      (String(path[0]).indexOf('x-') == -1 && isFn(target)) ||
      (SchemaNestedMap as Record<string, any>)[path[0]]
    ) {
      return;
    }

    if (
      Array.isArray(schema['x-compile-omitted']) &&
      schema['x-compile-omitted']?.indexOf(path[0]) > -1
    ) {
      visitor(target, path, true);
      return;
    }
    if (isPlainObj(target)) {
      if (path[0] === 'default' || path[0] === 'x-value') {
        visitor(target, path);
        return;
      }
      const seenIndex = seenObjects.indexOf(target);
      if (seenIndex > -1) {
        return;
      }
      const addIndex = seenObjects.length;
      seenObjects.push(target);
      if (isNoNeedCompileObject(target) && root !== target) {
        visitor(target, path);
        return;
      }
      each(target, (value, key) => {
        traverse(value, path.concat(key));
      });
      seenObjects.splice(addIndex, 1);
    } else {
      visitor(target, path);
    }
  };
  traverse(schema);
};
