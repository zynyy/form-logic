import { FormPageLayout } from '@formlogic/render';
import { getLocalConfig } from '@formlogic/render/lib/service';


const LogicEdit = () => {


  return <FormPageLayout getLogicConfig={getLocalConfig} />

}

export default LogicEdit
