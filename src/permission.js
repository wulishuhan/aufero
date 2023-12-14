import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import i18n from "@/utils/i18n";
// import { getToken } from "@/utils/auth"; // get token from cookie
let whiteList = [
  "AlgoLaser Library",
  "AlgoLaser Library - Thing",
  "AlgoLaser Library - Search",
  "AlgoLaser Library - Design",
  "AlgoLaser Library - Preview",
  "AlgoLaser Library - Community",
];
router.beforeEach(async (to, from, next) => {
  //切换页面滚动条自动回到顶部
  window.scrollTo(0, 0);

  // document.title = to.meta.title;
  // const hasToken = getToken();
  console.log("islogin", store.getters.isLogin);
  if (store.getters.isLogin) {
    // if (to.path === "/login") {
    //   next("/");
    // } else {
    //   const hasRoles = store.getters.roles && store.getters.roles.length > 0;
    //   if (hasRoles) {
    //     next();
    //   } else {
    //     try {
    //       const res = await store.dispatch("user/getUserInfo");
    //       next();
    //       console.log("user info: ", res);
    //     } catch (error) {
    //       Message.error(error || "Has Error");
    //       next();
    //     }
    //   }
    // }
    try {
      await store.dispatch("user/getUserInfo");
      next();
    } catch (error) {
      // 处理跳转页面的时候如果被顶下登录进行跳转
      if (error.code === 1013) {
        Message.error(i18n.t("error.1013"));
        next("/main?redirect=" + to.fullPath);
      }
    }
  } else {
    if (whiteList.includes(to.meta.title)) {
      try {
        await store.dispatch("user/getUserInfo");
        next();
      } catch (e) {
        next();
      }
      // next();
    } else {
      /* has no token*/
      try {
        const res = await store.dispatch("user/getUserInfo");
        next();
        console.log("user info: ", res);
      } catch (error) {
        console.log(error);
        Message.error(i18n.t("error.1013"));
        next("/main?redirect=" + to.fullPath);
      }
    }
  }
});

router.afterEach(() => {
  // finish progress bar
});
