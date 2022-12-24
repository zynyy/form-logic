import { FormPageLayout } from '@formlogic/render';
import { useSearchParams } from 'react-router-dom';
import { getLocalConfig } from '@formlogic/render/lib/service';


const PageConfigCreate = () => {

  const searchParams= useSearchParams();

  console.log(searchParams)



  return <FormPageLayout getLogicConfig={getLocalConfig} />

}

export default PageConfigCreate
