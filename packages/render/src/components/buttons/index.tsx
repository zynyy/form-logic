import { CustomButton, CustomButtonMode, CustomButtonProps } from '@formlogic/component';
import { FC, MouseEvent } from 'react';
import { Components, MetaSchemaData } from '@/interface';

import { Space } from 'antd';

export interface ClickRecord extends Pick<MetaSchemaData, 'code' | 'name' | 'eventCode'> {
  clickCodes: string[];
}

export interface ButtonsProps extends Omit<CustomButtonProps, 'onClick'> {
  buttons?: MetaSchemaData[];
  onClick?: (e: MouseEvent<HTMLElement>, record: ClickRecord) => void;
  components?: Components;
}

const Buttons: FC<ButtonsProps> = ({ buttons, loading, components, disabled, onClick }) => {
  return (
    <Space>
      {buttons?.map((item) => {
        const { name, logics, eventCode, code, component, componentProps } = item || {};

        const clickCodes =
          logics?.filter((item) => item.effectHook === 'onClick').map((item) => item.logicCode) ||
          [];

        const Component = components?.[component] || CustomButton;

        return (
          <Component
            type="default"
            {...componentProps}
            loading={loading}
            disabled={disabled}
            key={code}
            onClick={async (e) => {
              await onClick?.(e, {
                code,
                eventCode,
                clickCodes,
                name,
              });
            }}
            mode={CustomButtonMode.text}
          >
            {name}
          </Component>
        );
      })}
    </Space>
  );
};

export default Buttons;
