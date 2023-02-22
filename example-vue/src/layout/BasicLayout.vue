<template>
  <Layout
    :style="{
      height: '100%',
    }"
  >
    <Header>
      <GlobalHeader />
    </Header>

    <Layout>
      <LeftNav />
      <Layout>
        <Content className="page-container">
          <PageHeader :breadcrumb="breadcrumb"> </PageHeader>

          <div
            :style="{
              height,
            }"
            class="page-content-wrap"
          >
            <router-view />
          </div>
        </Content>
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Layout, PageHeader } from "ant-design-vue";

import LeftNav from "./sider/left-nav/index.vue";
import GlobalHeader from "./header/global-header/index.vue";

const { Header, Content } = Layout;

const height = ref("100%");
const breadcrumb = ref([]);
</script>
