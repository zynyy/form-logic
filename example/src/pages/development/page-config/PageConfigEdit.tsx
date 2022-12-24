import { FormPageLayout } from '@formlogic/render';
import { getLocalConfig } from '@formlogic/render/lib/service';


const PageConfigEdit = () => {


  return <FormPageLayout getLogicConfig={getLocalConfig} />

}

export default PageConfigEdit
