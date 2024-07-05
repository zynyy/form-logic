import { ICustomEvent } from '@/utils';

import { AbstractKeyboardEvent } from './AbstractKeyboardEvent';

export class KeyDownEvent extends AbstractKeyboardEvent implements ICustomEvent {
  type = 'key:down';
}
