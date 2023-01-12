import {
  FormPageLayout,
  JsonPopover,
  RequestMethodSelect,
  SchemaPatternEnum,
  SchemaTypeSelect,
  YesNoRadio,
} from '@formlogic/render';

import getLogicConfig from '@/low-code-meta/logic';
import { ModelConfig } from '@/pages/development/model/services';
import { useNavigate } from 'react-router-dom';
import { useMetaSchema } from '@/hooks';
import { useModelDetail } from '@/pages/development/model/hooks';
import MetaTreeArrayDrawerTable from '@/pages/development/model/component/meta-tree-array-drawer-table';

const ModelDetail = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema(ModelConfig.DETAIL);

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
        YesNoRadio,
        JsonPopover,
        RequestMethodSelect,
      }}
    />
  );
};

export default ModelDetail;
