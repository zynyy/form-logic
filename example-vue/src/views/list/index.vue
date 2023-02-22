<template>
  <list-layout
    :action="apiUrl.page"
    :get-logic-config="getLogicConfig"
    :reload-flag="reloadFlag"
    :page-code="ListConfig.LIST"
    @add="handleAdd"
    @edit="handleEdit"
    @detail="handleDetail"
    @remove="handleRemove"
  >
  </list-layout>
</template>

<script setup lang="ts">
import getLogicConfig from "@/low-code-meta/logic";

import { apiUrl, ListConfig, listRemove } from "./service";

import { ListLayout, useReloadFlag } from "@formlogic/render-vue";

import { useRouter } from "vue-router";

const [reloadFlag, refreshReloadFlag] = useReloadFlag();

const router = useRouter();

const handleAdd = () => {
  router.push({
    path: ListConfig.CREATE_LINK,
  });
};

const handleEdit = (index, record) => {
  const { code } = record || {};

  router.push({
    path: ListConfig.EDIT_LINK,
    query: {
      code,
    },
  });
};

const handleDetail = (index, record) => {
  const { code } = record || {};
  router.push({
    path: ListConfig.DETAIL_LINK,
    query: {
      code,
    },
  });
};

const handleRemove = (index, record) => {
  const { code } = record || {};
  listRemove({ code }).then(() => {
    refreshReloadFlag();
  });
};
</script>

<style scope></style>
