import { Form } from '@formlogic/render-core-vue2';
import { Ref, ref } from 'vue';

import { useTriggerComponentDataSourceChange } from '@/hooks/notify';
import { getFormValuesTag } from '@/utils/formUtils';

const useSearchWhereTagGroups = (
  form: Ref<Form>,
  formValues?: Ref<Record<string, any>>,
): [Ref<any[]>, () => void] => {
  const tagGroups = ref<any[]>([]);

  const setTagGroups = () => {
    tagGroups.value = getFormValuesTag(form.value, formValues?.value);
  };

  useTriggerComponentDataSourceChange(form, setTagGroups);

  return [tagGroups, setTagGroups];
};

export default useSearchWhereTagGroups;
