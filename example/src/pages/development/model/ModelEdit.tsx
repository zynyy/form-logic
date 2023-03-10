import {
  FormPageLayout,
  JsonPopover,
  RequestMethodSelect,
  SchemaTypeSelect, useJsonMetaSchema,

} from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import { apiUrl, ModelConfig } from '@/pages/development/model/services';
import getLogicConfig from '@/low-code-meta/logic';

import { useModelDetail } from '@/pages/development/model/hooks';
import MetaTreeArrayDrawerTable from '@/pages/development/model/component/meta-tree-array-drawer-table';

const ModelEdit = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(ModelConfig.EDIT);

  const [formConfig, loading] = useModelDetail();

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
    handleBackClick();
  };

  return (
    <FormPageLayout
      loading={loading}
      onBackClick={handleBackClick}
      hasGroup
      metaSchema={metaSchema}
      getLogicConfig={getLogicConfig}
      components={{
        MetaTreeArrayDrawerTable,
        SchemaTypeSelect,

        JsonPopover,
        RequestMethodSelect,
      }}
      formConfig={formConfig}
      extraLogicParams={{
        successCallback,
        action: apiUrl.update,
        extraParams: {},
      }}
    />
  );
};

export default ModelEdit;
