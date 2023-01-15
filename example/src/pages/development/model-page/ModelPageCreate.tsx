import {
  FieldTypeSelect,
  FormPageLayout,
  GroupModeSelect,
  SchemaTypeSelect,
  YesNoRadio,
  RequestMethodSelect,
  EffectHookSelect,
  JsonPopover,
  YesNoSelect
} from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import { useMetaSchema } from '@/hooks';
import { apiUrl, ModelPageConfig } from './services';
import getLogicConfig from '@/low-code-meta/logic';



import { modelPageFormatFormValues } from './hooks';
import PageCodeSelect from '@/components/page-code-select';

const ModelPageCreate = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema(ModelPageConfig.CREATE);

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
          PageCodeSelect,
          SchemaTypeSelect,
          FieldTypeSelect,
          GroupModeSelect,
          YesNoRadio,
          RequestMethodSelect,
          EffectHookSelect,
          JsonPopover,
          YesNoSelect
        }}
        extraLogicParams={{
          successCallback,
          action: apiUrl.create,
          extraParams: {},
          formatFormValues: modelPageFormatFormValues,
        }}
      />
    </>
  );
};

export default ModelPageCreate;
