import { createRequire } from 'module';

import {
  SFCBlock,
  SFCDescriptor,
  SFCParseOptions,
  SFCParseResult,
  SFCScriptBlock,
  SFCStyleBlock,
  SFCTemplateBlock,
} from './interface';

import * as CompilerDom from '@vue/compiler-dom';
import { CompilerError, ElementNode } from '@vue/compiler-core';
import { NodeTypes } from '@vue/compiler-dom';

const splitRE = /\r?\n/g;
const replaceRE = /./g;

const SFC_CACHE_MAX_SIZE = 500;

const require = createRequire(import.meta.url);

const sourceToSFC = new (require('lru-cache'))(SFC_CACHE_MAX_SIZE) as Map<
  string,
  SFCParseResult
>;

export const stringify = (sfcDescriptor: SFCDescriptor) => {
  const { template, script, styles, customBlocks } = sfcDescriptor;

  return (
    (
      [template, script, ...styles, ...customBlocks]
        // discard blocks that don't exist
        .filter((block) => block != null) as Array<NonNullable<SFCBlock>>
    )
      // sort blocks by source position
      .sort((a, b) => a.loc.start.offset - b.loc.start.offset)
      // figure out exact source positions of blocks
      .map((block) => {
        const openTag = makeOpenTag(block);
        const closeTag = makeCloseTag(block);

        return Object.assign({}, block, {
          openTag,
          closeTag,

          startOfOpenTag: block.loc.start.offset - openTag.length,
          endOfOpenTag: block.loc.start.offset,

          startOfCloseTag: block.loc.end.offset,
          endOfCloseTag: block.loc.end.offset + closeTag.length,
        });
      })
      // generate sfc source
      .reduce((sfcCode, block, index, array) => {
        const first = index === 0;

        let newlinesBefore = 0;

        if (first) {
          newlinesBefore = block.startOfOpenTag;
        } else {
          const prevBlock = array[index - 1];
          newlinesBefore = block.startOfOpenTag - prevBlock.endOfCloseTag;
        }

        return (
          sfcCode +
          '\n'.repeat(newlinesBefore) +
          block.openTag +
          block.content +
          block.closeTag
        );
      }, '')
  );
};

const makeOpenTag = (block: SFCBlock) => {
  let source = '<' + block.type;

  source += Object.keys(block.attrs)
    .sort()
    .map((name) => {
      const value = block.attrs[name];

      if (value === true) {
        return name;
      } else {
        return `${name}="${value}"`;
      }
    })
    .map((attr) => ' ' + attr)
    .join('');

  return source + '>';
};

const makeCloseTag = (block: SFCBlock) => {
  return `</${block.type}>\n`;
};

export const parse = (
  source: string,
  {
    sourceMap = true,
    filename = 'anonymous.vue',
    sourceRoot = '',
    pad = false,
    compiler = CompilerDom,
  }: SFCParseOptions = {},
): SFCParseResult => {
  const sourceKey =
    source + sourceMap + filename + sourceRoot + pad + compiler.parse;
  const cache = sourceToSFC.get(sourceKey);
  if (cache) {
    return cache;
  }

  const descriptor: SFCDescriptor = {
    filename,
    source,
    template: null,
    script: null,
    scriptSetup: null,
    styles: [],
    customBlocks: [],
  };

  const errors: (CompilerError | SyntaxError)[] = [];
  const ast = compiler.parse(source, {
    // there are no components at SFC parsing level
    isNativeTag: () => true,
    // preserve all whitespaces
    isPreTag: () => true,
    onError: (e) => {
      errors.push(e);
    },
  });

  ast.children.forEach((node) => {
    if (node.type !== NodeTypes.ELEMENT) {
      return;
    }
    if (!node.children.length && !hasSrc(node) && node.tag !== 'template') {
      return;
    }

    switch (node.tag) {
      case 'template': {
        if (!descriptor.template) {
          const templateBlock = (descriptor.template = createBlock(
            node,
            source,
            false,
          ) as SFCTemplateBlock);
          templateBlock.ast = node;
        } else {
          errors.push(createDuplicateBlockError(node));
        }
        break;
      }

      case 'script': {
        const scriptBlock = createBlock(node, source, pad) as SFCScriptBlock;
        const isSetup = !!scriptBlock.attrs.setup;
        if (isSetup && !descriptor.scriptSetup) {
          descriptor.scriptSetup = scriptBlock;
          break;
        }
        if (!isSetup && !descriptor.script) {
          descriptor.script = scriptBlock;
          break;
        }
        errors.push(createDuplicateBlockError(node, isSetup));
        break;
      }

      case 'style': {
        const styleBlock = createBlock(node, source, pad) as SFCStyleBlock;
        if (styleBlock.attrs.vars) {
          errors.push(
            new SyntaxError(
              `<style vars> has been replaced by a new proposal: ` +
                `https://github.com/vuejs/rfcs/pull/231`,
            ),
          );
        }
        descriptor.styles.push(styleBlock);
        break;
      }

      default:
        descriptor.customBlocks.push(createBlock(node, source, pad));
        break;
    }
  });

  if (descriptor.scriptSetup) {
    if (descriptor.scriptSetup.src) {
      errors.push(
        new SyntaxError(
          `<script setup> cannot use the "src" attribute because ` +
            `its syntax will be ambiguous outside of the component.`,
        ),
      );
      descriptor.scriptSetup = null;
    }
    if (descriptor.script && descriptor.script.src) {
      errors.push(
        new SyntaxError(
          `<script> cannot use the "src" attribute when <script setup> is ` +
            `also present because they must be processed together.`,
        ),
      );
      descriptor.script = null;
    }
  }

  const result = {
    descriptor,
    errors,
  };
  sourceToSFC.set(sourceKey, result);
  return result;
};

const createDuplicateBlockError = (
  node: ElementNode,
  isScriptSetup = false,
): CompilerError => {
  const err = new SyntaxError(
    `Single file component can contain only one <${node.tag}${
      isScriptSetup ? ` setup` : ``
    }> element`,
  ) as CompilerError;
  err.loc = node.loc;
  return err;
};

const createBlock = (
  node: ElementNode,
  source: string,
  pad: SFCParseOptions['pad'],
): SFCBlock => {
  const type = node.tag;
  let { start, end } = node.loc;
  let content = '';
  if (node.children.length) {
    start = node.children[0].loc.start;
    end = node.children[node.children.length - 1].loc.end;
    content = source.slice(start.offset, end.offset);
  }
  const loc = {
    source: content,
    start,
    end,
  };
  const attrs: Record<string, string | true> = {};
  const block: SFCBlock = {
    type,
    content,
    loc,
    attrs,
  };
  if (pad) {
    block.content = padContent(source, block, pad) + block.content;
  }
  node.props.forEach((p) => {
    if (p.type === NodeTypes.ATTRIBUTE) {
      attrs[p.name] = p.value ? p.value.content || true : true;
      if (p.name === 'lang') {
        block.lang = p.value && p.value.content;
      } else if (p.name === 'src') {
        block.src = p.value && p.value.content;
      } else if (type === 'style') {
        if (p.name === 'scoped') {
          (block as SFCStyleBlock).scoped = true;
        } else if (p.name === 'module') {
          (block as SFCStyleBlock).module = attrs[p.name];
        }
      } else if (type === 'script' && p.name === 'setup') {
        (block as SFCScriptBlock).setup = attrs.setup;
      }
    }
  });
  return block;
};

const padContent = (
  content: string,
  block: SFCBlock,
  pad: SFCParseOptions['pad'],
): string => {
  content = content.slice(0, block.loc.start.offset);
  if (pad === 'space') {
    return content.replace(replaceRE, ' ');
  } else {
    const offset = content.split(splitRE).length;
    const padChar = block.type === 'script' && !block.lang ? '//\n' : '\n';
    return Array(offset).join(padChar);
  }
};

const hasSrc = (node: ElementNode) => {
  return node.props.some((p) => {
    if (p.type !== NodeTypes.ATTRIBUTE) {
      return false;
    }
    return p.name === 'src';
  });
};
