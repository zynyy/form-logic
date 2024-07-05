import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InsertAfterEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'insert:after';
}
