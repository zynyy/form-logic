import './styles.less';

import { createForm, FormProvider, observer } from '@formlogic/render-vue2';
import { createBehavior, createResource } from '@formlogic/designer-core';
import { Form as ElForm } from 'element-ui';
import { computed, defineComponent, unref } from 'vue';

import { usePrefix } from '@/hooks';
import { composeExport } from '@/utils';

import { AllLocales } from '../../locales';

const FormilyForm = FormProvider;

const FormComponent = observer(
  defineComponent({
    name: 'DnForm',
    setup(props, { slots, attrs }) {
      const prefix = usePrefix('designable-form');
      const formRef = computed(() =>
        createForm({
          designable: true,
        }),
      );
      return () => {
        const form = unref(formRef);

        return (
          <FormilyForm className={prefix.value} form={form} attrs={attrs}>
            <ElForm>{slots.default?.()}</ElForm>
          </FormilyForm>
        );
      };
    },
  }),
);

export const Form = composeExport(FormComponent, {
  Behavior: createBehavior({
    name: 'Form',
    selector: (node) => {
      return node.componentName === 'Form';
    },
    designerProps(node) {
      return {
        draggable: !node.isRoot,
        cloneable: !node.isRoot,
        deletable: !node.isRoot,
        droppable: true,
        propsSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              title: '页面编码',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: 12,
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请选择编码',
                clearable: true,
              },
            },
            name: {
              type: 'string',
              title: '页面名称',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: 12,
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请选择编码',
                clearable: true,
              },
            },
          },
        },
        defaultProps: {
          labelCol: 6,
          wrapperCol: 24,
          colon: false,
          feedbackLayout: 'loose',
          size: 'default',
          layout: 'horizontal',
          tooltipLayout: 'icon',
          labelAlign: 'right',
          wrapperAlign: 'left',
          shallow: true,
          bordered: true,
        },
      };
    },
    designerLocales: AllLocales.Form,
  }),
  Resource: createResource({
    title: { 'zh-CN': '表单', 'en-US': 'Form' },
    icon: 'FormLayoutSource',
    elements: [],
  }),
});
