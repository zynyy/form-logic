import type { RouteRecordRaw } from "vue-router";

const LinkRoute: RouteRecordRaw[] = [
  {
    path: "/link",
    component: () => import("@/views//link/Link.vue"),
  },

  {
    path: "/link/create",
    component: () => import("@/views/link/LinkCreate.vue"),
  },

  {
    path: "/link/edit",
    component: () => import("@/views/link/LinkEdit.vue"),
  },

  {
    path: "/link/detail",
    component: () => import("@/views/link/LinkDetail.vue"),
  },
];

export default LinkRoute;
