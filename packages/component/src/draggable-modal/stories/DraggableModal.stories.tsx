import DraggableModal from '../DraggableModal';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'DraggableModal',
  component: DraggableModal,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template = ({ hasGroup, pattern, metaSchema, ...args }) => {
  return (
    <>
      <DraggableModal {...args}>测试拖拽</DraggableModal>
    </>
  );
};

export const basic = Template.bind({});

basic.args = {
  open: true,
};
