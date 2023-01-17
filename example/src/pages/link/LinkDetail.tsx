import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchemaPatternEnum, FormPageLayout, useJsonMetaSchema } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';

import { useLinkDetail } from './hooks';

import { LinkConfig } from './service';

interface LinkDetailProps {}

const LinkCreate: FC<LinkDetailProps> = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(LinkConfig.DETAIL);

  const [formConfig, loading] = useLinkDetail();

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

export default LinkCreate;
