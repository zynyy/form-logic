import { ExtractPropTypes, PropType, Ref } from 'vue';
import { UploadChangeParam } from 'ant-design-vue';
import { ArrayField, Form, VoidField } from '@formily/core';

type Key = string | number;

export const getRowSelectedProps = () => {
  return {
    selectedRowKeys: {
      type: Array as PropType<Key[]>,
    },
    setSelectedRowKeys: {
      type: Function as PropType<(selectedRowKeys: Key[]) => void>,
    },
    selectedRows: {
      type: Array as PropType<any[]>,
    },
    setSelectedRows: {
      type: Function as PropType<(selectedRows: any[]) => void>,
    },
  };
};

export type RowSelected = ExtractPropTypes<ReturnType<typeof getRowSelectedProps>>;

export interface ModelsFiled {
  field: VoidField;
  form: Form;
  arrayField: ArrayField;
}

export const getArrayBaseEvent = () => {
  return {
    onAdd: {
      type: Function as PropType<(modelsFiled: ModelsFiled) => void>,
    },
    onEdit: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
    onRemove: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
    onBatchRemove: {
      type: Function as PropType<(rowSelected: RowSelected, modelsFiled: ModelsFiled) => void>,
    },
    onCopy: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
    onMoveDown: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
    onMoveUp: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
    onDetail: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
    onUpload: {
      type: Function as PropType<(info: UploadChangeParam, modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayBaseProps = () => {
  return {
    ...getRowSelectedProps(),
    ...getArrayBaseEvent(),
  };
};

export const getArrayBaseItemProps = () => {
  return {
    index: {
      type: Number,
      required: true,
    },
    record: {
      type: null,
      required: true,
    },
  };
};

export const getPreviewTextProps = () => {
  return {
    colDataIndex: String,
    value: null,
  };
};

export const getArrayMoveDownProps = () => {
  return {
    onClick: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayMoveUpProps = () => {
  return {
    onClick: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayCopyProps = () => {
  return {
    onClick: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayEditProps = () => {
  return {
    onClick: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayRemoveProps = () => {
  return {
    onClick: {
      type: Function as PropType<(index: number, record: any, modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayBatchRemoveProps = () => {
  return {
    onClick: {
      type: Function as PropType<(rowSelected: RowSelectedProps, modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayAddProps = () => {
  return {
    onClick: {
      type: Function as PropType<(modelsFiled: ModelsFiled) => void>,
    },
  };
};

export const getArrayBaseUploadProps = () => {

  return  {

  }
}

export type ArrayBaseProps = ExtractPropTypes<ReturnType<typeof getArrayBaseProps>>;
export type RowSelectedProps = ExtractPropTypes<ReturnType<typeof getRowSelectedProps>>;
export type ArrayBaseItemProps = ExtractPropTypes<ReturnType<typeof getArrayBaseItemProps>>;
export type ArrayBaseEvent = ExtractPropTypes<ReturnType<typeof getArrayBaseEvent>>;
export type ArrayMoveDownProps = ExtractPropTypes<ReturnType<typeof getArrayMoveDownProps>>;
export type ArrayMoveUpProps = ExtractPropTypes<ReturnType<typeof getArrayMoveUpProps>>;
export type PreviewTextProps = ExtractPropTypes<ReturnType<typeof getPreviewTextProps>>;
export type ArrayCopyProps = ExtractPropTypes<ReturnType<typeof getArrayCopyProps>>;
export type ArrayEditProps = ExtractPropTypes<ReturnType<typeof getArrayEditProps>>;
export type ArrayRemoveProps = ExtractPropTypes<ReturnType<typeof getArrayRemoveProps>>;
export type ArrayBatchRemoveProps = ExtractPropTypes<ReturnType<typeof getArrayBatchRemoveProps>>;
export type ArrayAddProps = ExtractPropTypes<ReturnType<typeof getArrayAddProps>>;
export type ArrayBaseUploadProps  = ExtractPropTypes<ReturnType<typeof getArrayBaseUploadProps>>;
