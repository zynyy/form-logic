import type { RouteRecordRaw } from "vue-router";

const FormvalidaterulesRoute: RouteRecordRaw[] = [
  {
    path: "/FormValidateRules",
    component: () => import("@/views//FormValidateRules/index.vue"),
  },

  {
    path: "/FormValidateRules/create",
    component: () =>
      import("@/views/FormValidateRules/FormvalidaterulesCreate.vue"),
  },

  {
    path: "/FormValidateRules/edit",
    component: () =>
      import("@/views/FormValidateRules/FormvalidaterulesEdit.vue"),
  },

  {
    path: "/FormValidateRules/detail",
    component: () =>
      import("@/views/FormValidateRules/FormvalidaterulesDetail.vue"),
  },
];

export default FormvalidaterulesRoute;
