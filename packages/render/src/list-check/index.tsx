import SchemaLayout from '@/components/schema-layout/SchemaLayout';
import WhereLayout from '@/components/schema-layout/WhereLayout';
import SchemeForm from '@/scheme-form';
import { useImperativeHandle, useRef, useState } from 'react';
import { MetaSchema } from '@/interface';
import { ArrayField, Form, IFormProps, isField } from '@formily/core';
import { useListSchema } from '@/hooks';
import { Button, Space, Spin } from 'antd';

import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { getSubmitFormValues } from '@/utils/getSubmitFormValues';

export interface ListCheckProps {
  metaSchema?: MetaSchema;
  searchFormConfig?: IFormProps;
}

export interface ListCheckRef {}

const ListCheck = ({ metaSchema, searchFormConfig }, ref) => {
  const [loading, setLoading] = useState(false);

  const [options] = useState(() => {
    return {
      metaSchema,
    };
  });

  const searchFormRef = useRef<Form>();
  const dataTableFormRef = useRef<Form>();

  const { searchSchema, tableSchema, hasCollapsed } = useListSchema(options);

  const initSearch = () => {
    handleSearch();
  };

  useImperativeHandle(ref, () => {
    return {};
  });

  const handleRestClick = () => {
    searchFormRef.current.reset();
  };

  const handleCollapsedClick = (collapsed: boolean) => {
    searchFormRef.current.query('*').forEach((target) => {
      if (isField(target) && target?.data?.hiddenSearchColumn) {
        target.setDisplay(collapsed ? 'visible' : 'hidden');
        if (collapsed) {
          target.reset();
        }
      }
    });
  };

  const handleSearch = () => {
    getSubmitFormValues(searchFormRef.current).then((formValues) => {
      dataTableFormRef.current.query('dataSource').take((target: ArrayField) => {
        target.onInput([
          {
            code: 1,
          },
        ]);
      });
    });
  };

  return (
    <Spin spinning={loading}>
      <SchemaLayout
        header={
          <WhereLayout
            title="搜索条件"
            onCollapsedClick={handleCollapsedClick}
            hasCollapsed={hasCollapsed}
            buttons={
              <Space>
                <Button icon={<ClearOutlined />} type="dashed" onClick={handleRestClick}>
                  重置
                </Button>
                <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>
                  搜索
                </Button>
              </Space>
            }
          >
            <SchemeForm schema={searchSchema} ref={searchFormRef} formConfig={searchFormConfig} />
          </WhereLayout>
        }
      >
        <SchemeForm schema={tableSchema} ref={dataTableFormRef} />
      </SchemaLayout>
    </Spin>
  );
};

export default ListCheck;
