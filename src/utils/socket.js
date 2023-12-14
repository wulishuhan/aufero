import imSdk from "@/utils/im";
//eslint-disable-next-line
var client = imSdk.create(process.env.VUE_APP_BASE_API + "/library/ws");
// eslint-disable-next-line
Vue.prototype.$chatSocket = client;
