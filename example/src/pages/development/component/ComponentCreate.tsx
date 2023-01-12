import {
  FormPageLayout,
  RequestMethodSelect,
  useJsonMetaSchema,
  YesNoRadio,
  JsonPopover,
} from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import { apiUrl, ComponentConfig } from './services';
import getLogicConfig from '@/low-code-meta/logic';

import PageCodeSelect from '@/components/page-code-select';
import JsonMonacoEditor from '@/components/json-monaco-editor';

const ComponentCreate = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(ComponentConfig.CREATE);

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
          JsonPopover,
          YesNoRadio,
          RequestMethodSelect,
          JsonMonacoEditor
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

export default ComponentCreate;
