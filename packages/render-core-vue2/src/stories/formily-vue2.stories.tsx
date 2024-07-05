import {
  FormProvider,
  onFieldInputValueChange,
  useCreateForm,
  useCreateSchemaField,
} from '@formlogic/render-core-vue2';
import { clone } from '@formily/shared';
import { Divider, Form, FormItem, Input, Select } from 'element-ui';
import { ref, unref } from 'vue';

import CubeSelect from './components/Select';

const components = {
  Input,
  Select,
  Divider,
  FormItem,
  CubeSelect,
};

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Formily-vue2',
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const render = ({ schema, effects }) => ({
  setup() {
    const SchemaField = useCreateSchemaField(components);

    const [form] = useCreateForm(
      ref({
        formConfig: {
          values: {
            name: '表单的值',
            start: '2021-01-01',
            end: '2021-01-02',
          },
          effects() {
            effects?.();
          },
        },
      }),
    );

    return () => {
      const formId = unref(form).id;

      return (
        <FormProvider key={formId} form={unref(form)}>
          <Form
            class={`form-id-${formId}`}
            style={{
              height: '100%',
            }}
          >
            <SchemaField schema={clone(schema)} components={components ?? {}} />
          </Form>
        </FormProvider>
      );
    };
  },
});

export const basic = {
  render,
  args: {
    effects() {
      onFieldInputValueChange('code', (field) => {
        field.query('CubeSelect').take((target) => {
          target.setComponentProps({
            dataSource: [
              {
                label: '测试Test',
                value: 'test',
                fieldValue: field.value,
              },
            ],
            apiConfig: {
              demo: field.value,
            },
            demo: 122,
          });
        });
      });
    },
    schema: {
      type: 'object',
      properties: {
        // CubeSelect: {
        //   type: 'string',
        //   'x-component': 'CubeSelect',
        //   'x-component-props': {
        //     dataSource: [
        //       {
        //         label: '测试',
        //         value: 'demo',
        //       },
        //     ],
        //     onChange(val, record) {
        //       console.log(val, record, 'onChange');
        //     },
        //   },
        //   title: '分割线',
        // },
        code: {
          type: 'string',
          title: '元字段编码',

          'x-decorator-props': {
            gridSpan: 12,
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请选择编码',
            clearable: true,
            type: 'textarea',
          },
        },
        // subCode: {
        //   type: 'string',
        //   title: '元字段副编码',
        //   'x-decorator-props': {
        //     gridSpan: 12,
        //   },
        //   'x-component': 'Input',
        //   'x-component-props': {
        //     placeholder: '请选择编码',
        //     clearable: true,
        //     multiple: true,
        //   },
        // },
        // name: {
        //   type: 'string',
        //   title: '元字段名称',
        //
        //   'x-decorator-props': {
        //     gridSpan: 12,
        //   },
        //   'x-component': 'Input',
        //   'x-disabled': true,
        //   'x-component-props': {
        //     placeholder: '请输入名称',
        //     clearable: true,
        //   },
        // },
        // authCode: {
        //   type: 'string',
        //   title: '权限编码',
        //
        //   'x-decorator-props': {
        //     gridSpan: 12,
        //   },
        //   'x-component': 'Input',
        //   'x-component-props': {
        //     placeholder: '请输入权限编码',
        //   },
        // },
        // defaultValue: {
        //   title: '默认值',
        //
        //   'x-decorator-props': {
        //     gridSpan: 12,
        //   },
        //   'x-component': 'Input',
        // },
      },
    },
  },
};
