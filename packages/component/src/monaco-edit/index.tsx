import Editor, { EditorProps, loader } from '@monaco-editor/react';
import { useRef, FC, useEffect } from 'react';

import { MonacoEditorLoaderConfig, MonacoEditorType, MonacoType } from '@/interface';

import { DEFAULT_LOADER_CONFIG } from '@/utils';

loader.config(DEFAULT_LOADER_CONFIG);

export interface MonacoEditorProps extends Omit<EditorProps, 'onMount'> {
  language?: 'javascript' | 'json' | 'typescript';
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  loaderConfig?: MonacoEditorLoaderConfig;
  onMount?: (editor: MonacoEditorType.IStandaloneCodeEditor, monaco: MonacoType) => void;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  readOnly,
  onMount,
  loaderConfig,
  options,
  ...restProps
}) => {
  const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor>();

  const formatFn = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  const handleEditorMount = (
    editor: MonacoEditorType.IStandaloneCodeEditor,
    monaco: MonacoType,
  ) => {
    onMount?.(editor, monaco);
    editorRef.current = editor;
    formatFn();
  };

  useEffect(() => {
    if (loaderConfig) {
      loader.config(loaderConfig);
    }
  }, [loaderConfig]);

  return (
    <Editor
      theme="vs-dark"
      width="100%"
      height="100%"
      {...restProps}
      options={{
        ...options,
        readOnly,
      }}
      onMount={handleEditorMount}
    />
  );
};

export default MonacoEditor;
