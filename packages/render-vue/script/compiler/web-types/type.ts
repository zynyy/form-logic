import { PathLike } from 'node:fs';

export type VueSlot = {
  name: string;
  description: string;
};

export type VueEventArgument = {
  name: string;
  type: string;
};

export type VueEvent = {
  name: string;
  description?: string;
  type: string;
  arguments?: VueEventArgument[];
};

export type VueAttribute = {
  name: string;
  default: string;
  description: string;
  type?: string;
  abstract?: string;  // 摘要 会覆盖所有
  'description-sections'?: string; // 部分描述 会覆盖所有
  required?: boolean;
  value?: {
    kind: 'expression';
    type: string;
  };
  'doc-url'?: string;
};

export type VueTag = {
  name: string;
  slots?: VueSlot[];
  js?: {
    events?: VueEvent[];
  };
  events?: VueEvent[];
  attributes?: VueAttribute[];
  props?: VueAttribute[];
  description?: string;
  source?: {
    module: string;
    symbol: string;
  };
  'doc-url'?: string;
};

export type Options = {
  name: string;
  path: PathLike;
  test: RegExp;
  version: string;
  outputDir?: string;
  tagPrefix?: string;
};
