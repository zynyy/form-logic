import { MonacoEditor, MonacoEditorProps } from '@formlogic/component';
import { FC } from 'react';

export interface JsonMonacoEditorProps extends MonacoEditorProps {}

const JsonMonacoEditor: FC<JsonMonacoEditorProps> = (props) => {
  return <MonacoEditor  {...props}    language="json" />;
};

export default JsonMonacoEditor;
