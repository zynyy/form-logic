import { ChartPattern } from '@/interface';

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 1.5;
export const ZOOM_STEP = 0.1;

export const ECMA_STRING_TAG = {
  error: '[object Error]', // 381
  function: '[object Function]', // 138
};

export const MONACO_EDITOR_PATHS_VS = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs';

export const DEFAULT_LOADER_CONFIG = {
  paths: {
    vs: MONACO_EDITOR_PATHS_VS,
  },
};

export const LOGIC_TYPE_DATA = [
  {
    value: 'com',
    label: '公共流程',
  },
  {
    value: 'model',
    label: '模型流程',
  },
  {
    value: 'page',
    label: '页面流程',
  },
];

export const MODEL_PAGE_NODE = 'model-page';
export const PAGE_DATA_NODE = 'page-data';
export const EFFECT_HOOK_NODE = 'effect-hook';
export const LOGIC_PROCESS_NODE = 'logic-process';
export const LANE_NODE = 'lane';
export const RECT_NODE = 'custom-rect';
export const CIRCLE_NODE = 'custom-circle';
export const POLYGON_NODE = 'custom-polygon';
export const IMAGE_NODE = 'custom-image';

export const FIELD_MODE = 'field';
export const LOGIC_MODE = 'logic';
export const EFFECT_MODE = 'effect';
export const GRID_MODE = 'grid';

export const DELETE_GRAPH_EVENT = 'node:delete';
export const EFFECT_HOOK_ADD_GRAPH_EVENT = 'node:add:effectHook';
export const LOGIC_PROCESS_ADD_GRAPH_EVENT = 'node:add:logicProcess';
export const LOGIC_PROCESS_DETAIL_GRAPH_EVENT = 'node:detail:logicProcess';
export const PAGE_DATA_ADD_GRAPH_EVENT = 'node:add:pageData';
export const LOGIC_PROCESS_SHOW_DOWN_UP_GRAPH_EVENT = 'node:logicProcess:showDownUp';

export const LOGIC_EFFECT_HOOK_MODE = [
  {
    value: FIELD_MODE,
    label: '字段模式',
  },
  {
    value: EFFECT_MODE,
    label: '事件模式',
  },
  {
    value: LOGIC_MODE,
    label: '逻辑模式',
  },
  {
    value: GRID_MODE,
    label: '网格模式',
  },
];

export const LOGIC_PROCESS_PATTERN = [
  {
    value: ChartPattern.DETAIL,
    label: '详情',
  },
  {
    value: ChartPattern.EDITABLE,
    label: '编辑',
  },
];
