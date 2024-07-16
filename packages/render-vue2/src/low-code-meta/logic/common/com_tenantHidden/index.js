import { getUserInfo } from '@/utils/storage';

const com_tenantHidden = ({ field }) => {
  const { tenantId } = getUserInfo();

  field.visible = !tenantId;
};

export default com_tenantHidden;
