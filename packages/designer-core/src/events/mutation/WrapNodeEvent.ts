import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class WrapNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'wrap:node';
}
