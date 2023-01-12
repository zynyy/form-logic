import { FormPageLayout, JsonPopover, RequestMethodSelect, SchemaTypeSelect, YesNoRadio } from '@formlogic/render';
import {  useNavigate } from 'react-router-dom';

import { apiUrl, ModelConfig } from './services';
import { useMetaSchema } from '@/hooks';

import getLogicConfig from '@/low-code-meta/logic';
import MetaTreeArrayDrawerTable from '@/pages/development/model/component/meta-tree-array-drawer-table';


const ModelCreate = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema(ModelConfig.CREATE);

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
    handleBackClick();
  };

  return (
    <>
      <FormPageLayout
        onBackClick={handleBackClick}
        hasGroup
        metaSchema={metaSchema}
        getLogicConfig={getLogicConfig}
        components={{
          MetaTreeArrayDrawerTable,
          SchemaTypeSelect,
          YesNoRadio,
          JsonPopover,
          RequestMethodSelect
        }}
        extraLogicParams={{
          successCallback,
          action: apiUrl.create,
          extraParams: {},

        }}
      />
    </>
  );
};

export default ModelCreate;
