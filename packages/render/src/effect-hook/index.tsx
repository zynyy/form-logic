import {
  createEffectHook,
  onFieldMount,
  onFieldInit,
  onFieldInputValueChange,
  onFieldChange,
  onFieldInitialValueChange,
  onFieldReact,
  onFormMount,
  onFormUnmount,
  onFormInit,
  onFormReact,
  onFormValuesChange,
  onFormInputChange,
  onFormSubmit,
} from '@formily/core';

export const CUSTOM_EVENT = 'onCustomEvent';
export const DRAWER_OPEN = 'onDrawerOpen';
export const DRAWER_CLOSE = 'onDrawerClose';

export const MODAL_OPEN = 'onModalOpen';
export const MODAL_CLOSE = 'onModalClose';

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

export default {
  onFormInit,
  onFormMount,
  onFormUnmount,
  onFormReact,
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
};
