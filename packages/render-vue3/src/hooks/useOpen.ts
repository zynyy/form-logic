import { Ref, ref } from 'vue';

export const useOpen = (): [Ref<boolean>, () => void, () => void] => {
  const openToggle = ref(false);

  const show = () => {
    openToggle.value = true;
  };

  const hidden = () => {
    openToggle.value = false;
  };

  return [openToggle, show, hidden];
};
