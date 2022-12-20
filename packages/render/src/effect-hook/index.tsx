import {
  createEffectHook,
  onFieldMount,
  onFieldInit,
  onFieldInputValueChange,
  onFieldChange,
  onFieldInitialValueChange,
  onFieldReact,
  onFormUnmount,
  onFormValuesChange,
  onFormInputChange,
  onFormSubmit,
} from '@formily/core';

export const CUSTOM_EVENT = 'onCustomEvent';
export const DRAWER_OPEN = 'onDrawerOpen';
export const DRAWER_CLOSE = 'onDrawerClose';

export const MODAL_OPEN = 'onModalOpen';
export const MODAL_CLOSE = 'onModalClose';

export const BIND_LOGIC_START = 'onBindLogicStart';

export const BIND_LOGIC_END = 'onBindLogicEnd';

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

export default {
  onFormUnmount,
  onFormValuesChange,
  onFormInputChange,
  onFormSubmit,
  onFieldInit,
  onFieldMount,
  onFieldInputValueChange,
  onFieldChange,
  onFieldInitialValueChange,
  onFieldReact,
  onCustomEvent,
  onDrawerOpen,
  onDrawerClose,
  onModalOpen,
  onModalClose,
  onBindLogicStart,
  onBindLogicEnd,
};
