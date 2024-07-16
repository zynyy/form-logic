import { createBehavior, createResource, TreeNode } from '@formlogic/designer-core';
import { toJS } from '@formily/reactive';
import { merge } from '@formily/shared';
import { Input as ElInput } from 'element-ui';
import { isEmpty } from 'lodash-es';

import { createFieldSchema } from '@/stories/components/shared';
import { withComponentWarp } from '@/stories/prototypes/Container';
import { composeExport } from '@/utils';

import { AllLocales } from '../../locales';
import { AllSchemas } from '../../schemas';

const COMPONENT_NAMES = {
  input: 'Input',
  inputTextArea: 'InputTextArea',
};

export const Input = composeExport(withComponentWarp(ElInput), {
  Behavior: createBehavior(
    {
      name: COMPONENT_NAMES.input,
      selector: (node) => {
        return (
          node.componentName === COMPONENT_NAMES.input &&
          node.props?.componentProps?.type !== 'textarea'
        );
      },
      designerProps: (node) => {
        const isAgColumn = false;

        return {
          getDropNodes(node: TreeNode, parent: TreeNode) {
            if (isEmpty(node.props.code)) {
              node.setInitProps(merge({}, node.designerProps.defaultProps, toJS(node.props)));
            }
            return node;
          },
          propsSchema: createFieldSchema(AllSchemas.Input, {
            colSpan: true,
            isAgColumn,
          }),
          defaultProps: {
            code: Math.random(),
            name: `文本框${Math.random()}`,
            type: 'column',
            schemaType: 'string',
            colSpan: 2,
            component: 'Input',
            componentProps: {
              clearable: true,
              placeholder: '请输入',
            },
          },
        };
      },
      designerLocales: AllLocales.Input,
    },
    {
      name: COMPONENT_NAMES.inputTextArea,
      selector: (node) => {
        return (
          node.componentName === COMPONENT_NAMES.input &&
          node.props?.componentProps?.type === 'textarea'
        );
      },
      designerProps(node) {
        const isAgColumn = false;
        return {
          getDropNodes(node: TreeNode, parent: TreeNode) {
            if (isEmpty(node.props.code)) {
              node.setInitProps(merge({}, node.designerProps.defaultProps, toJS(node.props)));
            }
            return node;
          },
          propsSchema: createFieldSchema(AllSchemas.TextArea, {
            colSpan: true,
            isAgColumn,
          }),
          defaultProps: {
            code: Math.random(),
            name: '文本域',
            type: 'column',
            schemaType: 'string',
            component: 'Input',
            colSpan: 2,
            componentProps: {
              rows: 1,
              type: 'textarea',
              clearable: true,
              placeholder: '请输入',
            },
          },
        };
      },
      designerLocales: AllLocales.InputTextArea,
    },
  ),
  Resource: createResource(
    {
      icon: 'InputSource',
      elements: [
        {
          componentName: COMPONENT_NAMES.input,
          props: {
            componentProps: {
              type: 'text',
            },
          },
        },
      ],
    },
    {
      icon: 'TextAreaSource',
      title: '文本域',
      elements: [
        {
          componentName: COMPONENT_NAMES.input,
          props: {
            componentProps: {
              type: 'textarea',
            },
          },
        },
      ],
    },
  ),
});
