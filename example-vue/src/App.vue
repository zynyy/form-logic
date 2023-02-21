<script setup lang="ts">
import { RouterLink } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

import type { MetaSchema } from "@formlogic/render-vue";

import { useCreateForm, useFormSchema } from "@formlogic/render-vue";
import { ref } from "vue";
import getLogicConfig from "@formlogic/render-vue/lib/low-code-meta/logic";

const metaSchema: MetaSchema = {
  code: "Model_C",
  name: "模型新增",
  model: "Model",
  labelCol: 6,
  wrapperCol: 18,
  columnLayout: 3,
  group: [
    { code: "basicInfo", name: "基础信息" },
    { code: "metaInfo", name: "字段信息" },
  ],
  data: [
    {
      code: "code",
      name: "编码",
      type: "column",
      schemaType: "string",
      required: "1",
      group: "basicInfo",
      logics: [],
    },
    {
      code: "name",
      name: "名称",
      type: "column",
      schemaType: "string",
      required: "1",
      group: "basicInfo",
      logics: [],
    },
    {
      code: "type",
      name: "保存",
      type: "button",
      schemaType: "string",
      required: "1",
      logics: [
        { logicCode: "com_save", effectHook: "onClick", hasChildren: false },
      ],
    },
  ],
};

const formSchemaRef = useFormSchema(ref({ metaSchema }));

const { schema } = formSchemaRef.value;

const [form] = useCreateForm(
  ref({
    formConfig: {
      values: {},
    },
  })
);

const tableMount = () => {};
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>


  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
