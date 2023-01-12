import CustomButton from './index';

import { FC } from 'react';
import { DeleteOutlined, QuestionOutlined, SaveOutlined } from '@ant-design/icons';

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

const Template: FC = ({ ...args }) => {
  return (
    <>
      <CustomButton {...args} />
    </>
  );
};

export const popConfirm = Template.bind({});

popConfirm.args = {
  hasPopConfirm: true,
  title: '保存',
};

export const tooltip = Template.bind({});

tooltip.args = {
  hasTooltip: true,
  title: 'tooltip',
};

export const tooltipConfirm = Template.bind({});

tooltipConfirm.args = {
  hasTooltip: true,
  hasPopConfirm: true,
  title: '删除',
};

export const popConfirmIcon = Template.bind({});

popConfirmIcon.args = {
  hasPopConfirm: true,
  title: '保存',
  mode: 'icon',
  icon: <SaveOutlined />,
};


export const tooltipIcon = Template.bind({});

tooltipIcon.args = {
  hasTooltip: true,
  title: 'tooltip',
  mode: 'icon',
  icon: <QuestionOutlined />,
};


export const tooltipConfirmIcon = Template.bind({});

tooltipConfirmIcon.args = {
  hasTooltip: true,
  hasPopConfirm: true,
  title: '删除',
  mode: 'icon',
  icon: <DeleteOutlined />,
};
