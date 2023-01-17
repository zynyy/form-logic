import {
  FormPageLayout,
  JsonPopover,
  RequestMethodSelect,
  SchemaPatternEnum,
  SchemaTypeSelect, useJsonMetaSchema,

} from '@formlogic/render';

import getLogicConfig from '@/low-code-meta/logic';
import { ModelConfig } from '@/pages/development/model/services';
import { useNavigate } from 'react-router-dom';

import { useModelDetail } from '@/pages/development/model/hooks';
import MetaTreeArrayDrawerTable from '@/pages/development/model/component/meta-tree-array-drawer-table';

const ModelDetail = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(ModelConfig.DETAIL);

  const [formConfig, loading] = useModelDetail();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <FormPageLayout
      hasGroup
      pattern={SchemaPatternEnum.DETAIL}
      loading={loading}
      formConfig={formConfig}
      onBackClick={handleBackClick}
      metaSchema={metaSchema}
      extraLogicParams={{}}
      getLogicConfig={getLogicConfig}
      components={{
        MetaTreeArrayDrawerTable,
        SchemaTypeSelect,

        JsonPopover,
        RequestMethodSelect,
      }}
    />
  );
};

export default ModelDetail;
