import CopyButton, { CopyButtonProps } from './copy-button';



import { FC } from 'react';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: '',
  component: '',
  argTypes: {
    config: {
      description: 'button',
    },
  },
};

const CopyButtonTemplate: FC<CopyButtonProps> = ({ ...args }) => {
  return (
    <>
      <CopyButton {...args} />
    </>
  );
};

export const Copy = CopyButtonTemplate.bind({});

Copy.args = {
  text: '保存',
};
