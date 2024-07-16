export const Input = {
  type: 'object',
  properties: {
    placeholder: {
      type: 'string',
      title: '提示文本占位符',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'Input',
      'x-component-props': {
        clearable: true,
        placeholder: '请输入',
      },
    },
    clearable: {
      type: 'boolean',
      title: '清空功能',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-decorator-props': {
        gridSpan: 12,
      },
    },
    maxlength: {
      type: 'number',
      title: '最大输入长度',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: '请输入正整数',
      },
    },
    minlength: {
      type: 'number',
      title: '最小输入长度',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: '请输入正整数',
      },
    },
    showWordLimit: {
      type: 'boolean',
      title: '是否显示输入字数统计',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {},
      'x-decorator-props': {
        gridSpan: 12,
      },
    },
    // prefixIcon: {
    //   type: 'string',
    //   title: '输入框头部图标',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'IconInput',
    //   'x-component-props': {},
    //   'x-decorator-props': {
    //     gridSpan: 12
    //   }
    // },
    // suffixIcon: {
    //   type: 'string',
    //   title: '输入框尾部图标',
    //   'x-decorator': 'FormItem',
    //   'x-decorator-props': {
    //     gridSpan: 12
    //   },
    //   'x-component': 'IconInput',
    //   'x-component-props': {}
    // }
  },
};

export const TextArea = {
  type: 'object',
  properties: {
    placeholder: {
      type: 'string',
      title: '占位符',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'Input',
      'x-component-props': {
        clearable: true,
        placeholder: '请输入',
      },
    },
    clearable: {
      type: 'boolean',
      title: '清空功能',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-decorator-props': {
        gridSpan: 12,
      },
    },
    maxlength: {
      type: 'number',
      title: '最大输入长度',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: '请输入正整数',
      },
    },
    minlength: {
      type: 'number',
      title: '最小输入长度',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: '请输入正整数',
      },
    },
    showWordLimit: {
      type: 'boolean',
      title: '是否显示输入字数统计',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'Switch',
      'x-component-props': {},
    },
    rows: {
      type: 'number',
      title: '输入框行数',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
    autoSize: {
      type: 'boolean',
      title: '自适应内容高度',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 12,
      },
      'x-component': 'Switch',
    },
  },
};
