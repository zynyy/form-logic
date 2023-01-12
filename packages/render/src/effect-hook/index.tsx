import {
  createEffectHook,
  onFieldMount,
  onFieldInit,
  onFieldInputValueChange,
  onFieldChange,
  onFieldInitialValueChange,
  onFieldReact,
  onFieldUnmount,
  onFormUnmount,
  onFormValuesChange,
  onFormInputChange,
  onFormSubmit,
  onFieldValueChange,
} from '@formily/core';

export const CUSTOM_EVENT = 'onCustomEvent';
export const DRAWER_OPEN = 'onDrawerOpen';
export const DRAWER_CLOSE = 'onDrawerClose';

export const MODAL_OPEN = 'onModalOpen';
export const MODAL_CLOSE = 'onModalClose';

export const BIND_LOGIC_START = 'onBindLogicStart';

export const BIND_LOGIC_END = 'onBindLogicEnd';

export const EXEC_LOGIC_DONE = 'onExecLogicDone';
export const TRANSFORMS_OPTIONS_CHANGE = 'onTransformOptionsChange';

const onCustomEvent = createEffectHook(CUSTOM_EVENT, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onDrawerOpen = createEffectHook(DRAWER_OPEN, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onDrawerClose = createEffectHook(DRAWER_CLOSE, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onModalOpen = createEffectHook(MODAL_OPEN, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onModalClose = createEffectHook(MODAL_CLOSE, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onBindLogicStart = createEffectHook(BIND_LOGIC_START, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onBindLogicEnd = createEffectHook(BIND_LOGIC_END, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onExecLogicDone = createEffectHook(EXEC_LOGIC_DONE, (payload, form) => {
  return (listener) => {
    listener(payload, form);
  };
});

const onTransformOptionsChange = createEffectHook(TRANSFORMS_OPTIONS_CHANGE, (payload, form) => {

  return (listener) => {
    listener(payload, form);
  };
});

export {
  onFormUnmount,
  onFormValuesChange,
  onFormInputChange,
  onFormSubmit,
  onFieldInit,
  onFieldMount,
  onFieldInputValueChange,
  onFieldChange,
  onFieldInitialValueChange,
  onFieldValueChange,
  onFieldReact,
  onCustomEvent,
  onDrawerOpen,
  onDrawerClose,
  onModalOpen,
  onModalClose,
  onBindLogicStart,
  onBindLogicEnd,
  onExecLogicDone,
  onTransformOptionsChange,
  onFieldUnmount
};

export default {
  onFormUnmount,
  onFormValuesChange,
  onFormInputChange,
  onFormSubmit,
  onFieldInit,
  onFieldMount,
  onFieldInputValueChange,
  onFieldChange,
  onFieldUnmount,
  onFieldInitialValueChange,
  onFieldValueChange,
  onFieldReact,
  onCustomEvent,
  onDrawerOpen,
  onDrawerClose,
  onModalOpen,
  onModalClose,
  onBindLogicStart,
  onBindLogicEnd,
  onExecLogicDone,
  onTransformOptionsChange,

};
