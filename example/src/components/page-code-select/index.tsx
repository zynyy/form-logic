import { RemoteSelect, RemoteSelectProps, ApiConfig } from '@formlogic/component';
import { FC, useMemo } from 'react';

export interface PageCodeSelectProps
  extends Omit<RemoteSelectProps, 'apiConfig' | 'labelTemplateKey'> {
  modelCode?: string;
}

const PageCodeSelect: FC<PageCodeSelectProps> = ({ modelCode, ...restProps }) => {
  const apiConfig = useMemo<ApiConfig>(() => {
    return {
      method: 'get',
      url: '/local-api/model-or-page/list',
      params: { type: 'page', model: modelCode },
    };
  }, [modelCode]);

  return (
    <RemoteSelect
      optionLabelProp="value"
      {...restProps}
      apiConfig={apiConfig}
      labelTemplateKey="{{code}}-{{name}}"
    />
  );
};

export default PageCodeSelect;
