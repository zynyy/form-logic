import { ICustomEvent } from '@/utils';

import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';
export class AddWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
  type = 'add:workspace';
}
