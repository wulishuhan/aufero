/* eslint-disable */
import i18n from "@/utils/i18n";
// import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import ElementUI from "element-ui";
import { baseURL } from "@/utils/request";
import VEmojiPicker from "v-emoji-picker";
import "@/icons/index";
import moment from "moment";
// import "element-ui/lib/theme-chalk/index.css";
// import "element-ui/lib/theme-chalk/display.css";
// import mock from "mockjs";
// import style
import "swiper/css/swiper.css";
import "@/permission";
import "@/style/index.scss";
import "@/assets/css/icon.css";
import VueContextMenu from "vue-contextmenu";
import Ads from "vue-google-adsense";
import "@/utils/iosScale";
import VueAwesomeSwipers from "vue-awesome-swiper";
import draggable from "vuedraggable";
import { isMobile } from "@/utils/common";
import Casdoor from "casdoor-vue-sdk";
import VueCompositionAPI from "@vue/composition-api";
const config = {
  serverUrl: "https://auth.dev.algolaser.cn",
  clientId: "app-library.dev",
  organizationName: "algolaser.dev",
  appName: "app-library.dev",
  redirectPath: "/callback",
};
Vue.use(VueCompositionAPI);
Vue.use(Casdoor, config);

Vue.use(VueAwesomeSwipers);
Vue.use(VEmojiPicker);
Vue.use(require("vue-script2"));
Vue.use(Ads.Adsense);
Vue.use(Ads.InArticleAdsense);
Vue.use(Ads.InFeedAdsense);

Vue.prototype.baseURL = baseURL;
Vue.use(VueContextMenu);
Vue.config.productionTip = false;
// Vue.use(ElementUI);
const VueAwesomeSwiper = require("vue-awesome-swiper/dist/ssr");
Vue.use(VueAwesomeSwiper);
Vue.component(draggable);
// if (process.env.NODE_ENV === "development") {
//   const { mockXHR } = require("../mock");
//   mockXHR();
// }
if (isMobile()) {
  location.href = process.env.VUE_APP_MOBILE_URL;
}
moment.locale("en");
Vue.prototype.$moment = moment;
// Vue.use(mock);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
