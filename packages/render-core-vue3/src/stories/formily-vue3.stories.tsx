import {
  FormProvider,
  onFieldInputValueChange,
  useCreateForm,
  useCreateSchemaField,
} from '@formlogic/render-core-vue3';
import { clone } from '@formily/shared';
import {
  ElConfigProvider,
  ElDatePicker,
  ElDivider,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
} from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ref, unref } from 'vue';

import CubeSelect from './components/Select';

const components = {
  Input: ElInput,
  Select: ElSelect,
  DatePicker: ElDatePicker,
  Divider: ElDivider,
  FormItem: ElFormItem,
  CubeSelect,
};

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Formily-vue3',
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
          },
          effects() {
            effects?.();
          },
          pattern: 'readOnly',
        },
      }),
    );

    return () => {
      const formId = unref(form).id;

      return (
        <ElConfigProvider locale={zhCn}>
          <FormProvider key={formId} form={unref(form)}>
            <ElForm
              class={`form-id-${formId}`}
              style={{
                height: '100%',
              }}
            >
              <SchemaField schema={clone(schema)} components={components ?? {}} />
            </ElForm>
          </FormProvider>
        </ElConfigProvider>
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
        CubeSelect: {
          type: 'string',
          'x-component': 'CubeSelect',
          'x-component-props': {
            dataSource: [
              {
                label: '测试',
                value: 'demo',
              },
            ],
            onChange(val, record) {
              console.log(val, record, 'onChange');
            },
          },
          title: '分割线',
        },
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
        start: {
          type: 'string',
          title: '元字段编码',

          'x-decorator-props': {
            gridSpan: 12,
          },
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: '请选择编码',
            clearable: true,
            type: 'daterange',
            format: 'YYYY-MM-DD',
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
