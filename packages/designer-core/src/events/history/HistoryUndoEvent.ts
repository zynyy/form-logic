import { ICustomEvent } from '@/utils';

import { AbstractHistoryEvent } from './AbstractHistoryEvent';

export class HistoryRedoEvent extends AbstractHistoryEvent implements ICustomEvent {
  type = 'history:redo';
}
