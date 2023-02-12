import FormPageLayout from './FormPageLayout';

import User_C from '../low-code-meta/model-page/user/User_C.json';
import User_Group_C from '../low-code-meta/model-page/user/User_Group_C.json';
import User_ArrayTable_C from '../low-code-meta/model-page/user/User_ArrayTable_C.json';
import User_Tabs_C from '../low-code-meta/model-page/user/User_Tabs_C.json';
import User_Object_C from '../low-code-meta/model-page/user/User_Object_C.json';
import FieldMeta_C from '../low-code-meta/model-page/FieldMeta/FieldMeta_C.json';
import { ref, onMounted } from 'vue';

import getLogicConfig from '../low-code-meta/logic';

import '../style';

import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof FormPageLayout> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'FormPageLayout',
  component: FormPageLayout,
};

export default meta;
type Story = StoryObj<typeof FormPageLayout>;

const render = ({ metaSchema, pageCode, pattern, hasGroup }) => ({
  components: { FormPageLayout },
  setup() {
    //👇 The args will now be passed down to the template

    const formConfigRef = ref({});

    onMounted(() => {
      setTimeout(() => {
        formConfigRef.value = {
          values: {
            categorize: [{ name: 'test' }],
          },
        };
      }, 1000);
    });

    return () => {
      return (
        <FormPageLayout
          getLogicConfig={getLogicConfig}
          pageCode={pageCode}
          formConfig={formConfigRef.value}
        />
      );
    };
  },
});

export const editable = {
  render,
  args: {
    pageCode: 'FieldMeta_C',
    pattern: 'EDITABLE',
  },
};

export const disabled = {
  render,
  args: {
    metaSchema: User_C,
    pattern: 'DISABLED',
  },
};

export const DETAIL = {
  render,
  args: {
    metaSchema: User_C,
    pattern: 'DETAIL',
  },
};

export const noGroup = {
  render,
  args: {
    metaSchema: User_C,
    hasGroup: false,
  },
};

export const group = {
  render,
  args: {
    metaSchema: User_Group_C,
    hasGroup: true,
  },
};

export const arrayTable = {
  render,
  args: {
    metaSchema: User_ArrayTable_C,
    hasGroup: true,
  },
};

export const tabs = {
  render,
  args: {
    metaSchema: User_Tabs_C,
    hasGroup: true,
  },
};

export const object = {
  render,
  args: {
    metaSchema: User_Object_C,
    hasGroup: true,
  },
};
