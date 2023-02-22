<template>
 <router-view></router-view>
</template>

<script setup lang="ts">
import getLogicConfig from "@/low-code-meta/logic";

import { useRouter } from "vue-router";

const router = useRouter();

const handleAdd = () => {};

const handleEdit = () => {};

const handleDetail = (index, record) => {
  router.push({
    path: "/demo",
    query: {
      code: "11",
    },
  });
};

const handleRemove = () => {};
</script>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>
