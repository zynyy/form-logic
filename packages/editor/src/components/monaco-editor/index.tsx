import Editor, { EditorProps, loader } from '@monaco-editor/react';
import { useContext, useEffect, useRef, FC } from 'react';
import * as monacoEditor from 'monaco-editor';
import { FlowChartEditorContext } from '@/context';
import { MONACO_EDITOR_PATHS_VS } from '@/utils/constant';

interface MonacoEditorProps extends EditorProps {
  language?: 'javascript' | 'json';
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  language,
  value,
  readOnly,
  onChange,
  onMount,
  ...restProps
}) => {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>();

  const { monacoEditorLoaderConfig } = useContext(FlowChartEditorContext);
  const formatFn = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  const handleEditorMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
  ) => {
    onMount?.(editor, monaco);
    editorRef.current = editor;
    formatFn();
  };

  useEffect(() => {
    loader.config({
      paths: {
        vs: MONACO_EDITOR_PATHS_VS,
      },
      ...monacoEditorLoaderConfig,
    });
  }, [monacoEditorLoaderConfig]);

  return (
    <Editor
      language={language}
      value={value}
      theme="vs-dark"
      options={{
        readOnly: readOnly,
      }}
      onChange={onChange}
      width="100%"
      height="100%"
      {...restProps}
      onMount={handleEditorMount}
    />
  );
};

export default MonacoEditor;
