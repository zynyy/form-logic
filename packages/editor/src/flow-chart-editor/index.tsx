import { FC, useEffect, useRef, memo } from 'react';
import { Card, Divider, Space, Form } from 'antd';

import { Snapline } from '@antv/x6-plugin-snapline';

import { MiniMap } from '@antv/x6-plugin-minimap';

import SideBar from '@/components/side-bar';
import ToolBar from '@/components/tool-bar';
import SettingBar from '@/components/setting-bar';
import SplitPane, { Pane } from '@/components/split-pane';
import CodeEditorDrawer from '@/components/code-editor-drawer';
import ExtraBtn from '@/components/extra-btn';

import { useFlowChartGraph, useLogicDetail } from '@/hooks';
import Header from '@/components/header';

import ChartLayout, { ChartLayoutProps } from '@/components/chart-layout';

import { Graph } from '@antv/x6';

import '@/style'

export interface FlowChartEditorProps extends Omit<ChartLayoutProps, 'mode' | 'children'> {
  onGraphMount?: (graph: Graph) => void;
  height?: number | string;
}

const FlowChartEditor: FC<FlowChartEditorProps> = ({
  logicProcessConfig,
  monacoEditorLoaderConfig,
  pattern,
  onGraphMount,
  height,
}) => {
  const mainDomRef = useRef<HTMLDivElement>(null);

  const minimapDomRef = useRef<HTMLDivElement>(null);

  const { code, belongCode } = logicProcessConfig || {};

  const [loading, flowJson] = useLogicDetail(code, belongCode);

  const [form] = Form.useForm();

  const [flowChart, graphDomRef] = useFlowChartGraph(pattern, onGraphMount);

  useEffect(() => {
    if (flowChart && minimapDomRef.current) {
      flowChart
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
      const { cells, remarks, name, suffix, before, type, belong } = flowJson || {};

      form.setFieldsValue({
        type,
        belong,
        before,
        suffix,
        name,
        remarks,
        code,
      });

      flowChart.fromJSON({ cells });

      flowChart.centerContent();
    }
  }, [flowChart, flowJson, code]);

  return (
    <ChartLayout
      loading={loading}
      pattern={pattern}
      monacoEditorLoaderConfig={monacoEditorLoaderConfig}
      logicProcessConfig={logicProcessConfig}
      height={height}
    >
      <Header graph={flowChart} code={code} form={form} />
      <Card
        size="small"
        className="chart-body"
        title={
          <Space split={<Divider type="vertical" />}>
            <ToolBar
              graph={flowChart}
              saveParams={{
                checkCode: !code,
              }}
              form={form}
            />
          </Space>
        }
        extra={<ExtraBtn graph={flowChart} />}
        bodyStyle={{
          paddingTop: 0,
        }}
      >
        <SplitPane split="vertical" minSize="67%" maxSize="95%">
          <div className="editor-flow-warp" ref={mainDomRef}>
            <SideBar graph={flowChart} />
            <div className="editor-flow-minimap" ref={minimapDomRef} />
            <div className="editor-flow-container" ref={graphDomRef} />
          </div>
          <Pane className="setting-bar">
            <SettingBar graph={flowChart} />
          </Pane>
        </SplitPane>
      </Card>

      <CodeEditorDrawer graph={flowChart} />
    </ChartLayout>
  );
};

export default memo(FlowChartEditor);
