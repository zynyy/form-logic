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

export const Init = Template.bind({});

Init.args = {
  config: {
    processConfig: {
      pageCode: 'User_C',
      code: 'User_C_code',
      name: '',
      detailApi: '',
      updateApi: '',
    },
  },
};

export const Common = Template.bind({});

Common.args = {
  config: {
    processConfig: {
      pageCode: '',
      code: 'com_userCode',
      name: '',
      detailApi: '',
      updateApi: '',
    },
  },
};
