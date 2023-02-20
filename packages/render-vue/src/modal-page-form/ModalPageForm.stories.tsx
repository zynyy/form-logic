import { computed, ref } from 'vue';

import '../style';

import { Button } from 'ant-design-vue';

import getLogicConfig from '@/low-code-meta/logic';

import 'ant-design-vue/dist/antd.css';

import ModelPage_U from '@/low-code-meta/model-page/ModelPage/ModelPage_U.json';

import type { Meta, StoryObj } from '@storybook/vue3';
import ModalPageForm from './ModalPageForm';

const meta: Meta<typeof ModalPageForm> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'ModalPageForm',
  component: ModalPageForm,
};

export default meta;
type Story = StoryObj<typeof ModalPageForm>;

let formConfig = {};

const render = (args) => ({
  components: { ModalPageForm },
  setup() {
    //👇 The args will now be passed down to the template

    const visible = ref();

    const handleClick = () => {
      visible.value = true;
    };

    const handleClose = () => {
      visible.value = false;
    };

    return () => {
      return (
        <>
          <Button onClick={handleClick}>点击打开</Button>
          <ModalPageForm
            visible={visible.value}
            hasConfirmButton={false}
            getLogicConfig={getLogicConfig}
            onClose={handleClose}
            {...args}
            v-slots={{
              title: () => {
                return '测试';
              },
            }}
          />
        </>
      );
    };
  },
});

export const basic: Story = {
  render,
  args: {
    formConfig,
    options: {
      // @ts-ignore
      metaSchema: ModelPage_U,
      pattern: 'EDITABLE',
      hasGroup: false,
    },
  },
};

export const group: Story = {
  render,
  args: {
    formConfig,
    options: {
      // @ts-ignore
      metaSchema: ModelPage_U,
      pattern: 'EDITABLE',
      hasGroup: true,
    },
  },
};

export const detail: Story = {
  render,
  args: {
    formConfig,
    options: {
      // @ts-ignore
      metaSchema: ModelPage_U,
      pattern: 'DETAIL',
      hasGroup: true,
    },
  },
};

export const confirmButton: Story = {
  render,
  args: {
    formConfig,
    options: {
      // @ts-ignore
      metaSchema: ModelPage_U,
      pattern: 'DETAIL',
      hasGroup: true,
    },
    hasConfirmButton: true
  },
};
