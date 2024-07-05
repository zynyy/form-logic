import { ICustomEvent } from '@/utils';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class SwitchVersion extends AbstractMutationNodeEvent implements ICustomEvent {
  type = 'switch:version';
}
