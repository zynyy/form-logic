import { getFullFilePath } from '@/utils';

const templatePath = getFullFilePath(import.meta.url, './template');

export default {
  description: '快速创建 vue3 子包',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入包的名称，必须是独一无二的名称:',
      validate(value: string) {
        if (!value || value.trim() === '') {
          return '名称必填！';
        }
        if (!/^[a-z][a-z\-]*$/.test(value)) {
          return '组件名称必须字母开头、仅包含小写字母、-';
        }

        return true;
      },
    },
  ],
  actions: (data: any) => {
    // 首字母大写

    const { name } = data;
    const filePrefix = `${process.cwd()}/packages/${name}`;

    return [
      {
        type: 'add',
        path: `${filePrefix}/package.json`,
        templateFile: `${templatePath}/package.json.hbs`,
        data: {
          name,
        },
      },
      {
        type: 'add',
        path: `${filePrefix}/formlogic.config.mjs`,
        templateFile: `${templatePath}/formlogic.config.mjs.hbs`,
        data: {
          name,
        },
      },
      {
        type: 'copy-file',
        path: `${filePrefix}`,
        templateFile: `${templatePath}/copy-directory`,
        data: {
          name,
        },
      },
      {
        type: 'prettier-git',
        data: {
          files: [filePrefix],
        },
      },
    ];
  },
};
