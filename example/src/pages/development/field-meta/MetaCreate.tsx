import {
  FormPageLayout,
  JsonPopover,
  RequestMethodSelect,
  SchemaTypeSelect,

  useJsonMetaSchema
} from '@formlogic/render';
import { useNavigate } from 'react-router-dom';
import { apiUrl, FieldMetaConfig } from './services';
import getLogicConfig from '@/low-code-meta/logic';

const MetaCreate = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(FieldMetaConfig.CREATE);

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
    handleBackClick();
  };

  return (
    <>
      <FormPageLayout
        hasGroup
        onBackClick={handleBackClick}
        metaSchema={metaSchema}
        getLogicConfig={getLogicConfig}
        components={{
          SchemaTypeSelect,

          JsonPopover,
          RequestMethodSelect,
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

export default MetaCreate;
