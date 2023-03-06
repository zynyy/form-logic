import type { RouteRecordRaw } from "vue-router";

const ModalRoute: RouteRecordRaw[] = [
  {
    path: "/modal",
    component: () => import("@/views//modal/Modal.vue"),
  },
];

export default ModalRoute;
