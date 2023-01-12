import { Layout, BackButton } from '@formlogic/component';

import { FlowChartEditor } from '@formlogic/editor';
import { useNavigate } from 'react-router-dom';

const LogicCreate = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Layout footer={<BackButton onClick={handleClick} />}>
      <FlowChartEditor />
    </Layout>
  );
};

export default LogicCreate;
