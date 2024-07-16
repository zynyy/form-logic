import { toHaveNoViolations } from 'jest-axe';

import format, { plugins } from 'pretty-format';

import beautify from 'pretty';

function formatHTML(nodes: any) {
  const htmlContent = format(nodes, {
    plugins: [plugins.DOMCollection, plugins.DOMElement],
  });

  const filtered = htmlContent
    .split(/[\n\r]+/)
    .filter((line) => line.trim())
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/form-id-[a-zA-Z0-9]*/, 'form-id-snapshot');

  return beautify(filtered, { indent_size: 2, ocd: true });
}

expect.addSnapshotSerializer({
  test: (node) => {
    if (typeof node === 'string') {
      return node.includes('form-id-');
    }
    return false;
  },
  print: (html) => {
    if (typeof html === 'string') {
      return html.replace(/form-id-[a-zA-Z0-9]*/, 'form-id-snapshot');
    }

    return '';
  },
});

expect.addSnapshotSerializer({
  test: (element) =>
    typeof HTMLElement !== 'undefined' &&
    (element instanceof HTMLElement ||
      element instanceof DocumentFragment ||
      element instanceof HTMLCollection ||
      (Array.isArray(element) && element[0] instanceof HTMLElement)),
  print: (element) => formatHTML(element),
});

expect.extend(toHaveNoViolations);
