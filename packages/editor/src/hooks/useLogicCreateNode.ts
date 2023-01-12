import { Cell, Node, Graph, Edge } from '@antv/x6';
import {
  EFFECT_HOOK_NODE,
  LANE_NODE,
  LOGIC_PROCESS_NODE,
  MODEL_PAGE_NODE,
  PAGE_DATA_NODE,
} from '@/utils/constant';
import registerGraphNode from '@/register-graph-cell';

import { getGraphId } from '@/utils';
import { useEffect } from 'react';
import Metadata = Cell.Metadata;

export const useLogicCreateNode = (graph: Graph, defaultEffectHook?: string) => {
  useEffect(() => {
    registerGraphNode();

    Graph.registerEdge(
      'logic-edge',
      {
        zIndex: -1,
        attrs: {
          line: {
            strokeWidth: 2,
            stroke: '#A2B1C3',
            sourceMarker: null,
            targetMarker: null,
          },
        },
      },
      true,
    );
  }, []);

  const createEdge = (source: Cell, target: Cell): Edge => {
    return graph.createEdge({
      shape: 'logic-edge',
      source: { cell: source.id },
      target: { cell: target.id },
    });
  };

  const createModelPageNode = (pageCode: string, metadata?: Metadata, index?: number): Node => {
    return graph.createNode({
      width: 300,
      height: 80,
      ...metadata,
      id: getGraphId('modelPage'),
      shape: MODEL_PAGE_NODE,
      data: {
        pageCode,
        index,
      },
    });
  };

  const createPageDataNode = (
    fieldCode?: string,
    fieldType?: string,
    metadata?: Metadata,
  ): Node => {
    return graph.createNode({
      height: 80,
      width: 300,
      ...metadata,
      id: getGraphId('pageData'),

      shape: PAGE_DATA_NODE,
      data: {
        fieldCode,
        fieldType,
      },
    });
  };

  const createEffectHookNode = (effectHook?: string, metadata?: Metadata): Node => {
    return graph.createNode({
      height: 80,
      width: 300,
      ...metadata,
      id: getGraphId('effectHook'),

      shape: EFFECT_HOOK_NODE,
      data: {
        effectHook: effectHook || defaultEffectHook || 'onFieldInputValueChange',
      },
    });
  };

  const createLogicProcessNode = (logicCode?: string, metadata?: Metadata): Node => {
    return graph.createNode({
      height: 80,
      width: 300,
      ...metadata,
      id: getGraphId('logicCode'),

      shape: LOGIC_PROCESS_NODE,
      data: { logicCode },
    });
  };

  const createLaneNode = (metadata: Metadata, prefix: string): Node => {
    return graph.createNode({
      width: 300,
      ...metadata,
      id: getGraphId(prefix),
      shape: LANE_NODE,
    });
  };

  return {
    createEdge,
    createModelPageNode,
    createPageDataNode,
    createEffectHookNode,
    createLogicProcessNode,
    createLaneNode,
  };
};
