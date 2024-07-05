import { ICustomEvent } from '@/utils';

import { AbstractCursorEvent } from './AbstractCursorEvent';

export class DragMoveEvent extends AbstractCursorEvent implements ICustomEvent {
  type = 'drag:move';
}
