<template>
  <div v-if="isLoad">
    <!-- <nav-bar></nav-bar> -->
    <app-header></app-header>
    <!-- ie浏览器浏览时出现提示 -->
    <div v-if="showIeTip" class="ie-tip">
      {{ $t("ie.tip") }}
      <i class="el-icon-close" @click="showIeTip = false"></i>
    </div>
    <keep-alive exclude="el-tooltip">
      <!-- 需要缓存的视图组件 -->
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
  </div>
</template>
<script>
var oMeta = document.createElement("meta");
import AppHeader from "@/components/AppHeader";
import OrturFooter from "@/components/OrturFooter";
export default {
  name: "Layout",
  components: {  OrturFooter, AppHeader },
  data() {
    return {
      showIeTip: false,
      isLoad:false,
    };
  },
  methods: {},
  mounted() {
    this.showIeTip = navigator.userAgent.indexOf("Trident") > -1;
    let width = document.documentElement.clientWidth;
    oMeta.content = `width=device-width, initial-scale=0,user-scalable=yes,maximum-scale=1.0`;
    if (
      /(iPhone|iPad|iOS|Mac|iphone|mac|ipad|ios|)/.test(navigator.userAgent)
    ) {
      oMeta.content = `width=1440, initial-scale=0,user-scalable=yes,maximum-scale=1.0`;
    }
    oMeta.name = "viewport";
    document.getElementsByTagName("head")[0].appendChild(oMeta);
    this.$store.dispatch("user/getUserInfo").then(()=>{
      this.isLoad=true;
    }).catch(()=>{
      this.isLoad=true;
    })
  },
};
</script>
<style lang="scss" scoped>
.ie-tip {
  position: absolute;
  top: 56px;
  background: #000;
  color: #fff;
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  z-index: 3000;
  font-size: 16px;
  .el-icon-close {
    cursor: pointer;
    padding-left: 24px;
  }
}
</style>
