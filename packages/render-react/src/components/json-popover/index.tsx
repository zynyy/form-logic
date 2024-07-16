import { observer, useField } from '@formily/react';

import { Popover, PopoverProps, message } from 'antd';
import { Field } from '@formily/core';
import { FC, useRef, useState } from 'react';
import cls from 'classnames';

import { MonacoEditor, MonacoEditorType, MonacoType } from '@formlogic/component';
import { usePopoverContainerStyle } from '@/components/popover-container/hooks';
import { validateForm } from '@/utils/formUtils';
import PopoverButton from '@/components/popover-container/PopoverButton';

export interface JsonPopoverProps extends Omit<PopoverProps, 'title' | 'open'> {
  readOnly?: boolean;
  disabled?: boolean;
}

const JsonPopover: FC<JsonPopoverProps> = observer(
  ({ readOnly, children, className, disabled, ...props }) => {
    const field = useField<Field>();

    const [open, setOpen] = useState(false);

    const monacoRef = useRef<MonacoType>();

    const [wrapSSR, hashId, prefixCls] = usePopoverContainerStyle();

    const [jsonValue, setJsonValue] = useState('');

    const handleMount = (editor: MonacoEditorType.IStandaloneCodeEditor, monaco: MonacoType) => {
      monacoRef.current = monaco;
    };

    const closePopover = async () => {
      validateForm(field.form, `${field.address}`).then(() => {
        const modelMarkers = monacoRef.current.editor.getModelMarkers({});

        if (modelMarkers.length) {
          message.warning('序列化失败 请检查是否有错');
          return;
        }

        const val = JSON.parse(jsonValue);

        field.onInput(val).then(() => void 0);

        setOpen(false);
      });
    };

    const openPopover = () => {
      setJsonValue(JSON.stringify(field.value || {}, null, 2));
      setOpen(true);
    };

    const handleOpenChange = (open) => {
      if (open) {
        openPopover();
      } else {
        closePopover().then(() => void 0);
      }
    };

    const isDetail = disabled || readOnly;

    return wrapSSR(
      <Popover
        {...props}
        title={field.title}
        open={open}
        trigger={isDetail ? 'hover' : 'click'}
        className={cls(prefixCls, hashId, className)}
        content={
          <>
            <MonacoEditor
              onChange={setJsonValue}
              height={280}
              width={360}
              value={jsonValue}
              language="json"
              onMount={handleMount}
              readOnly={isDetail}
            />
          </>
        }
        onOpenChange={handleOpenChange}
      >
        <PopoverButton readOnly={isDetail} />
      </Popover>,
    );
  },
);

export default JsonPopover;
