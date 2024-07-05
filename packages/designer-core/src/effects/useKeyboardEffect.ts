import { KeyDownEvent, KeyUpEvent } from '@/events';
import { Engine } from '@/models';

export const useKeyboardEffect = (engine: Engine) => {
  engine.subscribeTo(KeyDownEvent, (event, context) => {
    const keyboard = engine.keyboard;
    if (!keyboard) return;
    const workspace = context?.workbench.currentWorkspace || engine.workbench.currentWorkspace;

    if (workspace) {
      keyboard.handleKeyboard(event, workspace.getEventContext());
    }
  });

  engine.subscribeTo(KeyUpEvent, (event, context) => {
    const keyboard = engine.keyboard;
    if (!keyboard) return;
    const workspace = context?.workbench.currentWorkspace || engine.workbench.currentWorkspace;

    if (workspace) {
      keyboard.handleKeyboard(event, workspace.getEventContext());
    }
  });
};
