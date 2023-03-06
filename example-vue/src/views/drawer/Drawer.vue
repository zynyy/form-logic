<template>
  <list-layout
    :action="apiUrl.page"
    :get-logic-config="getLogicConfig"
    :reload-flag="reloadFlag"
    :page-code="DrawerConfig.LIST"
    @add="handleAdd"
    @edit="handleEdit"
    @detail="handleDetail"
    @remove="handleRemove"
  />

  <drawer-page-form
    :get-logic-config="getLogicConfig"
    :options="drawerPageOptions"
    :visible="drawerVisible"
    :has-confirm-button="false"
    :extra-logic-params="logicParams"
    :form-config="formConfig"
    @close="handleDrawerClose"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
  ListLayout,
  useReloadFlag,
  useOpen,
  getJsonMetaSchema,
  DrawerPageForm,
  SchemaPatternEnum,
} from "@formlogic/render-vue";

import type {
  TransformsSchemaOptions,
  FormConfigProps,
} from "@formlogic/render-vue";

import getLogicConfig from "@/low-code-meta/logic";

import { apiUrl, DrawerConfig, drawerDetail, drawerRemove } from "./service";

import { validateFormValues, formatFormValues } from "./hooks";

const [reloadFlag, refreshReloadFlag] = useReloadFlag();

const [drawerVisible, showDrawer, hiddenDrawer] = useOpen();

const drawerPageOptions = ref<TransformsSchemaOptions | null>(null);

const logicParams = ref({});
const formConfig = ref<FormConfigProps>({});

const handleDrawerClose = () => {
  hiddenDrawer();
};

const successCallback = () => {
  drawerPageOptions.value = null;
  refreshReloadFlag();
  hiddenDrawer();
};

const handleAdd = () => {
  showDrawer();

  formConfig.value = {};

  logicParams.value = {
    successCallback,
    action: apiUrl.create,
    extraParams: {},
    validateFormValues,
    formatFormValues,
  };

  getJsonMetaSchema(DrawerConfig.CREATE).then((metaSchema) => {
    drawerPageOptions.value = {
      metaSchema,
      hasGroup: true,
    };
  });
};

const getRecordDetail = (record: any) => {
  drawerDetail({ code: record.code }).then((res) => {
    const { data } = res;
    formConfig.value = {
      initialValues: data,
    };
  });
};

const handleEdit = (index: number, record: any) => {
  showDrawer();

  getRecordDetail(record);

  logicParams.value = {
    successCallback,
    action: apiUrl.update,
    extraParams: {},
    validateFormValues,
    formatFormValues,
  };

  getJsonMetaSchema(DrawerConfig.EDIT).then((metaSchema) => {
    drawerPageOptions.value = {
      metaSchema,
      hasGroup: true,
    };
  });
};

const handleDetail = (index: number, record: any) => {
  showDrawer();

  getRecordDetail(record);

  getJsonMetaSchema(DrawerConfig.DETAIL).then((metaSchema) => {
    drawerPageOptions.value = {
      metaSchema,
      hasGroup: true,
      pattern: SchemaPatternEnum.DETAIL,
    };
  });
};

const handleRemove = (index: number, record: any) => {
  const { code } = record || {};
  drawerRemove({ code }).then(() => {
    refreshReloadFlag();
  });
};
</script>

<style scope></style>
