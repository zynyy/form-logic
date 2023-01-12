import { Button, ButtonProps } from 'antd';
import cls from 'classnames';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import FeedbackBadge from '@/components/feedback-badge';
import { usePopoverContainerStyle } from '@/components/popover-container/hooks';
import { FC, forwardRef, RefAttributes } from 'react';

export interface PopoverButtonProps extends ButtonProps, RefAttributes<HTMLButtonElement> {
  readOnly?: boolean;
}

const PopoverButton: FC<PopoverButtonProps> = forwardRef(({ readOnly, className, ...restProps }, ref) => {
  const [wrapSSR, hashId, prefixCls] = usePopoverContainerStyle();

  return wrapSSR(
    <Button
      {...restProps}
      className={cls({
        className,
        hashId,
        [`${prefixCls}-edit-btn`]: !readOnly,
        [`${prefixCls}-detail-btn`]: readOnly,
      })}
      icon={readOnly ? <EyeOutlined /> : <EditOutlined />}
      ref={ref}
    >
      <FeedbackBadge>
        <span>{readOnly ? '悬停查看' : '点击编辑'}</span>
      </FeedbackBadge>
    </Button>,
  );
});

export default PopoverButton;
