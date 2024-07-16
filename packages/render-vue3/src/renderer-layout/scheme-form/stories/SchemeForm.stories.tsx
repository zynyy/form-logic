

import { onFieldInit, onFieldInputValueChange, useCreateForm } from '@formlogic/render-core-vue3';
import { ref, watchEffect } from 'vue';

import { useFormSchema } from '@/hooks';

import User_ArrayTable_C from '@/low-code-meta/model-page/user/User_ArrayTable_C.json';
import User_C from '@/low-code-meta/model-page/user/User_C.json';
import User_Card_Tabs from '@/low-code-meta/model-page/user/User_Card_Tabs.json';
import User_Group_C from '@/low-code-meta/model-page/user/User_Group_C.json';
import User_Object_C from '@/low-code-meta/model-page/user/User_Object_C.json';
import User_Tabs_C from '@/low-code-meta/model-page/user/User_Tabs_C.json';
import SchemeForm from '../SchemeForm';
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'SchemeForm',
  component: SchemeForm,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const render = ({ metaSchema, pattern, hasGroup }) => ({
  components: { SchemeForm },
  setup() {
    //👇 The args will now be passed down to the template

    const formSchemaRef = useFormSchema(ref({ pattern, metaSchema, hasGroup }));

    const [form] = useCreateForm(
      ref({
        formConfig: {
          values: {
            name: 111,
          },
          // designable: true
        },
      }),
    );

    watchEffect((onCleanup) => {
      form.value.addEffects('demo', () => {
        onFieldInit('name', (field, form) => {
          field.setContent({
            suffix: (...a: any[]) => {
              return <span>888</span>;
            },
          });
        });

        // onFieldInit('school.name', (field) => {
        //   setTimeout(() => {
        //     field.visible = false;
        //   }, 2000);
        //
        //   setTimeout(() => {
        //     field.visible = true;
        //   }, 3000);
        // });

        onFieldInputValueChange('name', (field, form) => {
          console.log(field.value, '111');

          form.query('code').take((target) => {
            target.setDecoratorProps({
              label: field.value,
            });

            target.setComponentProps({
              suffix: field.value ? 'RMB' : '',
            });
          });

          form.query('basicInfo.add').take((target) => {
            target.setContent({
              icon: () => {
                return '新增';
              },
            });
          });

          form.query('componentProps').take((target) => {
            target.setComponentProps({
              pageCode: field.value ? 'Api_C' : 'Test_C',
            });
          });

          form.setValuesIn('code', field.value);
        });

        onFieldInputValueChange('test', (field, form) => {
          form.query('tabsInfoTabs').take((target) => {
            target.setComponentProps({
              activeKey: 'personalInfo',
            });
          });
        });
      });

      onCleanup(() => {
        form.value.removeEffects('demo');
      });
    });

    const { schema } = formSchemaRef.value;
    return () => {
      return <SchemeForm form={form.value} schema={schema} />;
    };
  },
});

export const editable = {
  render,
  args: {
    metaSchema: User_C,
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

export const cardTabs = {
  render,
  args: {
    metaSchema: User_Card_Tabs,
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
