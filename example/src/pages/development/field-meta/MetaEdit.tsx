import {
  FormPageLayout,
  JsonPopover,
  RequestMethodSelect,
  SchemaTypeSelect,
  useJsonMetaSchema,
} from '@formlogic/render';
import { useNavigate } from 'react-router-dom';
import { apiUrl, FieldMetaConfig } from './services';
import getLogicConfig from '@/low-code-meta/logic';

import { useFieldMetaDetail } from '@/pages/development/field-meta/hooks';

const MetaEdit = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(FieldMetaConfig.EDIT);

  const [formConfig, loading] = useFieldMetaDetail();

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
    handleBackClick();
  };

  return (
    <>
      <FormPageLayout
        loading={loading}
        onBackClick={handleBackClick}
        formConfig={formConfig}
        hasGroup
        metaSchema={metaSchema}
        getLogicConfig={getLogicConfig}
        components={{
          SchemaTypeSelect,

          JsonPopover,
          RequestMethodSelect
        }}
        extraLogicParams={{
          successCallback,
          action: apiUrl.update,
          extraParams: {},
        }}
      />
    </>
  );
};

export default MetaEdit;
