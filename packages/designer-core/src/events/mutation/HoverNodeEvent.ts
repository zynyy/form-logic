import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class HoverNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'hover:node';
}
