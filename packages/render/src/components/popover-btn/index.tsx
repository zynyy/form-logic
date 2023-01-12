import { observer, RecursionField, useField, useFieldSchema } from '@formily/react';
import { Popover, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

export interface PopoverBtnProps {}

const PopoverBtn = observer(() => {
  const schema = useFieldSchema();

  const field = useField();

  return (
    <Popover
      content={<RecursionField schema={schema} onlyRenderProperties basePath={field.address} />}
      trigger="hover"
    >
      <Button icon={<MenuOutlined />} type="text" size="small" />
    </Popover>
  );
});

export default PopoverBtn;
