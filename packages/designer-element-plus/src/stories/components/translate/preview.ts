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
  input: 'Translate',
  inputTextArea: 'InputTextArea',
};

export const Translate = composeExport(withComponentWarp(ElInput), {
  Behavior: createBehavior({
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
        translatable: {
          x: true,
          y: true,
        },
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
          name: '文本框',
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
  }),
  Resource: createResource({
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
  }),
});
