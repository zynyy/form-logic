import { Dispatch, FC, Key, PropsWithChildren, SetStateAction } from 'react';

import { ArrayField } from '@formily/core';
import { useField, observer } from '@formily/react';

import cls from 'classnames';

import lodashOmit from 'lodash.omit';

import {
  ArrayBaseContext,
  ArrayItemContext,
  ArrayItemValueContext,
  useArrayContext,
} from './hooks/context';
import {
  useArrayBaseStyle,
  useArrayIndex,
  useArrayItemRecord,
} from '@/components/array-base/hooks';
import {
  SortableHandle,
  CustomButtonMode,
  PlusButton,
  UpButton,
  DownButton,
  EditButton,
  RemoveButton,
  DetailButton,
  UploadButton,
  CustomButtonProps,
  UploadButtonProps,
  CopyButton,
  CopyButtonProps,
  RemoveButtonProps,
  DownButtonProps,
  UpButtonProps,
  EditButtonProps,
  DetailButtonProps,
} from '@formlogic/component';
import { clone } from '@formily/shared';
import { UploadChangeParam } from 'antd/es/upload/interface';

const OmitKey = ['extraParams'];

export interface ArrayAdditionProps extends PropsWithChildren, CustomButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayUploadProps extends UploadButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
  value?: any;
}

export interface ArrayCopyProps extends CopyButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayRemoveProps extends RemoveButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayBatchRemoveProps extends RemoveButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayMoveUpProps extends UpButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayMoveDownProps extends DownButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayEditProps extends EditButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayDetailProps extends DetailButtonProps {
  onLogicClick: (...arg: any) => void;
  onClick?: (...arg: any) => void;
}

export interface ArrayPreviewTextProps {
  colDataIndex: string;
  value?: any;
}

export interface ArraySortHandleProps extends PropsWithChildren {}

export interface ArrayBaseIndexProps extends PropsWithChildren {}

export interface ArrayBaseItemProps extends PropsWithChildren, ArrayItemValueContext {}

export interface RowSelected {
  selectedRowKeys: Key[];
  selectedRows: any[];
  setSelectedRowKeys: Dispatch<SetStateAction<any>>;
  setSelectedRows: Dispatch<SetStateAction<any>>;
}

export interface ArrayBaseProps extends PropsWithChildren, RowSelected {
  onAdd?: () => void;
  onEdit?: (index: number, record: any) => void;
  onRemove?: (index: number, record: any) => void;
  onBatchRemove?: (rowSelected: RowSelected) => void;
  onCopy?: (index: number, record: any) => void;
  onMoveDown?: (index: number, record: any) => void;
  onMoveUp?: (index: number, record: any) => void;
  onDetail?: (index: number, record: any) => void;
  onUpload?: (info: UploadChangeParam) => void;
}

const InternalArrayBase: FC<ArrayBaseProps> = ({ children, ...restProps }) => {
  const field = useField<ArrayField>();

  return (
    <ArrayBaseContext.Provider value={{ fieldAddress: field.address.toString(), props: restProps }}>
      {children}
    </ArrayBaseContext.Provider>
  );
};

const ArrayBaseItem: FC<ArrayBaseItemProps> = ({ children, ...props }) => {
  return <ArrayItemContext.Provider value={props}>{children}</ArrayItemContext.Provider>;
};

const ArrayBaseIndex: FC<ArrayBaseIndexProps> = observer((props) => {
  const index = useArrayIndex();

  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  return warpSSR(
    <span {...props} className={cls(`${prefixCls}-index`, hashId)}>
      #{index + 1}
    </span>,
  );
});

const PreviewText: FC<ArrayPreviewTextProps> = ({ value, colDataIndex }) => {
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const record = useArrayItemRecord();

  const val = colDataIndex ? record[colDataIndex] : value;

  return warpSSR(<div className={cls(`${prefixCls}-text`, hashId)}>{val}</div>);
};

const SortHandle: FC<ArraySortHandleProps> = observer((props) => {
  const array = useArrayContext();
  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  const dragProps = lodashOmit(props, OmitKey);

  return <SortableHandle {...dragProps} />;
});

const AdditionButton: FC<ArrayAdditionProps> = observer(
  ({ className, onClick, onLogicClick, ...restProps }) => {
    const field = useField();
    const array = useArrayContext();

    const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

    const handleClick = (e) => {
      e.stopPropagation();
      if (field.disabled) {
        return;
      }

      if (onLogicClick) {
        onLogicClick(field, field.form);
        return;
      }

      if (onClick) {
        onClick(field, field.form);
        return;
      }

      if (array?.props?.onAdd) {
        array.props.onAdd();
        return;
      }

      array.field?.push?.({});
    };

    if (!array || !['editable', 'disabled'].includes(array.field?.pattern)) {
      return null;
    }

    const btnProps = lodashOmit(restProps, OmitKey);

    return warpSSR(
      <PlusButton
        type="primary"
        block
        {...btnProps}
        disabled={field?.disabled}
        className={cls(`${prefixCls}-addition`, hashId, className)}
        onClick={handleClick}
        title={field.title}
      />,
    );
  },
);

export const Detail: FC<ArrayDetailProps> = observer(({ onLogicClick, className, onClick }) => {
  const field = useField();
  const array = useArrayContext();
  const index = useArrayIndex();
  const record = useArrayItemRecord();

  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    if (onLogicClick) {
      onLogicClick(index, record, field, field.form);
      return;
    }

    if (onClick) {
      onClick(index, record, field, field.form);
      return;
    }

    if (array.props?.onDetail) {
      array.props.onDetail?.(index, record);
      return;
    }
  };

  if (!array) {
    return null;
  }

  return warpSSR(
    <DetailButton
      hasTooltip
      mode={CustomButtonMode.icon}
      disabled={field.disabled}
      title={field.title}
      className={cls(`${prefixCls}-detail`, className, hashId)}
      onClick={handleClick}
    />,
  );
});

const Remove: FC<ArrayRemoveProps> = observer(({ className, onClick, onLogicClick }) => {
  const index = useArrayIndex();
  const record = useArrayItemRecord();
  const field = useField();
  const array = useArrayContext();
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const handleClick = (e) => {
    e.stopPropagation();
    if (field.disabled) {
      return;
    }

    if (onLogicClick) {
      onLogicClick(index, record, field, field.form);
      return;
    }

    if (onClick) {
      onClick(index, record, field, field.form);
      return;
    }

    if (array?.props?.onRemove) {
      array.props.onRemove(index, record);
      return;
    }

    array.field?.remove(index);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <RemoveButton
      hasPopConfirm
      hasTooltip
      mode={CustomButtonMode.icon}
      disabled={field.disabled}
      title={field.title}
      onClick={handleClick}
      className={cls(className, hashId, `${prefixCls}-remove`, {
        [`${prefixCls}-remove-disabled`]: field?.disabled,
      })}
    />,
  );
});

const BatchRemove: FC<ArrayRemoveProps> = observer(({ className, onClick, onLogicClick }) => {
  const field = useField();
  const array = useArrayContext();

  const { props, field: arrayField } = array || {};

  const { selectedRows, selectedRowKeys, onBatchRemove, setSelectedRows, setSelectedRowKeys } =
    props || {};

  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const disabled = field.disabled || !selectedRowKeys?.length;

  const rowSelected = {
    selectedRowKeys,
    selectedRows,
    setSelectedRows,
    setSelectedRowKeys,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }

    if (onLogicClick) {
      return onLogicClick(rowSelected, field);
    }

    if (onClick) {
      return onClick(rowSelected, field, field.form);
    }

    if (onBatchRemove) {
      return onBatchRemove(rowSelected);
    }

    const data = arrayField.value;

    const index = selectedRows.map((item) => {
      return data.indexOf(item);
    });

    arrayField.onInput(
      data.filter((item, idx) => {
        return !index.includes(idx);
      }),
    );

    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <RemoveButton
      hasPopConfirm
      mode={CustomButtonMode.text}
      disabled={disabled}
      type="default"
      title={field.title}
      onClick={handleClick}
      className={cls(className, hashId, `${prefixCls}-batch-remove`, {
        [`${prefixCls}-batch-remove-disabled`]: disabled,
      })}
    />,
  );
});

const Edit: FC<ArrayEditProps> = observer(({ onClick, className, onLogicClick }) => {
  const index = useArrayIndex();
  const record = useArrayItemRecord();
  const field = useField();
  const array = useArrayContext();
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    if (onLogicClick) {
      onLogicClick(index, record, field, field.form);
      return;
    }

    if (onClick) {
      onClick(index, record, field, field.form);
      return;
    }

    array.props?.onEdit?.(index, record);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <EditButton
      hasTooltip
      title={field.title}
      disabled={field.disabled}
      className={cls(className, hashId, `${prefixCls}-edit`, {
        [`${prefixCls}-edit-disabled`]: field?.disabled,
      })}
      onClick={handleClick}
    />,
  );
});

const Upload: FC<ArrayUploadProps> = observer(({ className, ...restProps }) => {
  const field = useField();
  const array = useArrayContext();
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  if (!array || !['editable', 'disabled'].includes(array.field?.pattern)) {
    return null;
  }

  const uploadProps = lodashOmit(restProps, OmitKey.concat('value'));

  return warpSSR(
    <UploadButton
      onChange={array.props?.onUpload}
      {...uploadProps}
      className={cls(`${prefixCls}-upload`, hashId, className)}
      showUploadList={false}
    >
      {field.title}
    </UploadButton>,
  );
});

const Copy: FC<ArrayCopyProps> = observer(({ className, onClick, onLogicClick }) => {
  const field = useField();
  const array = useArrayContext();
  const index = useArrayIndex();
  const record = useArrayItemRecord();

  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    if (onLogicClick) {
      onLogicClick(index, record, field, field.form);
      return;
    }

    if (onClick) {
      onClick(index, record, field, field.form);
      return;
    }

    if (array.props?.onCopy) {
      array.props.onCopy?.(index, record);
      return;
    }

    const value = clone(array?.field?.value[index] ?? {});
    const distIndex = index + 1;
    array.field?.insert?.(distIndex, value);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <CopyButton
      hasTooltip
      hasCopyToClipboard={false}
      className={cls(`${prefixCls}-copy`, className, hashId, {
        [`${prefixCls}-copy-disabled`]: field?.disabled,
      })}
      disabled={field.disabled}
      title={field.title}
      onClick={handleClick}
    />,
  );
});

const MoveDownButton: FC<ArrayMoveDownProps> = observer(({ className, onClick, onLogicClick }) => {
  const index = useArrayIndex();
  const record = useArrayItemRecord();
  const field = useField();
  const array = useArrayContext();
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    if (onLogicClick) {
      onLogicClick(index, record, field, field.form);
      return;
    }

    if (onClick) {
      onClick(index, record, field, field.form);
      return;
    }

    if (array.props?.onMoveDown) {
      array.props.onMoveDown(index, record);
      return;
    }

    array?.field?.moveDown(index);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <DownButton
      hasTooltip
      mode={CustomButtonMode.icon}
      className={cls(`${prefixCls}-move-down`, className, hashId, {
        [`${prefixCls}-move-down-disabled`]: field?.disabled,
      })}
      disabled={field.disabled}
      title={field.title}
      onClick={handleClick}
    />,
  );
});

const MoveUpButton: FC<ArrayMoveUpProps> = observer(({ onClick, className, onLogicClick }) => {
  const index = useArrayIndex();
  const record = useArrayItemRecord();
  const field = useField();
  const array = useArrayContext();
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    if (onLogicClick) {
      onLogicClick(index, record, field, field.form);
      return;
    }

    if (onClick) {
      onClick(index, record, field, field.form);
      return;
    }

    array.props?.onMoveUp?.(index, record);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <UpButton
      hasTooltip
      mode={CustomButtonMode.icon}
      className={cls(className, hashId, `${prefixCls}-move-up`, {
        [`${prefixCls}-move-up-disabled`]: field?.disabled,
      })}
      title={field.title}
      disabled={field.disabled}
      onClick={handleClick}
    />,
  );
});

const ArrayBase = Object.assign(InternalArrayBase, {
  Item: ArrayBaseItem,
  Index: ArrayBaseIndex,
  SortHandle,
  Addition: AdditionButton,
  Edit,
  Detail,
  Upload,
  Copy,
  Remove,
  BatchRemove,
  MoveDown: MoveDownButton,
  MoveUp: MoveUpButton,
  useArray: useArrayContext,
  useIndex: useArrayIndex,
  useRecord: useArrayItemRecord,
  PreviewText,
});

export default ArrayBase;
