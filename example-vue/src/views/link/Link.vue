<template>
  <list-layout
    :action="apiUrl.page"
    :get-logic-config="getLogicConfig"
    :reload-flag="reloadFlag"
    :page-code="LinkConfig.LIST"
    @add="handleAdd"
    @edit="handleEdit"
    @detail="handleDetail"
    @remove="handleRemove"
  />
</template>

<script setup lang="ts">
import getLogicConfig from "@/low-code-meta/logic";

import { apiUrl, LinkConfig, linkRemove } from "./service";

import { ListLayout, useReloadFlag } from "@formlogic/render-vue";

import { useRouter } from "vue-router";

const [reloadFlag, refreshReloadFlag] = useReloadFlag();

const router = useRouter();

const handleAdd = () => {
  router.push({
    path: LinkConfig.CREATE_LINK,
  });
};

const handleEdit = (index: number, record: any) => {
  const { code } = record || {};

  router.push({
    path: LinkConfig.EDIT_LINK,
    query: {
      code,
    },
  });
};

const handleDetail = (index: number, record: any) => {
  const { code } = record || {};
  router.push({
    path: LinkConfig.DETAIL_LINK,
    query: {
      code,
    },
  });
};

const handleRemove = (index: number, record: any) => {
  const { code } = record || {};
  linkRemove({ code }).then(() => {
    refreshReloadFlag();
  });
};
</script>

<style scope></style>
