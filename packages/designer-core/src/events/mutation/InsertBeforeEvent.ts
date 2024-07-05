import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InsertBeforeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'insert:before';
}
