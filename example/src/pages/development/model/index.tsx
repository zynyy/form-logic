import { ListLayout } from '@formlogic/render';

import { apiUrl, ModelConfig } from '@/pages/development/model/services';
import { useEffect } from 'react';
import { requestGet } from '@/service';
import getLogicConfig from '@/low-code-meta/logic';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQueryUrl } from '@/utils/utils';

const Model = () => {
  const navigate = useNavigate();

  return (
    <ListLayout
      getLogicConfig={getLogicConfig}
      pageCode={ModelConfig.LIST}
      action={apiUrl.page}
      events={{
        onAdd: () => {
          navigate(
            getQueryUrl(ModelConfig.CREATE_LINK, {
              a: 1,
              b: 3
            }),
          );
        },
      }}
    />
  );
};

export default Model;
