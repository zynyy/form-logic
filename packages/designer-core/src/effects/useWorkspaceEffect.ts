import { SelectNodeEvent } from '@/events';
import { IEngineContext } from '@/interface';
import { Engine } from '@/models';
import { ICustomEvent } from '@/utils';

export const useWorkspaceEffect = (engine: Engine) => {
  engine.subscribeWith<ICustomEvent<any, IEngineContext>>(
    [
      'append:node',
      'insert:after',
      'insert:before',
      'insert:children',
      'drag:node',
      'drop:node',
      'prepend:node',
      'remove:node',
      'select:node',
      'update:children',
      'wrap:node',
      'update:node:props',
    ],
    (event, context) => {
      if (context?.workbench) {
        engine.workbench.setActiveWorkspace(context.workspace);
      }
    },
  );
  engine.subscribeTo(SelectNodeEvent, (event, context) => {
    engine.workbench.eachWorkspace((workspace) => {
      if (workspace !== context?.workspace) {
        workspace.operation.selection.clear();
      }
    });
  });
};
