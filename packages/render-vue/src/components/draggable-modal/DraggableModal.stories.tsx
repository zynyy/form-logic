import DraggableModal from './DraggableModal';
import infoModal from './infoModal';
import confirmModal from './confirmModal';
import { useCreateForm, useListSchema } from '@/hooks';

import { onMounted } from 'vue';

import '../../style';
import { uid } from '@formily/shared';

import 'ant-design-vue/dist/antd.css';

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

const render = ({ metaSchema, rowKey, ...args }) => ({
  components: { DraggableModal },
  setup() {
    onMounted(() => {
      infoModal({
        title: 'info',
      });

      confirmModal({
        title: 'confirm',
      });
    });

    return () => {
      return (
        <DraggableModal
          visible
          v-slots={{
            title: () => 66,
          }}
        />
      );
    };
  },
});

export const basic = {
  render,
  args: {},
};
