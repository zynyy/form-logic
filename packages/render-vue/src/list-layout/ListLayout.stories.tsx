import ListLayout from './ListLayout';

import Logic_L from '../low-code-meta/model-page/Logic/Logic_L.json';

import '../style';

import { LIST_FILED_CODE } from '@/utils/constant';
import getLogicConfig from '@/low-code-meta/logic';

import { message } from 'ant-design-vue';
import { useReloadFlag } from '@/hooks';
import { ref } from "vue";

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

const render = ({ metaSchema, rowKey, ...args }) => ({
  components: { ListLayout },
  setup() {
    //👇 The args will now be passed down to the template

    const [reloadFlag, refreshFlag] = useReloadFlag();

    const listRef = ref();

    const onTableMount = (form) => {

      form.setValuesIn(LIST_FILED_CODE, [{ code: '测试' }]);
    };

    const handleAdd = () => {

      refreshFlag();
      message.info({
        content: '点击新增',
      });
    };

    const handleEdit = () => {
      message.info({
        content: '点击编辑',
      });
    };

    const handleDetail = () => {
      message.info({
        content: '点击详情',
      });
    };

    const handleRemove = () => {
      message.info({
        content: '点击删除',
      });
    };

    return () => {
      return (
        <ListLayout
          getLogicConfig={getLogicConfig}
          action="/local-api/logic/page"
          metaSchema={metaSchema}
          onTableMount={onTableMount}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onRemove={handleRemove}
          reloadFlag={reloadFlag.value}
          ref={listRef}
        />
      );
    };
  },
});

export const basic = {
  render,
  args: {
    metaSchema: Logic_L,
    hasGroup: false,
    hasRowSelection: true,
    rowKey: 'uid',
  },
};
