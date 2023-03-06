<template>
  <list-layout
    :action="apiUrl.page"
    :get-logic-config="getLogicConfig"
    :reload-flag="reloadFlag"
    :page-code="ModalConfig.LIST"
    @add="handleAdd"
    @edit="handleEdit"
    @detail="handleDetail"
    @remove="handleRemove"
  />

  <modal-page-form
    :get-logic-config="getLogicConfig"
    :options="modalPageOptions"
    :visible="modalVisible"
    :has-confirm-button="false"
    :extra-logic-params="logicParams"
    :form-config="formConfig"
    @close="handleModalClose"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
  ListLayout,
  useReloadFlag,
  useOpen,
  getJsonMetaSchema,
  ModalPageForm,
  SchemaPatternEnum,
} from "@formlogic/render-vue";

import type {
  TransformsSchemaOptions,
  FormConfigProps,
} from "@formlogic/render-vue";

import getLogicConfig from "@/low-code-meta/logic";

import { apiUrl, ModalConfig, modalDetail, modalRemove } from "./service";

import { validateFormValues, formatFormValues } from "./hooks";

const [reloadFlag, refreshReloadFlag] = useReloadFlag();

const [modalVisible, showModal, hiddenModal] = useOpen();

const modalPageOptions = ref<TransformsSchemaOptions | null>(null);

const logicParams = ref({});
const formConfig = ref<FormConfigProps>({});

const handleModalClose = () => {
  hiddenModal();
};

const successCallback = () => {
  modalPageOptions.value = null;
  refreshReloadFlag();
  hiddenModal();
};

const handleAdd = () => {
  showModal();

  formConfig.value = {};

  logicParams.value = {
    successCallback,
    action: apiUrl.create,
    extraParams: {},
    validateFormValues,
    formatFormValues,
  };

  getJsonMetaSchema(ModalConfig.CREATE).then((metaSchema) => {
    modalPageOptions.value = {
      metaSchema,
      hasGroup: true,
    };
  });
};

const getRecordDetail = (record: any) => {
  modalDetail({ code: record.code }).then((res) => {
    const { data } = res;
    formConfig.value = {
      initialValues: data,
    };
  });
};

const handleEdit = (index: number, record: any) => {
  showModal();

  getRecordDetail(record);

  logicParams.value = {
    successCallback,
    action: apiUrl.update,
    extraParams: {},
    validateFormValues,
    formatFormValues,
  };

  getJsonMetaSchema(ModalConfig.EDIT).then((metaSchema) => {
    modalPageOptions.value = {
      metaSchema,
      hasGroup: true,
    };
  });
};

const handleDetail = (index: number, record: any) => {
  showModal();

  getRecordDetail(record);

  getJsonMetaSchema(ModalConfig.DETAIL).then((metaSchema) => {
    modalPageOptions.value = {
      metaSchema,
      hasGroup: true,
      pattern: SchemaPatternEnum.DETAIL,
    };
  });
};

const handleRemove = (index: number, record: any) => {
  const { code } = record || {};
  modalRemove({ code }).then(() => {
    refreshReloadFlag();
  });
};
</script>

<style scope></style>
