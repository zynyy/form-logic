import { ListNormal } from '@formlogic/render';
import { useSearchParams, useParams, useLocation ,} from 'react-router-dom';


const ModelCreate = () => {
  const location= useLocation();

  console.log(location)

  return <span>
    组件
  </span>

}

export default ModelCreate
