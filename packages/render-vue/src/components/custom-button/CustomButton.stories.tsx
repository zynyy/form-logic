import CustomButton from './index';

import { DeleteOutlined, QuestionOutlined, SaveOutlined } from '@ant-design/icons-vue';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'CustomButton',
  component: CustomButton,
  argTypes: {
    config: {
      description: 'button s',
    },
  },
};

const render = ({ icon, ...args }) => ({
  components: { CustomButton },
  setup(props, { slots }) {
    return () => {
      return <CustomButton {...args} v-slots={{ icon }}  />;
    };
  },
});

export const popConfirm = {
  render,
  args: {
    hasPopConfirm: true,
    title: '保存',
  },
};

export const tooltip = {
  render,
  args: {
    hasTooltip: true,
    title: '提示',
  },
};

export const tooltipConfirm = {
  render,
  args: {
    hasTooltip: true,
    hasPopConfirm: true,
    title: '删除',
  },
};

export const popConfirmIcon = {
  render,
  args: {
    hasPopConfirm: true,
    title: '保存',
    mode: 'icon',
    icon: () => <SaveOutlined />,
  },
};

export const tooltipIcon = {
  render,
  args: {
    hasTooltip: true,
    title: 'tooltip',
    mode: 'icon',
    icon: () => <QuestionOutlined />,
  },
};

export const tooltipConfirmIcon = {
  render,
  args: {
    hasTooltip: true,
    hasPopConfirm: true,
    title: '删除',
    mode: 'icon',
    icon: () => <DeleteOutlined />,
  },
};
