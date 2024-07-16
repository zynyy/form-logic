

import { uid, useCreateForm } from '@formlogic/render-core-vue3';
import { computed, ref } from 'vue';

import { useListSchema } from '@/hooks';

import Logic_L from '@/low-code-meta/model-page/Logic/Logic_L.json';
import SchemeTableForm from '../SchemeTableForm';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'SchemeTableForm',
  component: SchemeTableForm,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const render = ({ metaSchema, rowKey, ...args }) => ({
  components: { SchemeTableForm },
  setup() {
    //👇 The args will now be passed down to the template

    const dataSource = ref([]);

    const values = ref<any[]>([]);
    const loadingRef = ref<boolean>(false);

    const currentPage = ref(1);
    const pageSize = ref(30);
    const total = ref(0);

    const [formRef] = useCreateForm();

    const optionsRef = computed(() => {
      return {
        metaSchema: metaSchema,
      };
    });

    const tableSchemaRef = useListSchema(optionsRef);

    const handleSubmitClick = () => {
      formRef.value.validate('*');
    };

    const rowSelection = {
      onChange: (rowKey, selectedRows) => {
        values.value = selectedRows;
      },
    };

    const handleAddClick = () => {
      loadingRef.value = true;

      setTimeout(() => {
        dataSource.value = Array.from(
          {
            length: 29,
          },
          () => {
            return {
              uid: uid(8),
              code: uid(),
            };
          },
        );

        total.value = 100;
        loadingRef.value = false;
      }, 2000);
    };

    const handleRemoveClick = () => {};

    const handleTableChange = (pagination, filters, sorter, extra) => {
      const { action } = extra || {};

      if (action === 'paginate') {
        currentPage.value = pagination.current;
        pageSize.value = pagination.pageSize;
      }
      dataSource.value = Array.from(
        {
          length: 29,
        },
        () => {
          return {
            uid: uid(8),
            code: uid(),
          };
        },
      );
    };

    return () => {
      return (
        <SchemeTableForm
          {...args}
          form={formRef.value}
          rowSelection={rowSelection}
          selectedRows={values.value}
          dataSource={dataSource.value}
          schema={tableSchemaRef.value.tableSchema}
          onAdd={handleAddClick}
          onRemove={handleRemoveClick}
          total={total.value}
          currentPage={currentPage.value}
          pageSize={pageSize.value}
          onChange={handleTableChange}
          hasClearSelectedRows
          tableLoading={loadingRef.value}
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
