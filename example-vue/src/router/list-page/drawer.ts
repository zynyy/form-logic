import type { RouteRecordRaw } from "vue-router";

const DrawerRoute: RouteRecordRaw[] = [
  {
    path: "/drawer",
    component: () => import("@/views//drawer/Drawer.vue"),
  },
];

export default DrawerRoute;
