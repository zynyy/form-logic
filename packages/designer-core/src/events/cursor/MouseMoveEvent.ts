import { ICustomEvent } from '@/utils';

import { AbstractCursorEvent } from './AbstractCursorEvent';

export class MouseMoveEvent extends AbstractCursorEvent implements ICustomEvent {
  type = 'mouse:move';
}
