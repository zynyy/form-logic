<template>
  <form-page-layout
    :get-logic-config="getLogicConfig"
    :has-group="true"
    :page-code="ListConfig.CREATE"
    :extra-logic-params="extraLogicParams"
    @back-click="handleBackClick"
  />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import getLogicConfig from "@/low-code-meta/logic";
import { FormPageLayout } from "@formlogic/render-vue";
import { apiUrl, ListConfig } from "./service";

import { validateFormValues, formatFormValues } from "./hooks";

const router = useRouter();

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
