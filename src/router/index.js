import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout";
import messageRoute from "./modules/message.js";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Layout,
    redirect: "/main",
    meta: {
      title: "main",
      keepAlive: true,
    },
    children: [
      {
        path: "/main",
        meta: {
          title: "AlgoLaser Library",
          // keepAlive: true,
        },
        component: () => import("@/views/main/index"),
      },
      {
        path: "/upload/:sourceId?",
        meta: {
          title: "AlgoLaser Library - Upload",
        },
        component: () => import("@/views/upload/index"),
      },
      {
        path: "/upload",
        meta: {
          title: "upload",
        },
        component: () => import("@/views/upload/index"),
      },
      {
        path: "/search",
        meta: {
          title: "AlgoLaser Library - Search",
          // keepAlive: true,
        },
        component: () => import("@/views/search/index"),
      },
      {
        path: "/community",
        meta: {
          title: "AlgoLaser Library - Community",
        },
        component: () => import("@/views/community/index"),
      },

      {
        path: "/community/:id",
        meta: {
          title: "AlgoLaser Library - Community",
        },
        component: () => import("@/views/community/view"),
      },

      {
        path: "/postCommunity",
        meta: {
          title: "AlgoLaser Library - Post",
        },
        component: () => import("@/views/community/Post"),
      },
    ],
  },
  {
    path: "/Setting",
    name: "Setting",
    component: Layout,
    redirect: "/Setting/second",
    meta: {
      title: "Setting",
    },
    children: [
      {
        path: "/Setting/:name",
        meta: {
          title: "AlgoLaser Library - Setting",
        },
        component: () => import("@/views/Setting/index"),
      },
    ],
  },
  {
    path: "/thing/:thingId",
    name: "thing",
    component: Layout,
    meta: {
      title: "thing",
    },
    children: [
      {
        path: "/thing/:thingId",
        meta: {
          title: "AlgoLaser Library - Thing",
        },
        component: () => import("@/views/thing/index"),
      },
    ],
  },
  {
    path: "/design/:userId",
    name: "design",
    component: Layout,
    meta: {
      title: "design",
    },
    children: [
      {
        path: "/design/:userId",
        component: () => import("@/views/design/index"),
        meta: {
          title: "AlgoLaser Library - Design",
        },
      },
    ],
  },
  {
    path: "/message/:userName/:userId",
    name: "message",
    component: Layout,
    meta: {
      title: "message",
    },
    children: [
      {
        path: "/message/:userName/:userId",
        meta: {
          title: "AlgoLaser Library - Message",
        },
        component: () => import("@/views/message/index"),
      },
    ],
  },
  {
    path: "/following/:userId",
    name: "following",
    component: Layout,
    meta: {
      title: "following",
    },
    children: [
      {
        path: "/following/:userId",
        meta: {
          title: "AlgoLaser Library - Following",
        },
        component: () => import("@/views/following/index"),
      },
    ],
  },
  messageRoute,
  {
    path: "*",
    name: "404",
    component: () => import("@/views/error/404"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
