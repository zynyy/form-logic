import scrollIntoView, { StandardBehaviorOptions } from 'scroll-into-view-if-needed';

export const scrollToField = (selector: string, options?: StandardBehaviorOptions) => {
  requestIdleCallback(
    () => {
      const node: HTMLElement | null = selector ? document.querySelector(selector) : null;

      if (node) {
        scrollIntoView(node, {
          behavior: 'smooth',
          block: 'nearest',
          scrollMode: 'if-needed',
          ...options,
        });
      }
    },
    { timeout: 1000 },
  );
};
