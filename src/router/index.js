import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layout/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
        },
        {
          path: "/detail/:id",
          name: "detail",
          component: () => import("@/views/DetailView.vue"),
          props: true,
        },
        {
          path: "/history",
          name: "history",
          component: () => import("@/views/HistoryView.vue"),
        },
      ],
    },
  ],
});

export default router;
