import { MonacoEditor, MonacoEditorProps } from '@formlogic/component';
import { FC } from 'react';

export interface SchemaDataProps extends Omit<MonacoEditorProps, 'readOnly'> {}

const SchemaData: FC<SchemaDataProps> = (props) => {
  return <MonacoEditor {...props} language="json" readOnly height="100%" />;
};

export default SchemaData;
