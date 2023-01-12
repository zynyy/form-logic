import { observer, useField } from '@formily/react';
import { usePopoverContainerStyle } from '@/components/popover-container/hooks';

import { Popover as AntdPopover, PopoverProps, Button } from 'antd';
import { Field } from '@formily/core';
import { FC, useState } from 'react';
import cls from 'classnames';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import FeedbackBadge from '@/components/feedback-badge';
import PopoverButton from '@/components/popover-container/PopoverButton';

export interface PopoverContainerProps extends Omit<PopoverProps, 'title' | 'open'> {
  readOnly?: boolean;
  disabled?: boolean;
}

const PopoverContainer: FC<PopoverContainerProps> = observer(
  ({ readOnly, children, className, disabled, ...props }) => {
    const field = useField<Field>();

    const [open, setOpen] = useState(false);

    const [wrapSSR, hashId, prefixCls] = usePopoverContainerStyle();

    const closePopover = async () => {
      try {
        await field.form.validate(`${field.address}.*`);
      } finally {
        const errors = field.form.queryFeedbacks({
          type: 'error',
          address: `${field.address}.*`,
        });

        if (!errors.length) {
          setOpen(false);
        }
      }
    };

    const openPopover = () => {
      setOpen(true);
    };

    const isDetail = disabled || !readOnly;

    const handleOpenChange = (open) => {
      if (open) {
        openPopover();
      } else {
        closePopover().then(() => void 0);
      }
    };

    return wrapSSR(
      <AntdPopover
        {...props}
        title={field.title}
        open={open}
        className={cls(prefixCls, hashId, className)}
        content={children}
        trigger={isDetail ? 'hover' : 'click'}
        onOpenChange={handleOpenChange}
      >
        <PopoverButton readOnly={isDetail} />
      </AntdPopover>,
    );
  },
);

export default PopoverContainer;
