import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class SelectNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'user:select:node';
}
