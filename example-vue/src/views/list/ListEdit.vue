<template>
  <form-page-layout
    :get-logic-config="getLogicConfig"
    :has-group="true"
    :page-code="ListConfig.EDIT"
    :extra-logic-params="extraLogicParams"
    :form-config="formConfig"
    :loading="loading"
    @back-click="handleBackClick"
  />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { FormPageLayout } from "@formlogic/render-vue";
import getLogicConfig from "@/low-code-meta/logic";
import { apiUrl, ListConfig } from "./service";

import { validateFormValues, formatFormValues, useListDetail } from "./hooks";

const router = useRouter();

const [formConfig, loading] = useListDetail();

const handleBackClick = () => {
  router.go(-1);
};

const successCallback = () => {
  handleBackClick();
};

const extraLogicParams = ref({
  successCallback,
  action: apiUrl.create,
  extraParams: {},
  validateFormValues,
  formatFormValues,
});
</script>

<style scope></style>
