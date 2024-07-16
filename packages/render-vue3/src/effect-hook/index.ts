import {
  createEffectHook,
  onFieldChange,
  onFieldInit,
  onFieldInitialValueChange,
  onFieldInputValueChange,
  onFieldMount,
  onFieldReact,
  onFieldUnmount,
  onFieldValueChange,
  onFormInputChange,
  onFormSubmit,
  onFormUnmount,
  onFormValuesChange,
} from '@formlogic/render-core-vue3';

export const CUSTOM_EVENT = 'onCustomEvent';
export const DRAWER_OPEN = 'onDrawerOpen';
export const DRAWER_CLOSE = 'onDrawerClose';

export const MODAL_OPEN = 'onModalOpen';
export const MODAL_CLOSE = 'onModalClose';

export const BIND_LOGIC_START = 'onBindLogicStart';

export const BIND_LOGIC_END = 'onBindLogicEnd';

export const EXEC_LOGIC_DONE = 'onExecLogicDone';
export const TRANSFORMS_OPTIONS_CHANGE = 'onTransformOptionsChange';

export const COMPONENT_DATA_SOURCE_CHANGE = 'onComponentDataSourceChange';

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

const onComponentDataSourceChange = createEffectHook(
  COMPONENT_DATA_SOURCE_CHANGE,
  (payload, form) => {
    return (listener) => {
      listener(payload, form);
    };
  },
);

export {
  onBindLogicEnd,
  onBindLogicStart,
  onComponentDataSourceChange,
  onCustomEvent,
  onDrawerClose,
  onDrawerOpen,
  onExecLogicDone,
  onFieldChange,
  onFieldInit,
  onFieldInitialValueChange,
  onFieldInputValueChange,
  onFieldMount,
  onFieldReact,
  onFieldUnmount,
  onFieldValueChange,
  onFormInputChange,
  onFormSubmit,
  onFormUnmount,
  onFormValuesChange,
  onModalClose,
  onModalOpen,
  onTransformOptionsChange,
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
  onComponentDataSourceChange,
};
