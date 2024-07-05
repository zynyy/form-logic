import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class UnSelectNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'unselect:node';
}
