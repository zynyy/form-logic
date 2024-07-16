import { useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import FormLayout from '@/components/form-layout';
import FormGroup from '@/components/form-group';
import FormGrid from '@/components/form-grid';
import FormItem from '@/components/form-item';

import Space from '@/components/space';
import {
  Input,
  StaticSelect,
  InputNumber,
  RemoteSelect,
  TextArea,
  CustomButton,
  YesOrNoCheckbox,
} from '@formlogic/component';

import ArrayTable from '@/components/array-table';
import Fragment from '@/components/fragment';

import ArrayBase from '@/components/array-base';

import FormTabsGroup from '@/components/form-tabs-group';
import ListTable from '@/components/list-table';

import PopoverBtn from '@/components/popover-btn';

import DynamicSchema from '@/components/dynamic-schema';
import PopoverContainer from '@/components/popover-container';
import ArrayDrawerTable from '@/components/array-drawer-table';

const useCreateSchemaField = () => {
  return useMemo(() => {
    return createSchemaField({
      components: {
        FormLayout,
        FormGroup,
        FormGrid,
        FormItem,
        ArrayTable,
        Fragment,
        Button: CustomButton,
        ArrayBase,
        Space,
        FormTabsGroup,
        ListTable,
        StaticSelect,
        RemoteSelect,
        Input,
        InputNumber,
        TextArea,
        PopoverBtn,
        DynamicSchema,
        PopoverContainer,
        ArrayDrawerTable,
        YesOrNoCheckbox,
      },
    });
  }, []);
};

export default useCreateSchemaField;
