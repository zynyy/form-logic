import { FormPageLayout, } from '@formlogic/render';
import { getLocalConfig } from '@formlogic/render/lib/service';


const LogicDetail = () => {


  return <FormPageLayout getLogicConfig={getLocalConfig} />

}

export default LogicDetail
