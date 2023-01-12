import { FC, useEffect, useRef, useState } from 'react';
import { Graph, Node } from '@antv/x6';
import { Button, Drawer, DrawerProps, Space, Row, Col } from 'antd';
import { MonacoEditor, MonacoType, MonacoEditorType } from '@formlogic/component';

import templateCodes from '@/components/code-editor-drawer/templateCodes';
import { useMode, useOpen } from '@/hooks';
import { useChartLayoutContext } from '@/components/chart-layout/hook';

interface OnEventHandlerArgs {
  node: Node;
}

interface CodeEditorDrawerProps extends DrawerProps {
  graph: Graph | undefined;
  defaultValue?: string;
  onClose?: () => void;
}

const CodeEditorDrawer: FC<CodeEditorDrawerProps> = ({ defaultValue, onClose, graph }) => {
  const [codeValue, setCodeValue] = useState('');

  const [isOpenDrawer, showDrawer, hiddenDrawer] = useOpen();

  const [title, setTitle] = useState('');

  const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor>();
  const monacoRef = useRef<MonacoType>();
  const selectedNodeRef = useRef<Node>();

  const { isEditable, isDetail } = useMode();

  const { monacoEditorLoaderConfig } = useChartLayoutContext();

  const handleSaveClick = () => {
    selectedNodeRef.current.updateData({ code: codeValue });

    hiddenDrawer();
  };

  const handleChange = (value) => {
    setCodeValue(value);
  };

  const handleEditorMount = (
    editor: MonacoEditorType.IStandaloneCodeEditor,
    monaco: MonacoType,
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (graph) {
      graph.on('node:dblclick', ({ node }: OnEventHandlerArgs) => {
        const { codeEditor, templateCode, code } = node.getData() || {};

        selectedNodeRef.current = node;

        if (codeEditor) {
          showDrawer();
          // @ts-ignore
          setTitle(node.label);

          setCodeValue(code || templateCodes.getCode(templateCode) || '');

          setTimeout(() => {
            editorRef.current
              ?.getAction('editor.action.formatDocument')
              ?.run();
          }, 1000);
        }
      });
    }

    return () => {
      if (graph) {
        graph.off('node:dblclick');
      }
    };
  }, [graph]);

  return (
    <>
      <Drawer
        open={isOpenDrawer}
        width="90%"
        onClose={hiddenDrawer}
        title={`编辑流程节点: ${title} ${selectedNodeRef.current?.id}`}
        maskClosable={false}
        footer={
          <Row>
            <Col
              span={12}
              style={{
                textAlign: 'left',
              }}
            >
              <Space>
                <Button onClick={hiddenDrawer}>返回</Button>
              </Space>
            </Col>

            <Col
              span={12}
              style={{
                textAlign: 'right',
              }}
            >
              <Space>
                {isEditable ? (
                  <Button onClick={handleSaveClick} type="primary">
                    保存
                  </Button>
                ) : null}
              </Space>
            </Col>
          </Row>
        }
      >
        <MonacoEditor
          language="typescript"
          value={codeValue}
          onChange={handleChange}
          onMount={handleEditorMount}
          readOnly={isDetail}
          loaderConfig={monacoEditorLoaderConfig}
        />
      </Drawer>
    </>
  );
};

export default CodeEditorDrawer;
