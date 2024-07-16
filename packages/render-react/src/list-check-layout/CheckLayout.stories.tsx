import ListCheckLayout, { ListCheckLayoutProps } from './index';

import User_L from '../low-code-meta/model-page/user/User_L.json';
import { FC } from 'react';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'ListCheckLayout',
  component: ListCheckLayout,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const Template: FC<ListCheckLayoutProps> = ({ ...args }) => {
  return (
    <>
      <ListCheckLayout {...args} action="/local-api/field-meta/page" />
    </>
  );
};

export const basic = Template.bind({});

basic.args = {
  metaSchema: User_L,
  rowKey: 'code',
  selectedRows: [],
};

export const radio = Template.bind({});

radio.args = {
  metaSchema: User_L,
  rowSelectionType: 'radio',
  rowKey: 'code',
  selectedRows: [],
};

export const defaultSelectValue = Template.bind({});

defaultSelectValue.args = {
  metaSchema: User_L,
  rowKey: 'code',
  selectedRows: [{ code: 'type' }],
};

export const defaultSelectValueRadio = Template.bind({});

defaultSelectValueRadio.args = {
  metaSchema: User_L,
  rowSelectionType: 'radio',
  rowKey: 'code',
  selectedRows: [{ code: 'type' }],
};
