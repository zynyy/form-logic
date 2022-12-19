import scrollIntoView, { StandardBehaviorOptions } from 'scroll-into-view-if-needed';

const scrollToField = (selector: string, options?: StandardBehaviorOptions) => {
  const node: HTMLElement | null = selector ? document.querySelector(selector) : null;

  if (node) {
    scrollIntoView(node, {
      behavior: 'smooth',
      block: 'nearest',
      scrollMode: 'if-needed',
      ...options,
    });
  }
};

export default scrollToField;
