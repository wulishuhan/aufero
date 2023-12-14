/* eslint-disable */
import axios from "axios";
import { getToken, removeToken } from "@/utils/auth";
import store from "@/store";
import i18n from "./i18n";
import { Message } from "element-ui";
import router from "@/router";
let baseURL = process.env.VUE_APP_BASE_API;
const service = axios.create({
  // timeout: 1000,
  baseURL: baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});
// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    //if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers["Authorization"] = "Bearer " + getToken();
    //}
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(async (res) => {
  const code = res.data.code;
  const WHITE_LIST_URL = ["/main"];

  if (code == 0 || code == 200) {
    return Promise.resolve(res);
  } else if (code == 1013) {
    //未登录
    if (WHITE_LIST_URL.indexOf(router.currentRoute.path) != 0) {
      store.dispatch("user/switchLoginRegisteForm", {
        loginDialogVisible: true,
        isLoginForm: true,
      });
      if (getToken()) {
        Message.error(i18n.t("error.1013"));
        removeToken();
      }
    }
    store.commit("user/SET_ISLOGIN", false);

    return Promise.reject({
      code: 1013,
      msg: i18n.t("error.1013"),
    });
  } else {
    return Promise.reject({
      code: 1,
      msg: i18n.t(`error.${code}`),
    });
  }
});

export default service;
export { baseURL };
