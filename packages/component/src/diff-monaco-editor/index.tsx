import { DiffEditor, DiffEditorProps } from '@monaco-editor/react';
import { FC } from 'react';

export interface DiffMonacoEditorProps extends DiffEditorProps {}

const DiffMonacoEditor: FC<DiffMonacoEditorProps> = ({ ...restProps }) => {
  return <DiffEditor width="100%" height="100%" theme="vs-dark" {...restProps} />;
};

export default DiffMonacoEditor;
