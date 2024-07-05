import { CursorType, Shortcut } from '@/models';
import { KeyCode } from '@/utils';

export const CursorSwitchSelection = new Shortcut({
  codes: [KeyCode.Shift, KeyCode.S],
  handler(context) {
    const engine = context?.engine;
    if (engine) {
      engine.cursor.setType(CursorType.Selection);
    }
  },
});
