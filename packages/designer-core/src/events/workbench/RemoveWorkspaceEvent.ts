import { ICustomEvent } from '@/utils';

import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';

export class RemoveWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
  type = 'remove:workspace';
}
