import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import type { FormilyForm, FormConfigProps } from "@formlogic/render-vue";

import { useRoute } from "vue-router";

import { formvalidaterulesDetail } from "./service";

// 验证表单值
export const validateFormValues: (
  formValues: any,
  form: FormilyForm
) => Promise<boolean> = async () => {
  return true;
};

// 处理提交给后端的参数
export const formatFormValues: (formValues: any, form: FormilyForm) => any = (
  formValues
) => {
  return formValues;
};

export const useFormvalidaterulesDetail = (): [
  Ref<FormConfigProps>,
  Ref<boolean>
] => {
  const route = useRoute();

  const loading = ref(false);

  const formConfig = ref<FormConfigProps>({});

  onMounted(() => {
    const { code } = route.query || {};

    if (code) {
      loading.value = true;

      formvalidaterulesDetail({ code })
        .then((res) => {
          const { data } = res;

          formConfig.value = {
            initialValues: data,
          };
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });

  return [formConfig, loading];
};
