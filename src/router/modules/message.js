/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const messageRoute = {
  path: "/message",
  component: Layout,
  name: "message",
  meta: {
    title: "message",
    keepAlive: true,
  },
  children: [
    {
      path: "/message/:messageType",
      component: () => import("@/views/message/index"),
      name: "All",
      meta: { title: "All" },
    },
  ],
};

export default messageRoute;
