import { FormPageLayout, } from '@formlogic/render';
import { getLocalConfig } from '@formlogic/render/lib/service';


const LogicCreate = () => {


  return <FormPageLayout getLogicConfig={getLocalConfig} />

}

export default LogicCreate
