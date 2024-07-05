import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class DropNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'drop:node';
}
