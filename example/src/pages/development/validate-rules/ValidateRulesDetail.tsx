import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchemaPatternEnum, FormPageLayout, useJsonMetaSchema } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';

import { useValidateRulesDetail } from './hooks';

import { ValidateRulesConfig } from './service';

interface ValidateRulesDetailProps {}

const ValidateRulesCreate: FC<ValidateRulesDetailProps> = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(ValidateRulesConfig.DETAIL);

  const [formConfig, loading] = useValidateRulesDetail();

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
    />
  );
};

export default ValidateRulesCreate;
