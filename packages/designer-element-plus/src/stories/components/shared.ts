import { ISchema } from '@formily/json-schema';

export interface SchemaOptions {
  colSpan?: boolean;
  subCode?: boolean;
  required?: boolean;
  disabled?: boolean;
  isAgColumn?: boolean;
}

export const createFiledConfigSchema = (options?: SchemaOptions) => {
  const { colSpan, required, isAgColumn, disabled } = options || {};

  return {
    configDivider: {
      type: 'void',
      'x-component': 'Divider',
      'x-component-props': {
        description: '字段配置',
      },
      title: '分割线',
    },
    required: {
      type: 'string',
      title: '输入必填',
      'x-hidden': !required,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 6,
      },
      'x-component': 'Switch',
      'x-component-props': {},
    },
    hidden: {
      type: 'string',
      title: '隐藏字段',
      'x-hidden': isAgColumn,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 6,
      },
      'x-component': 'Switch',
      'x-component-props': {},
    },
    disabled: {
      type: 'string',
      title: '输入禁用',
      'x-hidden': !disabled,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 6,
      },
      'x-component': 'Switch',
      'x-component-props': {},
    },
    hiddenName: {
      type: 'string',
      title: '隐藏标题',
      'x-hidden': isAgColumn,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 6,
      },
      'x-component': 'Switch',
      'x-component-props': {},
    },
    description: {
      type: 'string',
      title: '补充描述',
      'x-hidden': isAgColumn,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'Input',
      'x-component-props': {
        type: 'textarea',
      },
    },
    colSpan: {
      type: 'string',
      title: '跨列',
      'x-hidden': !colSpan || isAgColumn,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'Slider',
      'x-component-props': {
        max: 12,
        min: 1,
        marks: {
          12: '',
        },
      },
    },
    component: {
      type: 'string',
      title: '组件',
      'x-disabled': true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'Input',
      'x-component-props': {},
    },
  };
};

export const createLogicAndValidateSchema = (showValidator?: boolean) => {
  return {
    logicDivider: {
      type: 'void',
      'x-component': 'Divider',
      'x-component-props': {
        description: '逻辑配置',
      },
      title: '分割线',
    },
    logicConfig: {
      type: 'void',
      'x-component': 'Space',
      properties: {
        logics: {
          type: 'string',
          title: '逻辑配置',
          'x-component': 'Input',
        },
        validator: {
          type: 'string',
          title: '验证配置',
          'x-hidden': !showValidator,
          'x-component': 'Input',
        },
      },
    },
  };
};

export const createComponentSchema = (component: ISchema) => {
  if (!component) {
    return {};
  }

  return {
    componentDivider: {
      type: 'string',
      'x-component': 'Divider',
      'x-component-props': {
        description: '组件配置',
      },
      title: '分割线',
    },
    componentProps: component,
  };
};

export const createFieldSchema = (component?: ISchema, options?: SchemaOptions): ISchema => {
  const { subCode, isAgColumn } = options || {};
  return {
    type: 'object',
    properties: {
      basicDivider: {
        type: 'string',
        'x-component': 'Divider',
        'x-hidden': isAgColumn,
        'x-component-props': {
          description: '字段绑定',
        },
        title: '分割线',
      },
      code: {
        type: 'string',
        title: '元字段编码',
        'x-hidden': isAgColumn,
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
      subCode: {
        type: 'string',
        title: '元字段副编码',
        'x-decorator': 'FormItem',
        'x-hidden': !subCode || isAgColumn,
        'x-decorator-props': {
          gridSpan: 12,
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请选择编码',
          clearable: true,
          multiple: true,
        },
      },
      name: {
        type: 'string',
        title: '元字段名称',
        'x-hidden': isAgColumn,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 12,
        },
        'x-component': 'Input',
        'x-disabled': true,
        'x-component-props': {
          placeholder: '请输入名称',
          clearable: true,
        },
      },
      authCode: {
        type: 'string',
        title: '权限编码',
        'x-hidden': isAgColumn,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 12,
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入权限编码',
        },
      },
      defaultValue: {
        title: '默认值',
        'x-hidden': isAgColumn,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 12,
        },
        'x-component': 'Input',
      },
      ...createLogicAndValidateSchema(true),
      ...createFiledConfigSchema({
        disabled: true,
        required: true,
        ...options,
      }),
      ...createComponentSchema(component),
    },
  };
};

export const createVoidFieldSchema = (component?: ISchema) => {
  return {
    type: 'object',
    properties: {
      basicDivider: {
        type: 'string',
        'x-component': 'Divider',
        'x-component-props': {
          description: '字段绑定',
        },
        title: '分割线',
      },
      code: {
        type: 'string',
        title: '元字段编码',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 12,
          tooltip: '只能输入以字母开头并且只能输入字母 数字 . _的编码',
        },
        'x-component': 'InputCode',
        'x-component-props': {
          clearable: true,
        },
      },
      name: {
        type: 'string',
        title: '元字段名称',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 12,
        },
        'x-component': 'Input',
        'x-component-props': {
          clearable: true,
        },
      },
      authCode: {
        type: 'string',
        title: '权限编码',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 12,
        },
        'x-component': 'Input',
        'x-component-props': {
          clearable: true,
        },
      },
      ...createLogicAndValidateSchema(),
      ...createFiledConfigSchema({}),
      ...createComponentSchema(component),
    },
  };
};
