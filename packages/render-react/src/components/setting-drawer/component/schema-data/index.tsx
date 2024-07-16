import JsonMonacoEditor, { JsonMonacoEditorProps } from '@/components/json-monaco-editor';
import { FC } from 'react';

export interface SchemaDataProps extends Omit<JsonMonacoEditorProps, 'readOnly'> {}

const SchemaData: FC<SchemaDataProps> = (props) => {
  return <JsonMonacoEditor {...props} readOnly height="100%" />;
};

export default SchemaData
