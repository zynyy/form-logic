import { IGeneralFieldState } from '@formily/core';
import { ISchema } from '@formily/json-schema';
import { compile } from '@formily/json-schema/esm/compiler';
import { patchStateFormSchema } from '@formily/json-schema/esm/shared';
import { hasCollected } from '@formily/reactive';

import { traverseSchema } from './shared';

export const patchSchemaCompile = (
  targetState: IGeneralFieldState,
  sourceSchema: ISchema,
  scope: any,
  demand = false,
) => {
  traverseSchema(sourceSchema, (value: any, path: any, omitCompile?: boolean) => {
    let compiled = value;
    let collected = hasCollected(() => {
      if (!omitCompile) {
        compiled = compile(value, scope);
      }
    });
    if (compiled === undefined) return;
    if (demand) {
      if (collected || !targetState.initialized) {
        patchStateFormSchema(targetState, path, compiled);
      }
    } else {
      patchStateFormSchema(targetState, path, compiled);
    }
  });
};
