import { ICustomEvent } from '@/utils';

import { AbstractViewportEvent } from './AbstractViewportEvent';

export class ViewportResizeEvent extends AbstractViewportEvent implements ICustomEvent {
  type = 'viewport:resize';
}
