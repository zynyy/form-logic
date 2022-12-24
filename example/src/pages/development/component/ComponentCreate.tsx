import { FormPageLayout } from '@formlogic/render';
import { getLocalConfig } from '@formlogic/render/lib/service';


const ComponentCreate = () => {


  return <FormPageLayout getLogicConfig={getLocalConfig} />

}

export default ComponentCreate
