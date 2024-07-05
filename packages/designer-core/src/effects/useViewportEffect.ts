import { ViewportResizeEvent, ViewportScrollEvent } from '@/events';
import { Engine } from '@/models';

export const useViewportEffect = (engine: Engine) => {
  engine.subscribeTo(ViewportResizeEvent, (event, context) => {
    const currentWorkspace = context?.workspace;
    if (!currentWorkspace) return;
    const viewport = currentWorkspace.viewport;
    const outline = currentWorkspace.outline;
    // @ts-ignore
    if (viewport.matchViewport(event.data.target)) {
      viewport.digestViewport();
    }
    // @ts-ignore
    if (outline.matchViewport(event.data.target)) {
      outline.digestViewport();
    }
  });
  engine.subscribeTo(ViewportScrollEvent, (event, context) => {
    const currentWorkspace = context?.workspace;
    if (!currentWorkspace) return;
    const viewport = currentWorkspace.viewport;
    const outline = currentWorkspace.outline;
    // @ts-ignore
    if (viewport.matchViewport(event.data.target)) {
      viewport.digestViewport();
    }
    // @ts-ignore
    if (outline.matchViewport(event.data.target)) {
      outline.digestViewport();
    }
  });
};
