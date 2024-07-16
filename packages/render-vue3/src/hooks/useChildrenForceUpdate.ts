import Vue, { ref } from 'vue';

const useChildrenForceUpdate = () => {
  const componentRef = ref();
  const forceUpdateChildrenAndGrandchildrenRecursive = (component: Vue) => {
    component.$children.forEach((child) => {
      child.$forceUpdate();
      forceUpdateChildrenAndGrandchildrenRecursive(child);
    });
  };

  const forceUpdate = () => {
    componentRef.value.$children.forEach((child: Vue) => {
      child.$forceUpdate();
      forceUpdateChildrenAndGrandchildrenRecursive(child);
    });
  };

  return {
    componentRef,
    forceUpdate,
  };
};

export default useChildrenForceUpdate;
