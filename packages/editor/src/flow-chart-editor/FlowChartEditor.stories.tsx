import FlowChartEditor from './index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'flow',
  component: FlowChartEditor,
  argTypes: {
    config: {
      description: '获取页面流程逻辑配置',
    },
  },
};

const Template = (args) => <FlowChartEditor {...args} />;

export const EDITABLE = Template.bind({});

EDITABLE.args = {
  pattern: 'EDITABLE',
  logicProcessConfig: {
    belongCode: '',
    code: '',
    name: '',
  },
};

export const Edit = Template.bind({});

Edit.args = {
  pattern: 'EDITABLE',
  logicProcessConfig: {
    belongCode: '',
    code: 'com_save',
    name: '保存',
  },
};

export const DETAIL = Template.bind({});

DETAIL.args = {
  pattern: 'DETAIL',
  logicProcessConfig: {
    belongCode: '',
    code: 'com_save',
    name: '保存',
  },
};
