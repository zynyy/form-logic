<template>
  <form-page-layout
    :get-logic-config="getLogicConfig"
    :pattern="SchemaPatternEnum.DETAIL"
    :has-group="true"
    :page-code="LinkConfig.DETAIL"
    :form-config="formConfig"
    :loading="loading"
    @back-click="handleBackClick"
  />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import getLogicConfig from "@/low-code-meta/logic";
import { LinkConfig } from "./service";

import { useLinkDetail } from "./hooks";

import { SchemaPatternEnum, FormPageLayout } from "@formlogic/render-vue";

const router = useRouter();

const [formConfig, loading] = useLinkDetail();

const handleBackClick = () => {
  router.go(-1);
};

const successCallback = () => {
  handleBackClick();
};
</script>

<style scope></style>
