import { BackButton, Layout } from '@formlogic/component';

import { FlowChartEditor } from '@formlogic/editor';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LogicDetail = () => {
  const [URLSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Layout footer={<BackButton onClick={handleClick} />}>
      <FlowChartEditor
        logicProcessConfig={{
          code: URLSearchParams.get('code'),
          belongCode: URLSearchParams.get('belong'),
        }}
        pattern="DETAIL"
      />
    </Layout>
  );
};

export default LogicDetail;
