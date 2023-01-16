import {
  FormPageLayout,
  JsonPopover,
  RequestMethodSelect, SchemaPatternEnum,
  SchemaTypeSelect,
  useJsonMetaSchema,

} from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';
import { useNavigate } from 'react-router-dom';
import { FieldMetaConfig } from '@/pages/development/field-meta/services';
import { useFieldMetaDetail } from '@/pages/development/field-meta/hooks';

const MetaDetail = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(FieldMetaConfig.DETAIL);

  const [formConfig, loading] = useFieldMetaDetail();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <FormPageLayout
        pattern={SchemaPatternEnum.DETAIL}
        loading={loading}
        onBackClick={handleBackClick}
        formConfig={formConfig}
        hasGroup
        metaSchema={metaSchema}
        getLogicConfig={getLogicConfig}
        components={{
          SchemaTypeSelect,

          JsonPopover,
          RequestMethodSelect,
        }}
      />
    </>
  );
};

export default MetaDetail;
