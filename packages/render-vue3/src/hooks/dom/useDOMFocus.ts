import { Ref, ref, watchEffect } from 'vue';

const useDOMFocus = <DOM extends HTMLElement>(): [
  Ref<boolean>,
  Ref<DOM | undefined>,
] => {
  const isFocus = ref(false);

  const domRef = ref<DOM>();

  watchEffect((onCleanup) => {
    if (domRef.value) {
      domRef.value.addEventListener(
        'focus',
        () => {
          isFocus.value = true;
        },
        {
          capture: true,
        },
      );
      domRef.value.addEventListener(
        'blur',
        () => {
          isFocus.value = false;
        },
        {
          capture: true,
        },
      );
    }
    onCleanup(() => {
      if (domRef.value) {
        domRef.value.removeEventListener('focus', () => {});
        domRef.value.removeEventListener('focusout', () => {});
      }
    });
  });

  return [isFocus, domRef];
};

export default useDOMFocus;
