import { Graph, Node } from '@antv/x6';
import { FC, useEffect, useState, memo } from 'react';
import { PageDataSourceItem, LogicItem, EffectHookDataItem, ChartPatternType } from '@/interface';
import ChartLayout from '@/components/chart-layout';
import {
  useEmitEffectHook,
  useEmitLogicProcess,
  useEmitPageData,
  useGagreLayout,
  useLogicCreateNode,
  useLogicEffectHookModeData,
  useLogicEffectHookProcessChartGraph,
  useOpen,
} from '@/hooks';
import { Card, Radio, Space } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import {
  DELETE_GRAPH_EVENT,
  EFFECT_HOOK_ADD_GRAPH_EVENT,
  GRID_MODE,
  LOGIC_EFFECT_HOOK_MODE,
  LOGIC_PROCESS_ADD_GRAPH_EVENT,
  LOGIC_PROCESS_DETAIL_GRAPH_EVENT,
  LOGIC_PROCESS_SHOW_DOWN_UP_GRAPH_EVENT,
  PAGE_DATA_ADD_GRAPH_EVENT,
} from '@/utils/constant';
import { getLogicEffectHookData, getLogicEffectHookRootNode } from '@/utils/graphUtil';
import FlowChartDetailDrawer from '@/flow-chart-detail-drawer';

import '@/style';

export interface LogicEffectHookProcessProps {
  pageCode: string;
  modelCode: string;
  loading?: boolean;
  logics: LogicItem[];
  pageDataSource: PageDataSourceItem[];
  effectHookSource: EffectHookDataItem[];
  defaultEffectHook?: string;
  pattern?: ChartPatternType;
  onGraphMount?: (graph: Graph) => void;
  height?: number | string;
}

const LogicEffectHookProcess: FC<LogicEffectHookProcessProps> = ({
  pageCode,
  logics,
  defaultEffectHook,
  onGraphMount,
  effectHookSource,
  loading,
  pageDataSource,
  modelCode,
  pattern,
  height,
}) => {
  const [graph, graphDomRef] = useLogicEffectHookProcessChartGraph(onGraphMount);

  const [open, show, hidden] = useOpen();
  const [logicCode, setLogicCode] = useState('');

  const [mode, setMode] = useState('field');

  const { createLogicProcessNode, createEffectHookNode, createPageDataNode, createEdge } =
    useLogicCreateNode(graph, defaultEffectHook);

  const { transformModeData } = useLogicEffectHookModeData(
    graph,
    pageCode,
    {
      defaultEffectHook,
    },
    pattern,
  );

  const [layout] = useGagreLayout(graph);

  useEmitPageData(graph, pageDataSource);
  useEmitEffectHook(graph, effectHookSource);
  useEmitLogicProcess(graph, modelCode);

  const redrawChart = (nextMode: string) => {
    const dataSource = getLogicEffectHookData(graph, false);

    const cells = transformModeData(dataSource, nextMode);

    graph.resetCells(cells);

    if (nextMode !== GRID_MODE) {
      layout();
    }
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    const nextMode = e.target.value;

    setMode(nextMode);

    redrawChart(nextMode);

    const rootNode = getLogicEffectHookRootNode(graph);

    if (rootNode) {
      rootNode.setData({
        mode: nextMode,
      });
    }
  };

  useEffect(() => {
    if (graph) {
      graph.on(PAGE_DATA_ADD_GRAPH_EVENT, ({ node }) => {
        if (mode === 'grid') {
          const dataSource = getLogicEffectHookData(graph, false);

          const cells = transformModeData(
            dataSource.concat({
              fieldCode: '',
              fieldType: '',
              logicCode: '',
              effectHook: '',
            }),
            mode,
          );

          graph.resetCells(cells);
        } else {
          const member = createPageDataNode();

          graph.addCell([member, createEdge(node, member)]);

          layout();
        }
      });

      graph.on(EFFECT_HOOK_ADD_GRAPH_EVENT, ({ node }) => {
        const member = createEffectHookNode();

        graph.addCell([member, createEdge(node, member)]);

        layout();
      });

      graph.on(LOGIC_PROCESS_ADD_GRAPH_EVENT, ({ node }) => {
        const member = createLogicProcessNode();

        graph.addCell([member, createEdge(node, member)]);

        layout();

        graph.trigger(LOGIC_PROCESS_SHOW_DOWN_UP_GRAPH_EVENT);
      });

      graph.on(LOGIC_PROCESS_DETAIL_GRAPH_EVENT, ({ logicCode }) => {
        setLogicCode(logicCode);
        show();
      });

      graph.on(DELETE_GRAPH_EVENT, ({ node }) => {
        const leafNodes = graph.getNeighbors(node, {
          outgoing: true,
        });

        leafNodes.forEach((leafNode: Node) => {
          graph
            .getNeighbors(leafNode, {
              outgoing: true,
            })
            .forEach((cellNode: Node) => {
              graph.removeCell(cellNode);
            });
          graph.removeCell(leafNode);
        });

        graph.removeCell(node);

        redrawChart(mode);
      });
    }

    return () => {
      if (graph) {
        [
          PAGE_DATA_ADD_GRAPH_EVENT,
          EFFECT_HOOK_ADD_GRAPH_EVENT,
          LOGIC_PROCESS_ADD_GRAPH_EVENT,
          LOGIC_PROCESS_DETAIL_GRAPH_EVENT,
          DELETE_GRAPH_EVENT,
        ].forEach((key) => {
          graph.off(key);
        });
      }
    };
  }, [mode, graph]);

  useEffect(() => {
    if (graph) {
      const cells = transformModeData(logics, mode);
      graph.resetCells(cells);
      layout();
    }
  }, [logics, graph]);

  return (
    <>
      <ChartLayout loading={loading} mode={mode} pattern={pattern} height={height}>
        <Card
          size="small"
          className="chart-body"
          title={
            <Space>
              <Radio.Group
                size="small"
                value={mode}
                onChange={handleModeChange}
                optionType="button"
                options={LOGIC_EFFECT_HOOK_MODE}
              />
            </Space>
          }
        >
          <div style={{ position: 'relative', height: '100%' }} ref={graphDomRef} />
        </Card>
      </ChartLayout>
      <FlowChartDetailDrawer open={open} logicCode={logicCode} onClose={hidden} />
    </>
  );
};

LogicEffectHookProcess.defaultProps = {
  defaultEffectHook: 'onFieldInputValueChange',
  pattern: 'EDITABLE',
};

export default memo(LogicEffectHookProcess);
