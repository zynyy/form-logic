//isForm
import { Form } from '@formlogic/render-core-vue2';
/// import { onExecLogicDone, onTransformOptionsChange } from '@/effect-hook';
// import { uid } from '@formlogic/render-core-vue2';
// onBeforeUnmount, ref, shallowRef, unref, watchEffect
import { Ref } from 'vue';

// const DEV_TOOLS = '__FORMLOGIC_DEV_TOOLS_HOOK__';

const useNotifyDevtools = (formRef: Ref<Form>) => {
  // const execLogicHistoryRef = shallowRef([]);
  //
  // const transformOptions = shallowRef();
  //
  // const updateDevtools = () => {
  //   const form = formRef.value;
  //   // @ts-ignore
  //   globalThis[DEV_TOOLS]?.update(form.id, {
  //     options: JSON.parse(JSON.stringify(transformOptions.value ?? {})),
  //     execLogicList: JSON.parse(
  //       JSON.stringify(execLogicHistoryRef.value ?? {}),
  //     ),
  //   });
  // };
  //
  // const effectIdRef = ref(`devtools_${uid()}`);
  //
  // const addEffectsStop = watchEffect((onCleanup) => {
  //   const effectId = effectIdRef.value;
  //   const form = formRef.value;
  //
  //   onCleanup(() => {
  //     execLogicHistoryRef.value = [];
  //
  //     form?.removeEffects(effectId);
  //   });
  //
  //   form?.addEffects(effectId, () => {
  //     onExecLogicDone((payload: any) => {
  //       if (!isForm(payload)) {
  //         execLogicHistoryRef.value = payload.concat(
  //           unref(execLogicHistoryRef),
  //         );
  //         updateDevtools();
  //       }
  //     });
  //
  //     onTransformOptionsChange((payload: any) => {
  //       if (!isForm(payload)) {
  //         transformOptions.value = payload;
  //         updateDevtools();
  //       }
  //     });
  //   });
  // });
  //
  // const devToolsMsgStop = watchEffect((onCleanup) => {
  //   onCleanup(() => {
  //     window.removeEventListener('message', () => {});
  //   });
  //
  //   window.addEventListener('message', (event) => {
  //     const { data } = event || {};
  //
  //     const { source, type } = data || {};
  //
  //     if (source === '@formlogic-devtools-background-script') {
  //       switch (type) {
  //         case 'connect': {
  //           // @ts-ignore
  //           globalThis[DEV_TOOLS]?.connectDevtools();
  //           break;
  //         }
  //
  //         default: {
  //           break;
  //         }
  //       }
  //     }
  //   });
  // });
  //
  // const devToolsStop = watchEffect((onCleanup) => {
  //   const form = formRef.value;
  //
  //   if (form?.id) {
  //     // @ts-ignore
  //     globalThis[`${DEV_TOOLS}`]?.inject(form.id, form);
  //   }
  //
  //   onCleanup(() => {
  //     if (form?.id) {
  //       // @ts-ignore
  //       globalThis[DEV_TOOLS]?.unmount(form.id);
  //     }
  //   });
  // });
  //
  // onBeforeUnmount(() => {
  //   addEffectsStop();
  //   devToolsStop();
  //   devToolsMsgStop();
  // });
};

export default useNotifyDevtools;
