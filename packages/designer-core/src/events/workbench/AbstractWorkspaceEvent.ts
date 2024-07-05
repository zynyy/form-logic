import { Workspace } from '@/models/Workspace';

export class AbstractWorkspaceEvent {
  data: Workspace;
  constructor(data: Workspace) {
    this.data = data;
  }
}
