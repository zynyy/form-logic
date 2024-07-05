import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class UpdateChildrenEvent extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'update:children';
}
