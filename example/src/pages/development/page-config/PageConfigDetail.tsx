import { FormPageLayout } from '@formlogic/render';
import { getLocalConfig } from '@formlogic/render/lib/service';


const PageConfigDetail = () => {


  return <FormPageLayout getLogicConfig={getLocalConfig} />

}

export default PageConfigDetail
