import LogicEffectHookProcess from './index';
import { useState } from 'react';
import { Button } from 'antd';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'logic-effect-hook',
  component: LogicEffectHookProcess,
  argTypes: {
    config: {
      description: '页面流程逻辑配置',
    },
  },
};

const Template = (args) => {
  const [graph, setGraph] = useState();

  const handleClick = () => {
    console.log(graph);
  };

  return (
    <>
      <Button onClick={handleClick}> 点击提交 </Button>

      <LogicEffectHookProcess {...args} onGraphMount={setGraph} />
    </>
  );
};

export const DETAIL = Template.bind({});

DETAIL.args = {
  pageCode: 'Component_C',
  modelCode: 'Component',
  pattern: 'DETAIL',
  pageDataSource: [
    {
      type: 'column',
      code: 'code',
      name: '组件编码',
    },
    {
      type: 'column',
      code: 'name',
      name: '组件名称',
    },
    {
      type: 'column',
      code: 'componentPropsPageCode',
      name: '属性编码',
    },
  ],
  effectHookSource: [
    {
      name: '字段事件',
      key: 'field',
      options: [
        { name: '字段初始化', code: 'onFieldInit' },
        { name: '字段挂载', code: 'onFieldMount' },
        { name: '字段值输入变化', code: 'onFieldInputValueChange' },
        { name: '字段值变化', code: 'onFieldValueChange' },
        { name: '字段属性变化', code: 'onFieldChange' },
        { name: '字段依赖数据变化', code: 'onFieldReact' },
      ],
    },
    {
      name: '鼠标事件',
      key: 'mouse',
      options: [{ name: '点击', code: 'onClick' }],
    },
    {
      name: '表单事件',
      key: 'form',
      options: [
        { name: '表单值输入变化', code: 'onFormInputChange' },
        { name: '表单值变化', code: 'onFormcodesChange' },
      ],
    },
  ],
  logics: [
    {
      fieldCode: 'code',
      fieldName: '组件编码',
      logicCode: 'ModelPage_C_modelToDisabled',
      effectHook: 'onFieldMount',
      fieldType: 'column',
    },
  ],
};

export const EDITABLE = Template.bind({});

EDITABLE.args = {
  pageCode: 'Component_C',
  modelCode: 'Component',
  pattern: 'EDITABLE',
  pageDataSource: [
    {
      type: 'column',
      code: 'code',
      name: '组件编码',
    },
    {
      type: 'column',
      code: 'name',
      name: '组件名称',
    },
    {
      type: 'column',
      code: 'componentPropsPageCode',
      name: '属性编码',
    },
  ],
  effectHookSource: [
    {
      name: '字段事件',
      key: 'field',
      options: [
        { name: '字段初始化', code: 'onFieldInit' },
        { name: '字段挂载', code: 'onFieldMount' },
        { name: '字段值输入变化', code: 'onFieldInputValueChange' },
        { name: '字段值变化', code: 'onFieldValueChange' },
        { name: '字段属性变化', code: 'onFieldChange' },
        { name: '字段依赖数据变化', code: 'onFieldReact' },
      ],
    },
    {
      name: '鼠标事件',
      key: 'mouse',
      options: [{ name: '点击', code: 'onClick' }],
    },
    {
      name: '表单事件',
      key: 'form',
      options: [
        { name: '表单值输入变化', code: 'onFormInputChange' },
        { name: '表单值变化', code: 'onFormcodesChange' },
      ],
    },
  ],
  logics: [
    {
      fieldCode: 'code',
      fieldName: '组件编码',
      logicCode: 'ModelPage_C_modelToDisabled',
      effectHook: 'onFieldMount',
      fieldType: 'column',
    },
  ],
};
