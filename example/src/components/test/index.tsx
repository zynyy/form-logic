import { FormPageLayout } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';
import { useMetaSchema } from '@/hooks';
import getLogicConfig from '@/low-code-meta/logic';



const MetaCreate = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema("Test_C");

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

        metaSchema={metaSchema}
        getLogicConfig={getLogicConfig}
        components={{

        }}
        extraLogicParams={{
          successCallback,
          action: "/",
          extraParams: {},
        }}
      />
    </>
  );

}

export default MetaCreate
