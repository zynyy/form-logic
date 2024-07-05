import { getFullFilePath } from '@/utils';
import { camelCaseToHyphen } from '@/utils';

import { toPascalCase } from '@formlogic/package-compiler';

const templatePath = getFullFilePath(import.meta.url, './template');

export default {
  description: '快速创建组件',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入组件的名称，必须是独一无二的名称:',
      validate(value: string) {
        if (!value || value.trim() === '') {
          return '名称必填！';
        }
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
          return '组件名称必须字母开头、仅包含大小写字母+数字';
        }

        return true;
      },
    },
  ],
  actions: (data: any) => {
    // 首字母大写

    const componentName = toPascalCase(data.name);

    const componentPath = camelCaseToHyphen(componentName);

    const componentsPath = `${process.cwd()}/src/components`;

    const filePrefix = `${componentsPath}/${componentPath}`;

    return [
      {
        type: 'add',
        path: `${filePrefix}/interface.ts`,
        templateFile: `${templatePath}/interface.ts.hbs`,
        data: {
          componentName,
        },
      },
      {
        type: 'add',
        path: `${filePrefix}/${componentName}.tsx`,
        templateFile: `${templatePath}/component.ts.hbs`,
        data: {
          componentName,
        },
      },
      {
        type: 'add',
        path: `${filePrefix}/index.ts`, // 这里的name就是上面定义的键
        templateFile: `${templatePath}/index.ts.hbs`,
        data: {
          componentName,
        },
      },
      {
        type: 'add',
        path: `${filePrefix}/stories/${componentName}.stories.tsx`,
        templateFile: `${templatePath}/stories.ts.hbs`,
        data: {
          componentName,
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
