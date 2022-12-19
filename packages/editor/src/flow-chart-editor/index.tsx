import { FC, useEffect, useRef, useState } from 'react';
import { Card, ConfigProvider, Divider, Space } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { Graph } from '@antv/x6';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Transform } from '@antv/x6-plugin-transform';
import { MiniMap } from '@antv/x6-plugin-minimap';

import Header from '@/components/header';
import SideBar from '@/components/side-bar';
import ToolBar from '@/components/tool-bar';
import SettingBar from '@/components/setting-bar';
import SplitPane, { Pane } from '@/components/split-pane';
import CodeEditorDrawer from '@/components/code-editor-drawer';
import ExtraBtn from '@/components/extra-btn';

import registerGraphNode from '@/register-graph-cell';
import validateGraph from '@/utils/validateGraph';
import createEdge from '@/register-graph-cell/edge';

import { FlowChartEditorContextType } from '@/interface';
import { FlowChartEditorContext } from '@/context';

import '../style';
import { useLogicDetail } from '@/hooks';

export interface FlowChartEditorProps {
  config: FlowChartEditorContextType;
}

const FlowChartEditor: FC<FlowChartEditorProps> = ({ config }) => {
  const [flowChart, setFlowChart] = useState<Graph>();

  const mainDomRef = useRef<HTMLDivElement>(null);
  const graphDomRef = useRef<HTMLDivElement>(null);
  const minimapDomRef = useRef<HTMLDivElement>(null);

  const { processConfig } = config || {};
  const { code, pageCode } = processConfig || {};

  const [loading, flowJson] = useLogicDetail(code, pageCode);

  useEffect(() => {
    if (graphDomRef.current) {
      registerGraphNode();

      const graph = new Graph({
        container: graphDomRef.current,
        autoResize: true,
        grid: true,
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3,
        },
        connecting: {
          allowLoop: false,
          highlight: true,
          router: {
            name: 'manhattan',
            args: {
              padding: 1,
            },
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 8,
            },
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 20,
          },
          createEdge: createEdge.create,
          validateMagnet: validateGraph.validateMagnet,
          validateConnection: validateGraph.validateConnection,
          validateEdge: validateGraph.validateEdge,
        },

        highlighting: {
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#5F95FF',
              },
            },
          },

          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#5F95FF',
              },
            },
          },
        },
      });
      setFlowChart(graph);
    }
  }, []);

  useEffect(() => {
    if (flowChart && minimapDomRef.current) {
      flowChart
        .use(
          new Transform({
            resizing: true,
            rotating: false,
          }),
        )
        .use(
          new Scroller({
            enabled: true,
            autoResize: true,
          }),
        )
        .use(
          new MiniMap({
            container: minimapDomRef.current,
          }),
        )
        .use(
          new Snapline({
            enabled: true,
          }),
        );
    }
  }, [flowChart]);

  useEffect(() => {
    if (flowChart && flowJson) {
      flowChart.fromJSON(flowJson);
    }
  }, [flowChart, flowJson]);

  return (
    <ConfigProvider locale={zhCN}>
      <FlowChartEditorContext.Provider value={config}>
        <Card
          size="small"
          style={{
            height: '100%',
          }}
          title={
            <Space split={<Divider type="vertical" />}>
              <Header graph={flowChart} code={code} />
              <ToolBar
                graph={flowChart}
                saveParams={{
                  code,
                  pageCode,
                }}
              />
            </Space>
          }
          extra={<ExtraBtn graph={flowChart} />}
        >
          <SplitPane split="vertical" minSize="80%" maxSize="95%">
            <div className="editor-flow-warp" ref={mainDomRef}>
              <SideBar graph={flowChart} />
              <div className="editor-flow-minimap" ref={minimapDomRef} />
              <div className="editor-flow-container" ref={graphDomRef} />
            </div>
            <Pane className="settingBar">
              <SettingBar graph={flowChart} />
            </Pane>
          </SplitPane>
        </Card>

        <CodeEditorDrawer graph={flowChart} />
      </FlowChartEditorContext.Provider>
    </ConfigProvider>
  );
};

export default FlowChartEditor;
