import { FC, PropsWithChildren } from 'react';
import { Button, ButtonProps, Upload, UploadProps } from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  CopyOutlined,
  EditOutlined,
  UploadOutlined,
  DragOutlined,
} from '@ant-design/icons';
import { ArrayField } from '@formily/core';
import { useField, useFieldSchema } from '@formily/react';

import cls from 'classnames';
import BtnTooltipIcon from '@/components/btn-tooltip-icon';

import { ArrayBaseContext, ArrayItemContext, useArrayContext } from './hooks/context';
import {
  useArrayBaseStyle,
  useArrayIndex,
  useArrayItemRecord,
} from '@/components/array-base/hooks';
import { SortableHandle } from '@/components/drag-sort';
import { clone } from '@formily/shared';

interface ArrayAdditionProps extends PropsWithChildren, ButtonProps {
  onLogicClick: (...arg: any) => void;
}

interface ArrayUploadProps extends PropsWithChildren, UploadProps {
  onLogicClick: (...arg: any) => void;
}

interface ArrayCopyProps extends PropsWithChildren, ButtonProps {
  onLogicClick: (...arg: any) => void;
}

interface ArrayRemoveProps extends PropsWithChildren, ButtonProps {
  onLogicClick: (...arg: any) => void;
}

interface ArrayMoveUpProps extends PropsWithChildren, ButtonProps {
  onLogicClick: (...arg: any) => void;
}
interface ArrayMoveDownProps extends PropsWithChildren, ButtonProps {
  onLogicClick: (...arg: any) => void;
}

interface ArrayEditProps extends PropsWithChildren, ButtonProps {
  onLogicClick: (...arg: any) => void;
}

interface ArraySortHandleProps extends PropsWithChildren, ButtonProps {
  onLogicClick: (...arg: any) => void;
}

interface ArrayPreviewTextProps extends PropsWithChildren, ButtonProps {
  colName?: string;
}

interface ArrayBaseItemProps extends PropsWithChildren {
  index: number;
  record: any;
}

export type ArrayBaseMixins = {
  Addition?: FC<ArrayAdditionProps>;
  Upload?: FC<ArrayUploadProps>;
  Copy?: FC<ArrayCopyProps>;
  Remove?: FC<ArrayRemoveProps>;
  MoveUp?: FC<ArrayMoveUpProps>;
  Edit?: FC<ArrayEditProps>;
  MoveDown?: FC<ArrayMoveDownProps>;
  SortHandle?: FC<ArraySortHandleProps>;
  PreviewText?: FC<ArrayPreviewTextProps>;
  Index?: FC;
};

export interface ArrayBaseProps {
  onAdd?: () => void;
  onEdit?: (index: number, record: any) => void;
  onRemove?: (index: number, record: any) => void;
  onCopy?: (index: number, record: any) => void;
  onMoveDown?: (index: number, record: any) => void;
  onMoveUp?: (index: number, record: any) => void;
}

const InternalArrayBase = ({ children, ...restProps }) => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();

  return (
    <ArrayBaseContext.Provider value={{ field, schema, props: restProps }}>
      {children}
    </ArrayBaseContext.Provider>
  );
};

const ArrayBaseItem: FC<ArrayBaseItemProps> = ({ children, ...props }) => {
  return <ArrayItemContext.Provider value={props}>{children}</ArrayItemContext.Provider>;
};

const ArrayBaseIndex = (props) => {
  const index = useArrayIndex();

  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  return warpSSR(
    <span {...props} className={cls(`${prefixCls}-index`, hashId)}>
      #{index + 1}.
    </span>,
  );
};

const PreviewText = ({ value, className, colName }) => {
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const record = useArrayItemRecord();

  const val = colName ? record[colName] : value;

  return warpSSR(<div className={cls(`${prefixCls}-text`, className, hashId)}>{val}</div>);
};

const SortHandleIcon = SortableHandle(({ className, style, ...restProps }) => {
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  return warpSSR(
    <DragOutlined
      {...restProps}
      className={cls(`${prefixCls}-sort-handle`, hashId, className)}
      style={style}
    />,
  );
});

const SortHandle = (props) => {
  const array = useArrayContext();
  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }
  return <SortHandleIcon {...props} />;
};

const AdditionButton = ({ className, onClick, onLogicClick, ...restProps }) => {
  const field = useField();
  const array = useArrayContext();

  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  const handleClick = (e) => {
    e.stopPropagation();
    if (field.disabled) {
      return;
    }

    if (onLogicClick) {
      onLogicClick(field);
      return;
    }

    if (onClick) {
      onClick(e);
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

  return warpSSR(
    <Button
      type="primary"
      block
      {...restProps}
      disabled={field?.disabled}
      className={cls(`${prefixCls}-addition`, hashId, className)}
      onClick={handleClick}
      icon={<PlusOutlined />}
    >
      {field.title}
    </Button>,
  );
};

const RemoveButton = ({ className, onClick, onLogicClick }) => {
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
      onLogicClick(field);
      return;
    }

    if (onClick) {
      onClick(e);
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
    <BtnTooltipIcon
      icon={<DeleteOutlined />}
      tooltip={field.title}
      disabled={field.disabled}
      className={cls(
        `${prefixCls}-remove`,
        field?.disabled ? `${prefixCls}-remove-disabled` : '',
        className,
        hashId,
      )}
      onClick={handleClick}
    />,
  );
};

const EditButton = ({ onClick, className, onLogicClick }) => {
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
      onLogicClick(field);
      return;
    }

    if (onClick) {
      onClick(e);
      return;
    }

    array.props?.onEdit?.(index, record);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <BtnTooltipIcon
      icon={<EditOutlined />}
      tooltip={field.title}
      disabled={field.disabled}
      className={cls(
        `${prefixCls}-edit`,
        field?.disabled ? `${prefixCls}-edit-disabled` : '',
        className,
        hashId,
      )}
      onClick={handleClick}
    />,
  );
};

const UploadButton = ({ className, ...restProps }) => {
  const field = useField();
  const array = useArrayContext();
  const [warpSSR, hashId, prefixCls] = useArrayBaseStyle();

  if (!array || !['editable', 'disabled'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <Upload
      {...restProps}
      className={cls(`${prefixCls}-upload`, hashId, className)}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}> {field.title}</Button>
    </Upload>,
  );
};

const CopyButton = ({ className, onClick, onLogicClick }) => {
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
      onLogicClick(field);
      return;
    }

    if (onClick) {
      onClick(e);
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
    <BtnTooltipIcon
      className={cls(`${prefixCls}-copy`, className, hashId, {
        [`${prefixCls}-copy-disabled`]: field?.disabled,
      })}
      disabled={field.disabled}
      tooltip={field.title}
      icon={<CopyOutlined />}
      onClick={handleClick}
    />,
  );
};

const MoveDownButton = ({ className, onClick, onLogicClick }) => {
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
      onLogicClick(field);
      return;
    }

    if (onClick) {
      onClick(e);
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
    <BtnTooltipIcon
      className={cls(`${prefixCls}-move-down`, className, hashId, {
        [`${prefixCls}-move-down-disabled`]: field?.disabled,
      })}
      disabled={field.disabled}
      tooltip={field.title}
      icon={<DownOutlined />}
      onClick={handleClick}
    />,
  );
};

const MoveUpButton = ({ onClick, className, onLogicClick }) => {
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
      onLogicClick(field);
      return;
    }

    if (onClick) {
      onClick(e);
      return;
    }

    array.props?.onMoveUp?.(index, record);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return warpSSR(
    <BtnTooltipIcon
      className={cls(className, hashId, `${prefixCls}-move-up`, {
        [`${prefixCls}-move-up-disabled`]: field?.disabled,
      })}
      tooltip={field.title}
      disabled={field.disabled}
      icon={<UpOutlined />}
      onClick={handleClick}
    />,
  );
};

const ArrayBase = Object.assign(InternalArrayBase, {
  Item: ArrayBaseItem,
  Index: ArrayBaseIndex,
  SortHandle,
  Addition: AdditionButton,
  Copy: CopyButton,
  Remove: RemoveButton,
  MoveDown: MoveDownButton,
  MoveUp: MoveUpButton,
  useArray: useArrayContext,
  useIndex: useArrayIndex,
  useRecord: useArrayItemRecord,
  PreviewText,
});

export default ArrayBase;
