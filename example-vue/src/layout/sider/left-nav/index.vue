<template>
  <Sider width="{160}" :collapsible="true" :trigger="null" :collapsed="false">
    <Menu
      mode="inline"
      :selectedKeys="selectedKeys"
      :openKeys="openKeys"
      @openChange="handleOpenChange"
      inlineIndent="15"
      :items="menus"
      :style="{
        height: '100%',
      }"
    />
  </Sider>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Layout, Menu } from "ant-design-vue";

const { Sider } = Layout;

const selectedKeys = ref([]);
const openKeys = ref([]);
const menus = ref([]);

const handleOpenChange = () => {};
</script>
