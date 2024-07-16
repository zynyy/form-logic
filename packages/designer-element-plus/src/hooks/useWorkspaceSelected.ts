import { useCurrentWorkspaceId } from './useCurrentWorkspaceId';
import { useSelected } from './useSelected';

export const useWorkspaceSelected = () => {
  const currentWorkspaceId = useCurrentWorkspaceId();

  return useSelected(currentWorkspaceId);
};
