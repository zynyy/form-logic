import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class PrependNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'prepend:node';
}
