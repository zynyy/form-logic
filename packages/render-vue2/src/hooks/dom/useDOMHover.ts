import { Ref, ref, watchEffect } from 'vue';

const useDOMHover = <DOM extends HTMLElement>(): [
  Ref<boolean>,
  Ref<DOM | undefined>,
] => {
  const hover = ref(false);

  const domRef = ref<DOM>();

  watchEffect((onCleanup) => {
    if (domRef.value) {
      domRef.value.addEventListener('mouseover', () => {
        hover.value = true;
      });
      domRef.value.addEventListener('mouseout', () => {
        hover.value = false;
      });
    }

    onCleanup(() => {
      if (domRef.value) {
        domRef.value.removeEventListener('mouseover', () => {});
        domRef.value.removeEventListener('mouseout', () => {});
      }
    });
  });

  return [hover, domRef];
};

export default useDOMHover;
