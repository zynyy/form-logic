import { Form, uid, useForm } from '@formlogic/render-core-vue2';
import { onMounted, Ref, ref, watch } from 'vue';

import { COMPONENT_DATA_SOURCE_CHANGE, onComponentDataSourceChange } from '@/effect-hook';

export const useNotifyComponentDataSource = () => {
  const form = useForm();

  const notify = () => {
    form.value?.notify?.(COMPONENT_DATA_SOURCE_CHANGE);
  };

  return [notify];
};

export const useTriggerComponentDataSourceChange = (form: Ref<Form>, cb: () => void) => {
  const componentId = ref(uid());

  const addEffect = () => {
    if (form.value.id) {
      form.value.addEffects(componentId, () => {
        onComponentDataSourceChange(cb);
      });
    }
  };

  watch(
    () => form.value.id,
    () => {
      addEffect();
    },
  );

  onMounted(() => {
    addEffect();
  });
};
