import { isEqual } from '@formily/shared';
import { ref, shallowRef } from 'vue';

// Keep input cursor in the correct position when we use formatter.
export const useInputCursor = (): [
  () => void,
  (nowValue: string) => void,
  (dom: HTMLInputElement) => void,
] => {
  const selectionRef = ref<{
    selectionStart?: number;
    selectionEnd?: number;
    value?: string;
    beforeTxt?: string;
    afterTxt?: string;
  }>();

  const input = shallowRef();

  function recordCursor() {
    if (input.value == undefined) return;

    const { selectionStart, selectionEnd, value } = input.value;

    if (selectionStart == null || selectionEnd == null) return;

    const beforeTxt = value.slice(0, Math.max(0, selectionStart));
    const afterTxt = value.slice(Math.max(0, selectionEnd));

    selectionRef.value = {
      selectionStart,
      selectionEnd,
      value,
      beforeTxt,
      afterTxt,
    };
  }
  function setCursor(nowValue: string) {
    if (input.value == undefined || selectionRef.value == undefined) return;

    if (!isEqual(input.value.value, nowValue)) {
      input.value.value = nowValue || '';
    }

    const { value } = input.value;

    const { beforeTxt, afterTxt, selectionStart } = selectionRef.value;

    if (beforeTxt == undefined || afterTxt == undefined || selectionStart == undefined) return;

    let startPos = value.length;

    if (value.endsWith(afterTxt)) {
      startPos = value.length - afterTxt.length;
    } else if (value.startsWith(beforeTxt)) {
      startPos = beforeTxt.length;
    } else {
      const beforeLastChar = beforeTxt[selectionStart - 1];
      const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
      if (newIndex !== -1) {
        startPos = newIndex + 1;
      }
    }

    input.value.setSelectionRange(startPos, startPos);
  }

  const setInputRef = (dom: HTMLInputElement) => {
    input.value = dom;
  };

  return [recordCursor, setCursor, setInputRef];
};
