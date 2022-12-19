import { FC, useEffect, useRef, useState } from 'react';
import { Graph, Node } from '@antv/x6';
import { Button, Drawer, DrawerProps, Space, notification, Modal, Row, Col } from 'antd';
import MonacoEditor from '../monaco-editor';

import analyzeDeps from '@/utils/analyzeDeps';
import templateCodes from '@/components/code-editor-drawer/templateCodes';
import { useOpen } from '@/hooks';
import { toArray } from '@/utils';
import * as monacoEditor from 'monaco-editor';
import { editor } from 'monaco-editor';

interface OnEventHandlerArgs {
  node: Node;
}

interface CodeEditorDrawerProps extends DrawerProps {
  graph: Graph | undefined;
  defaultValue?: string;
  onClose?: () => void;
}

const MONACO_ERROR_CODE = ['8002'];

const CodeEditorDrawer: FC<CodeEditorDrawerProps> = ({ defaultValue, onClose, graph }) => {
  const [codeValue, setCodeValue] = useState('');

  const [isOpenDrawer, showDrawer, hiddenDrawer] = useOpen();

  const [title, setTitle] = useState('');

  const [notice, noticeContextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();

  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const monacoRef = useRef<typeof monacoEditor>();
  const selectedNodeRef = useRef<Node>();

  const handleSaveClick = () => {
    const errors = monacoRef.current.editor.getModelMarkers({}).filter((item: editor.IMarker) => {
      if (typeof item.code === 'string') {
        return MONACO_ERROR_CODE.includes(item.code);
      }
      return MONACO_ERROR_CODE.includes(item.code.value);
    });

    if (errors.length) {
      notice.warning({
        message: '代码中存在语法错误',
        description: `${errors
          .map((item) => {
            const { endLineNumber, startLineNumber } = item || {};
            return `第${startLineNumber}行到第${endLineNumber}行、`;
          })
          .join('\r\n')} 以上几处语法错误`,
      });

      return false;
    }

    analyzeDeps(codeValue || '').then((deps) => {
      const { errorPkg } = deps;

      if (errorPkg.length) {
        notice.warning({
          message: '代码中存在错误依赖',
          description: `${toArray(errorPkg).join('、')} 以上这些依赖无法找到最新版本请修正`,
        });
        return;
      }

      delete deps.errorPkg;

      selectedNodeRef.current.updateData({ code: codeValue });

      const depsStr = JSON.stringify(deps, null, 2);

      if (Object.keys(deps).length) {
        modal.info({
          title: '检测到代码有新的依赖',
          content: (
            <div
              style={{
                height: 300,
              }}
            >
              <MonacoEditor language="json" readOnly value={depsStr} />
            </div>
          ),
          okText: '确认',
          onOk: () => {
            selectedNodeRef.current.updateData({ dependencies: depsStr });
            hiddenDrawer();
          },
        });
      } else {
        hiddenDrawer();
      }
    });
  };

  const handleChange = (value) => {
    setCodeValue(value);
  };

  const handleEditorMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
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
            editorRef.current?.getAction('editor.action.formatDocument')?.run();
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
      {noticeContextHolder}
      {modalContextHolder}
      <Drawer
        open={isOpenDrawer}
        width="90%"
        onClose={hiddenDrawer}
        title={`编辑流程节点: ${title}`}
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
                <Button onClick={handleSaveClick} type="primary">
                  保存
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <MonacoEditor
          language="javascript"
          value={codeValue}
          onChange={handleChange}
          onMount={handleEditorMount}
        />
      </Drawer>
    </>
  );
};

export default CodeEditorDrawer;
