import type { RouteRecordRaw } from "vue-router";

const ListRoute: RouteRecordRaw[] = [
  {
    path: "/list",
    component: () => import("@/views//list/index.vue"),
  },

  {
    path: "/list/create",
    component: () => import("@/views/list/ListCreate.vue"),
  },

  {
    path: "/list/edit",
    component: () => import("@/views/list/ListEdit.vue"),
  },

  {
    path: "/list/detail",
    component: () => import("@/views/list/ListDetail.vue"),
  },
];

export default ListRoute;
