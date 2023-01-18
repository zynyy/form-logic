import { FC } from 'react';
import { Checkbox, CheckboxProps } from 'antd';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { StrNumBool } from '@/interface';
import { strNumBoolToBoolean } from '@/utils';

import ReadOnlyCheckbox from '@/checkbox/read-only';

export interface YesOrNoCheckboxProps extends Pick<CheckboxProps, 'disabled'> {
  onChange?: (checked: boolean) => void;
  value?: StrNumBool;
  readOnly?: boolean;
}

const YesOrNoCheckbox: FC<YesOrNoCheckboxProps> = ({ onChange, readOnly, value, disabled }) => {
  const handleChange = (e: CheckboxChangeEvent) => {
    onChange?.(!!e.target.checked);
  };

  const checked = strNumBoolToBoolean(value);

  return readOnly ? (
    <ReadOnlyCheckbox checked={checked} />
  ) : (
    <Checkbox onChange={handleChange} checked={checked} disabled={disabled} />
  );
};

export default YesOrNoCheckbox;
