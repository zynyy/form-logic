import { useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import FormLayout from '@/components/form-layout';
import FormGroup from '@/components/form-group';
import FormGrid from '@/components/form-grid';
import FormItem from '@/components/form-item';
import Input from '@/components/input';
import Select from '@/components/select';
import ArrayTable from '@/components/array-table';
import Fragment from '@/components/fragment';
import Button from '@/components/button';
import ArrayBase from '@/components/array-base';
import { Input as AntdInput, Space } from 'antd';
import FormTabsGroup from '@/components/form-tabs-group';
import ListTable from '@/components/list-table';

const { Password } = AntdInput;

const useCreateSchemaField = () => {
  return useMemo(() => {
    return createSchemaField({
      components: {
        FormLayout,
        FormGroup,
        FormGrid,
        FormItem,
        Input,
        Select: Select,
        ArrayTable,
        Fragment,
        Button,
        ArrayBase,
        Space,
        FormTabsGroup,
        ListTable,
        Password,
      },
    });
  }, []);
};

export default useCreateSchemaField;
