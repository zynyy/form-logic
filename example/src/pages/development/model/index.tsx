import { ListLayout } from '@formlogic/render';

import { apiUrl, ModelConfig } from '@/pages/development/model/services';
import { useEffect } from 'react';
import { requestGet } from '@/service';
import getLogicConfig from '@/low-code-meta/logic';

const Model = () => {

  useEffect(() => {

    requestGet(apiUrl.page).then(res => {
      debugger
    })

  }, [])


  return <ListLayout getLogicConfig={getLogicConfig} pageCode={ModelConfig.LIST} action={apiUrl.page} />;
};

export default Model;
