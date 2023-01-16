import { FormPageLayout, JsonPopover, RequestMethodSelect, useJsonMetaSchema } from '@formlogic/render';

import { useNavigate } from 'react-router-dom';
import { apiUrl, ComponentConfig } from '@/pages/development/component/services';
import getLogicConfig from '@/low-code-meta/logic';

import PageCodeSelect from '@/components/page-code-select';
import { useComponentDetail } from '@/pages/development/component/hooks';
import JsonMonacoEditor from '@/components/json-monaco-editor';

const ComponentEdit = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(ComponentConfig.EDIT);

  const [formConfig, loading] = useComponentDetail();

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

          PageCodeSelect,
          JsonPopover,
          RequestMethodSelect,
          JsonMonacoEditor
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

export default ComponentEdit;
