import {
  EffectHookSelect,
  FieldTypeSelect,
  FormPageLayout,
  GroupModeSelect, JsonPopover,
  RequestMethodSelect,
  SchemaTypeSelect,
  YesNoRadio,
} from '@formlogic/render';
import { useNavigate } from 'react-router-dom';
import { useMetaSchema } from '@/hooks';
import { apiUrl, ModelPageConfig } from './services';
import { useModelPageDetail } from './hooks';
import getLogicConfig from '@/low-code-meta/logic';

import PageCodeSelect from '@/components/page-code-select';

const ModelPageEdit = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema(ModelPageConfig.EDIT);

  const [formConfig, loading] = useModelPageDetail();

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

        PageCodeSelect,
        SchemaTypeSelect,
        FieldTypeSelect,
        GroupModeSelect,
        YesNoRadio,
        RequestMethodSelect,
        EffectHookSelect,
        JsonPopover,
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

export default ModelPageEdit;
