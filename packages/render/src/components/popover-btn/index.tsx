import { observer, RecursionField, useField, useFieldSchema } from '@formily/react';
import { Popover, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { FC, useState } from 'react';

export interface PopoverBtnProps {}

const PopoverBtn: FC<PopoverBtnProps> = observer(() => {
  const schema = useFieldSchema();

  const [open, setOpen] = useState(false);

  const field = useField();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  return (
    <Popover
      content={<RecursionField schema={schema} onlyRenderProperties basePath={field.address} />}
      trigger="hover"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button icon={<MenuOutlined />} type="text" size="small" />
    </Popover>
  );
});

export default PopoverBtn;
