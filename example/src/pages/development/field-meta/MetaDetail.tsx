import { FormPageLayout } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';

const MetaDetail = () => {
  return <FormPageLayout getLogicConfig={getLogicConfig} />;
};

export default MetaDetail;
