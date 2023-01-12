import { MonacoEditor, MonacoEditorProps } from '@formlogic/component';
import { FC } from 'react';

export interface JsonMonacoEditor extends MonacoEditorProps {}

const JsonMonacoEditor: FC<JsonMonacoEditor> = (props) => {
  return <MonacoEditor height={200} {...props} language="json" />;
};

export default JsonMonacoEditor;
