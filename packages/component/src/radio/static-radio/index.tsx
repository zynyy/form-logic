import { FC, useEffect, useState } from 'react';

import { Radio, RadioProps } from 'antd';
import { transformToOptions } from '@/utils';
import { useLabelOptions } from '@/hooks';

export interface StaticRadioProps extends RadioProps {
  readOnly?: boolean;
  labelTemplateKey?: string;
  valueTemplateKey?: string;
  data: any[];
}

const StaticRadio: FC<StaticRadioProps> = ({
  readOnly,
  valueTemplateKey,
  labelTemplateKey,
  value,
  data,
  ...restProps
}) => {
  const [options, setOptions] = useState<any[]>([]);

  const detailValue = useLabelOptions(options, value);

  useEffect(() => {
    setOptions(transformToOptions(data, labelTemplateKey, valueTemplateKey));
  }, [data]);

  return readOnly ? (
    <span>{detailValue}</span>
  ) : (
    <Radio.Group {...restProps} value={value} options={options} />
  );
};

export default StaticRadio;
