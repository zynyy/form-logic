import { useMode } from '@/hooks';

import { Node } from '@antv/x6';
import {
  EFFECT_HOOK_ADD_GRAPH_EVENT,
  EFFECT_HOOK_NODE,
  LOGIC_PROCESS_ADD_GRAPH_EVENT,
  LOGIC_PROCESS_NODE,
  MODEL_PAGE_NODE,
  PAGE_DATA_ADD_GRAPH_EVENT,
  PAGE_DATA_NODE,
} from '@/utils/constant';
import { useEffect, useState } from 'react';

export const usePlusClick = (node: Node): [() => void, boolean] => {
  const { isEffectHookMode, isFieldMode, isGridMode, isLogicMode, isEditable } = useMode();

  const [showPlus, setShowPlus] = useState(isEditable);

  const triggerCreatePageData = () => {
    node.model.graph.trigger(PAGE_DATA_ADD_GRAPH_EVENT, { node });
  };

  const triggerCreateEffectHook = () => {
    node.model.graph.trigger(EFFECT_HOOK_ADD_GRAPH_EVENT, { node });
  };

  const triggerCreateLogicProcess = () => {
    node.model.graph.trigger(LOGIC_PROCESS_ADD_GRAPH_EVENT, { node });
  };

  const handleClick = () => {
    switch (node.shape) {
      case MODEL_PAGE_NODE: {
        if (isFieldMode || isGridMode) {
          triggerCreatePageData();
        }

        if (isEffectHookMode) {
          triggerCreateEffectHook();
        }

        if (isLogicMode) {
          triggerCreateLogicProcess();
        }

        break;
      }

      case PAGE_DATA_NODE: {
        if (isFieldMode) {
          triggerCreateEffectHook();
        }

        if (isLogicMode) {
          triggerCreateEffectHook();
        }

        break;
      }

      case EFFECT_HOOK_NODE: {
        if (isFieldMode) {
          triggerCreateLogicProcess();
        }

        if (isEffectHookMode) {
          triggerCreateLogicProcess();
        }

        break;
      }

      case LOGIC_PROCESS_NODE: {
        if (!isFieldMode) {
          triggerCreatePageData();
        }

        break;
      }

      default: {
        break;
      }
    }
  };

  useEffect(() => {
    switch (node.shape) {
      case MODEL_PAGE_NODE: {
        setShowPlus(isEditable);
        break;
      }

      case PAGE_DATA_NODE: {
        if (isEffectHookMode) {
          setShowPlus(false);
        } else {
          setShowPlus(isEditable);
        }

        break;
      }

      case EFFECT_HOOK_NODE: {
        if (isLogicMode) {
          setShowPlus(false);
        } else {
          setShowPlus(isEditable);
        }

        break;
      }

      case LOGIC_PROCESS_NODE: {
        if (isFieldMode) {
          setShowPlus(false);
        } else {
          setShowPlus(isEditable);
        }
      }
    }
  }, [node.shape, isEditable, isEffectHookMode, isLogicMode, isFieldMode]);

  return [handleClick, showPlus];
};
