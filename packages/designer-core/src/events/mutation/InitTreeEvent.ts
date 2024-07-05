import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InitTreeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'init:tree';
}
