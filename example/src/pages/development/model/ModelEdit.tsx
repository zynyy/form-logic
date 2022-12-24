import { FormPageLayout } from '@formlogic/render';
import { getLocalConfig } from '@formlogic/render/lib/service';

const ModelEdit = () => {
  return <FormPageLayout getLogicConfig={getLocalConfig} />;
};

export default ModelEdit;
