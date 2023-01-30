import { setMonacoEditorLoaderPath, DEFAULT_LOADER_CONFIG } from '@/utils';

import MonacoEditor from './index';

setMonacoEditorLoaderPath({
  vs: 'https://cdn.staticfile.org/monaco-editor/0.34.0/min/vs',
});
console.log(DEFAULT_LOADER_CONFIG, 'stories');

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'MonacoEditor',
  argTypes: {
    config: {
      description: 'Monaco Editor',
    },
  },
};

const Template = ({}) => {

  return <MonacoEditor />;
};

export const editable = Template.bind({});
