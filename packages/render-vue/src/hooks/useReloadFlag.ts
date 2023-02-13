import { Ref, ref } from "vue";

const useReloadFlag = (): [Ref<number>, () => void] => {
  const reloadFlag = ref<number>(0);

  const refreshFlag = () => {
    reloadFlag.value = reloadFlag.value + 1;
  };

  return [reloadFlag, refreshFlag];
};

export default useReloadFlag;
