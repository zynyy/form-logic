import { createSchemaField } from '@/formily-vue';

import { Space } from 'ant-design-vue';
import FormLayout from '@/components/form-layout';
import FormGroup from '@/components/form-group';
import FormGrid from '@/components/form-grid';
import FormItem from '@/components/form-item';
import TestInput from '@/components/input';
import CustomButton from '@/components/custom-button';
import Select from '@/components/select';
import ArrayTable from "@/components/array-table/ArrayTable";
import ArrayBase from "@/components/array-base/ArrayBase";
import DynamicSchema from "@/components/dynamic-schema";
import PopoverBtn from "@/components/popover-btn";
import FormTabsGroup from "@/components/form-tabs-group";
import ListTable from "@/components/list-table";

const useCreateSchemaField = () => {
  const { SchemaField } = createSchemaField({
    components: {
      Space,
      Input: TestInput,
      FormItem,
      Select,
      FormLayout,
      FormGrid,
      FormGroup,
      Button: CustomButton,
      ArrayTable,
      ArrayBase,
      DynamicSchema,
      PopoverBtn,
      FormTabsGroup,
      ListTable
    },
  });

  return SchemaField;
};

export default useCreateSchemaField;
