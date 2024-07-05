import { useCurrentNode } from './useCurrentNode';
import { useCurrentWorkspaceId } from './useCurrentWorkspaceId';

export const useWorkspaceCurrentNode = () => {
  const currentWorkspaceId = useCurrentWorkspaceId();

  return useCurrentNode(currentWorkspaceId);
};
