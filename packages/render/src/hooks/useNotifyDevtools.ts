import { Form, isForm } from '@formily/core';
import { useEffect, useRef } from 'react';
import { onExecLogicDone, onTransformOptionsChange } from '@/effect-hook';
import { uid } from '@formlogic/component';

const DEV_TOOLS = '__FORMLOGIC_DEV_TOOLS_HOOK__';

const useNotifyDevtools = (form: Form) => {
  const execLogicHistoryRef = useRef([]);

  const transformOptions = useRef();

  const updateDevtools = () => {
    globalThis[DEV_TOOLS]?.update(form.id, {
      options: transformOptions.current,
      execLogicList: execLogicHistoryRef.current,
    });
  };

  useEffect(() => {
    const effectId = uid();

    form?.addEffects(effectId, () => {
      onExecLogicDone((payload) => {
        if (!isForm(payload)) {
          execLogicHistoryRef.current = payload.concat(execLogicHistoryRef.current);
          updateDevtools();
        }
      });

      onTransformOptionsChange((payload) => {
        if (!isForm(payload)) {
          transformOptions.current = payload;
          updateDevtools();
        }
      });
    });

    return () => {
      form?.removeEffects(effectId);
    };
  }, [form?.id]);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const { data } = event || {};

      const { source, type } = data || {};

      if (source === '@formlogic-devtools-background-script') {
        switch (type) {
          case 'connect': {
            globalThis[DEV_TOOLS]?.connectDevtools();
            break;
          }

          default: {
            break;
          }
        }
      }
    });

    return () => {
      window.removeEventListener('message', () => {});
    };
  }, []);

  useEffect(() => {
    if (form?.id) {
      globalThis[DEV_TOOLS]?.inject(form.id, form);
    }

    return () => {
      if (form?.id) {
        globalThis[DEV_TOOLS]?.unmount(form.id);
      }
    };
  }, [form?.id]);
};

export default useNotifyDevtools;
