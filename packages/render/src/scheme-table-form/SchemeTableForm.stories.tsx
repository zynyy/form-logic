import SchemeTableForm from './index';
import { useCreateForm, useFormSchema, useListSchema } from '@/hooks';
import { useRef, useState } from 'react';
import { TransformsSchemaOptions } from '@/transforms';
import { Form, IFormProps } from '@formily/core';

import User_C from '../low-code-meta/model-page/user/User_C.json';
import User_Group_C from '../low-code-meta/model-page/user/User_Group_C.json';
import User_ArrayTable_C from '../low-code-meta/model-page/user/User_ArrayTable_C.json';
import User_Tabs_C from '../low-code-meta/model-page/user/User_Tabs_C.json';
import { uid } from '@formily/shared';

import { flushSync } from 'react-dom';

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

const Template = ({ hasGroup, pattern, metaSchema, ...args }) => {
  const formRef = useRef<Form>();

  const [dataSource, setDataSource] = useState([]);

  const [values, setValues] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [total, setTotal] = useState(0);

  const [form]=useCreateForm()

  const [options] = useState<TransformsSchemaOptions>(() => {
    return {
      metaSchema: metaSchema,
      hasGroup: hasGroup,
      pattern: pattern,
      buttonsEvent: {},
      logic: {},
    };
  });

  const [formConfig] = useState<IFormProps>(() => {
    return {
      initialValues: {},
    };
  });

  const { tableSchema } = useListSchema(options);

  const handleSubmitClick = () => {
    formRef.current.validate('*');
  };

  const rowSelection = {
    onChange: (rowKey, selectedRows) => {
      setValues(selectedRows);
    },
  };

  const handleAddClick = () => {
    setDataSource(
      Array.from(
        {
          length: 29,
        },
        () => {
          return {
            uid: uid(8),
          };
        },
      ),
    );

    setTotal(100);
  };

  const handleRemoveClick = () => {};

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { action } = extra || {};

    if (action === 'paginate') {
      setCurrentPage(pagination.current);
      setPageSize(pagination.pageSize);
    }
  };

  return (
    <>
      <SchemeTableForm
        form={form}
        rowSelection={rowSelection}
        selectedRows={values}
        {...args}
        dataSource={dataSource}
        schema={tableSchema}
        onAdd={handleAddClick}
        onRemove={handleRemoveClick}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onChange={handleTableChange}      />
    </>
  );
};

export const arrayTable = Template.bind({});

arrayTable.args = {
  metaSchema: User_ArrayTable_C,
  hasGroup: false,
  hasRowSelection: true,
  rowKey: 'uid',
};
