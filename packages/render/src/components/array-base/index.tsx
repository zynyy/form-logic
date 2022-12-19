import { createContext, FC, MouseEvent, PropsWithChildren, useContext } from 'react';
import { Button, Upload, UploadProps } from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  MenuOutlined,
  CopyOutlined,
  EditOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { ButtonProps } from 'antd/lib/button';
import { ArrayField } from '@formily/core';
import {
  useField,
  useFieldSchema,
  Schema,
  JSXComponent,
  RecordScope,
  RecordsScope,
} from '@formily/react';
import { isValid, clone } from '@formily/shared';
import { SortableHandle } from 'react-sortable-hoc';
import { usePrefixCls } from '../hooks';
import cls from 'classnames';
import BtnTooltipIcon from '@/components/btn-tooltip-icon';

import './style/index.css';

export interface IArrayBaseAdditionProps extends ButtonProps {
  title?: string;
  method?: 'push' | 'unshift';
  defaultValue?: any;
}

export interface IArrayBaseContext {
  props: IArrayBaseProps;
  field: ArrayField;
  schema: Schema;
}

export interface IArrayBaseItemProps {
  index: number;
  record: ((index: number) => Record<string, any>) | Record<string, any>;
}

export type ArrayBaseMixins = {
  Addition?: FC<PropsWithChildren<IArrayBaseAdditionProps>>;
  Upload?: FC<PropsWithChildren<UploadProps & { title?: string; value?: any }>>;
  Copy?: FC<PropsWithChildren<AntdIconProps & { index?: number }>>;
  Remove?: FC<PropsWithChildren<AntdIconProps & { index?: number }>>;
  MoveUp?: FC<PropsWithChildren<AntdIconProps & { index?: number }>>;
  Edit?: FC<PropsWithChildren<AntdIconProps & { index?: number }>>;
  MoveDown?: FC<PropsWithChildren<AntdIconProps & { index?: number }>>;
  SortHandle?: FC<PropsWithChildren<AntdIconProps & { index?: number }>>;
  PreviewText?: FC<PropsWithChildren<AntdIconProps & { index?: number; colName?: string }>>;
  Index?: FC;
  useArray?: () => IArrayBaseContext;
  useIndex?: (index?: number) => number;
  useRecord?: (record?: number) => any;
};

export interface IArrayBaseProps {
  disabled?: boolean;
  onAdd?: () => void;
  onEdit?: (record: any, index: number) => void;
  onRemove?: (record: any, index: number) => void;
  onCopy?: (record: any, index: number) => void;
  onMoveDown?: (record: any, index: number) => void;
  onMoveUp?: (record: any, index: number) => void;
}

type ComposedArrayBase = FC<PropsWithChildren<IArrayBaseProps>> &
  ArrayBaseMixins & {
    Item?: FC<PropsWithChildren<IArrayBaseItemProps>>;
    mixin?: <T extends JSXComponent>(target: T) => T & ArrayBaseMixins;
  };

const ArrayBaseContext = createContext<IArrayBaseContext>(null);

const ItemContext = createContext<IArrayBaseItemProps>(null);

const takeRecord = (val: any, index?: number) => (typeof val === 'function' ? val(index) : val);

const useArray = () => {
  return useContext(ArrayBaseContext);
};

const useIndex = (index?: number) => {
  const ctx = useContext(ItemContext);
  return ctx ? ctx.index : index;
};

const useRecord = (record?: number) => {
  const ctx = useContext(ItemContext);
  return takeRecord(ctx ? ctx.record : record, ctx?.index);
};

const getSchemaDefaultValue = (schema: Schema) => {
  if (schema?.type === 'array') {
    return [];
  }

  if (schema?.type === 'object') {
    return {};
  }

  if (schema?.type === 'void') {
    for (let key in schema.properties) {
      const value = getSchemaDefaultValue(schema.properties[key]);
      if (isValid(value)) return value;
    }
  }

  return schema?.default;
};

export const ArrayBase: ComposedArrayBase = (props) => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  return (
    <RecordsScope getRecords={() => field.value}>
      <ArrayBaseContext.Provider value={{ field, schema, props }}>
        {props.children}
      </ArrayBaseContext.Provider>
    </RecordsScope>
  );
};

ArrayBase.PreviewText = ({ value, className, style, colName }) => {
  const prefixCls = usePrefixCls('form-text', {});

  const record = useRecord();

  const val = colName ? record[colName] : value;

  return (
    <div className={cls(prefixCls, className)} style={style}>
      {val}
    </div>
  );
};

ArrayBase.Item = ({ children, ...props }) => {
  return (
    <ItemContext.Provider value={props}>
      <RecordScope
        getIndex={() => props.index}
        getRecord={() => takeRecord(props.record, props.index)}
      >
        {children}
      </RecordScope>
    </ItemContext.Provider>
  );
};

const SortHandle = SortableHandle((props: any) => {
  const prefixCls = usePrefixCls('formily-array-base');
  return (
    <MenuOutlined
      {...props}
      className={cls(`${prefixCls}-sort-handle`, props.className)}
      style={{ ...props.style }}
    />
  );
}) as any;

ArrayBase.SortHandle = (props) => {
  const array = useArray();
  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;
  return <SortHandle {...props} />;
};

ArrayBase.Index = (props) => {
  const index = useIndex();
  const prefixCls = usePrefixCls('formily-array-base');
  return (
    <span {...props} className={`${prefixCls}-index`}>
      #{index + 1}.
    </span>
  );
};

ArrayBase.Addition = (props) => {
  const field = useField();
  const array = useArray();

  const prefixCls = usePrefixCls('formily-array-base');

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (field.disabled) {
      return;
    }
    if (props.onClick) {
      props.onClick(e);
      return;
    }
    array?.props.onAdd?.();
  };

  if (!array || !['editable', 'disabled'].includes(array.field?.pattern)) {
    return null;
  }

  return (
    <Button
      type="dashed"
      block
      {...props}
      disabled={field?.disabled}
      className={cls(`${prefixCls}-addition`, props.className)}
      onClick={handleClick}
      icon={<PlusOutlined />}
    >
      {props.title || field.title}
    </Button>
  );
};

ArrayBase.Remove = (props) => {
  const index = useIndex(props.index);
  const record = useRecord(props.index);
  const field = useField();
  const array = useArray();
  const prefixCls = usePrefixCls('formily-array-base');

  const handleClick = (e) => {
    e.stopPropagation();
    if (field.disabled) {
      return;
    }

    if (props.onClick) {
      props.onClick(e);
      return;
    }

    array.props?.onRemove?.(record, index);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return (
    <BtnTooltipIcon
      icon={<DeleteOutlined />}
      tooltip={field.title}
      disabled={field.disabled}
      className={cls(
        `${prefixCls}-remove`,
        field?.disabled ? `${prefixCls}-remove-disabled` : '',
        props.className,
      )}
      onClick={handleClick}
    />
  );
};

ArrayBase.Edit = ({ disabled, ...restProps }) => {
  const index = useIndex(restProps.index);
  const record = useRecord(restProps.index);
  const field = useField();
  const array = useArray();
  const prefixCls = usePrefixCls('formily-array-base');

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    array.props?.onEdit?.(record, index);

    if (restProps.onClick) {
      restProps.onClick(e);
    }
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return (
    <BtnTooltipIcon
      icon={<EditOutlined />}
      tooltip={field.title}
      disabled={field.disabled}
      className={cls(
        `${prefixCls}-edit`,
        field?.disabled ? `${prefixCls}-edit-disabled` : '',
        restProps.className,
      )}
      onClick={handleClick}
    />
  );
};

ArrayBase.Upload = ({ title, value, className, ...restProps }) => {
  const field = useField();
  const array = useArray();
  const prefixCls = usePrefixCls('formily-array-base');

  if (!array || !['editable', 'disabled'].includes(array.field?.pattern)) {
    return null;
  }

  return (
    <Upload
      {...restProps}
      className={cls(`${prefixCls}-upload`, className)}
      fileList={value}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}> {title || field.title}</Button>
    </Upload>
  );
};

ArrayBase.Copy = (props) => {
  const field = useField();
  const array = useArray();
  const index = useIndex(props.index);
  const record = useRecord(props.index);

  const prefixCls = usePrefixCls('formily-array-base');

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    if (props.onClick) {
      props.onClick(e);
      return;
    }

    array.props?.onCopy?.(record, index);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return (
    <BtnTooltipIcon
      className={cls(
        `${prefixCls}-copy`,
        field?.disabled ? `${prefixCls}-copy-disabled` : '',
        props.className,
      )}
      disabled={field.disabled}
      tooltip={field.title}
      icon={<CopyOutlined />}
      onClick={handleClick}
    />
  );
};

ArrayBase.MoveDown = (props, ref) => {
  const index = useIndex(props.index);
  const record = useRecord(props.index);
  const field = useField();
  const array = useArray();
  const prefixCls = usePrefixCls('formily-array-base');

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }
    if (props.onClick) {
      props.onClick(e);
      return;
    }

    array.props?.onMoveDown?.(record, index);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return (
    <BtnTooltipIcon
      className={cls(
        `${prefixCls}-move-down`,
        field?.disabled ? `${prefixCls}-move-down-disabled` : '',
        props.className,
      )}
      disabled={field.disabled}
      tooltip={field.title}
      icon={<DownOutlined />}
      onClick={handleClick}
    />
  );
};

ArrayBase.MoveUp = (props) => {
  const index = useIndex(props.index);
  const record = useRecord(props.index);
  const field = useField();
  const array = useArray();
  const prefixCls = usePrefixCls('formily-array-base');

  const handleClick = (e) => {
    e.stopPropagation();

    if (field.disabled) {
      return;
    }

    if (props.onClick) {
      props.onClick(e);
      return;
    }

    array.props?.onMoveDown?.(record, index);
  };

  if (!array || !['editable'].includes(array.field?.pattern)) {
    return null;
  }

  return (
    <BtnTooltipIcon
      className={cls(
        `${prefixCls}-move-up`,
        field?.disabled ? `${prefixCls}-move-up-disabled` : '',
        props.className,
      )}
      tooltip={field.title}
      disabled={field.disabled}
      icon={<UpOutlined />}
      onClick={handleClick}
    />
  );
};

ArrayBase.useArray = useArray;
ArrayBase.useIndex = useIndex;
ArrayBase.useRecord = useRecord;

export default ArrayBase;
