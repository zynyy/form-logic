import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class RemoveNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'remove:node';
}
