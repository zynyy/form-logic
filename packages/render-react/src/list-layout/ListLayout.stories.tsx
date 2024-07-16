import ListLayout from './index';

import User_L from '../low-code-meta/model-page/user/User_L.json';
import { LIST_FILED_CODE } from '@/utils/constant';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'ListLayout',
  component: ListLayout,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template = ({ hasGroup, pattern, metaSchema, ...args }) => {
  const onTableMount = (form) => {
    form.setValuesIn(LIST_FILED_CODE, [{ code: '测试' }]);
  };

  return (
    <>
      <ListLayout {...args} metaSchema={metaSchema} action="/" onTableMount={onTableMount} />
    </>
  );
};

export const basic = Template.bind({});

basic.args = {
  metaSchema: User_L,
};
