import { Cell, Node } from '@antv/x6';

import indexTpl from './template/indexTpl';
import templateCodes from '@/components/code-editor-drawer/templateCodes';

interface DSL {
  cells: Cell.Properties[];
}

interface NodesFns {
  [key: string]: string;
}

interface CompileCodeOutput {
  nodeFns: {
    [fileName: string]: string;
  };
  'dsl.json': string;
  'index.js': string;
}

const defaultTpl = () => {
  return `// 默认代码
  export default async function(ctx) {

  return {}
  }`;
};

export const getFiles = (nodes: Node[]) => {
  return nodes.map((node) => {
    const { id, data } = node;
    const { code, templateCode } = data;
    return {
      fileName: `${id}`,
      content: code || templateCodes.getCode(templateCode) || defaultTpl(),
    };
  });
};

const genEntryFile = (nodeIds: string[]): string => {
  const imports: string[] = [];
  const funcMaps: string[] = [];
  nodeIds.forEach((id, idx) => {
    const funcName = `fn_${idx}`;
    imports.push(`import ${funcName} from './${id}';`);
    funcMaps.push(`'${id}': ${funcName}`);
  });
  return [
    imports.join('\n'),
    `const nodeFns = {\n  ${funcMaps.join(',\n  ')}\n};`,
    'export default nodeFns;',
  ].join('\n');
};

const getNodeFns = (nodes: Node[]) => {
  const nodeFns: NodesFns = {};

  const files = getFiles(nodes);

  const nodeIds = nodes.map((item) => item.id);

  files.forEach((item) => {
    const { fileName, content } = item || {};
    nodeFns[`${fileName}.js`] = content;
  });

  nodeFns['index.js'] = genEntryFile(nodeIds);

  return nodeFns;
};

export const compileCode = (dsl: DSL, nodes: Node[]): CompileCodeOutput => {
  return {
    nodeFns: getNodeFns(nodes),
    'dsl.json': JSON.stringify(dsl, null, 2),
    'index.js': indexTpl(),
  };
};
