import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class AppendNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'append:node';
}
