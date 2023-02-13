import ListCheckLayout from './ListCheckLayout';

import Logic_L from '../low-code-meta/model-page/Logic/Logic_L.json';

import '../style';

import { LIST_FILED_CODE } from '@/utils/constant';
import getLogicConfig from '@/low-code-meta/logic';

import { message } from 'ant-design-vue';
import { useReloadFlag } from '@/hooks';
import { Key } from 'ant-design-vue/lib/table/interface';
import { ref } from 'vue';

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

const render = ({ metaSchema, rowKey, ...args }) => ({
  components: { ListCheckLayout },
  setup() {
    //👇 The args will now be passed down to the template

    const [reloadFlag, refreshFlag] = useReloadFlag();

    const selectedRowsRef = ref<any[]>([]);

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
        <ListCheckLayout
          getLogicConfig={getLogicConfig}
          action="/"
          metaSchema={metaSchema}
          onFormMount={onTableMount}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onRemove={handleRemove}
          reloadFlag={reloadFlag.value}
          hasClearSelectedRows={false}
          selectedRows={selectedRowsRef.value}
          rowSelection={{
            onChange: (selectedRowKeys: Key[], selectedRows: any[]) => {
              selectedRowsRef.value = selectedRows;
            },
          }}
        />
      );
    };
  },
});

export const list = {
  render,
  args: {
    rowKey: 'code',
    metaSchema: Logic_L,
    action: '/local-api/model-or-page/list',
    hasPageQuery: false,
  },
};

export const page = {
  render,
  args: {
    rowKey: 'code',
    metaSchema: Logic_L,
    action: '/local-api/model-page/page',
  },
};
