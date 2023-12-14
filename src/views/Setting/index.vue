<template>
  <div>
    <el-tabs
      :tab-position="tabPosition"
      v-model="activeName"
      @tab-click="handleClick"
      class="basicSetup"
    >
      <el-tab-pane :label="$t('profile.Profile')" name="second">
        <Profile v-if="tabsArr.second"></Profile>
      </el-tab-pane>
      <el-tab-pane :label="$t('profile.Manage account')" name="fourth">
        <ManageAccount v-if="tabsArr.fourth"></ManageAccount
      ></el-tab-pane>
      <el-tab-pane :label="$t('profile.Notifications')" name="third"
        ><Notifications v-if="tabsArr.third"></Notifications
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Profile from "./components/Profile.vue";
import Notifications from "./components/Notifications.vue";
import ManageAccount from "./components/ManageAccount.vue";

export default {
  components: { Profile, Notifications, ManageAccount },
  data() {
    return {
      tabPosition: "left",
      activeName: "second",
      tabsArr: {
        second: true,
        fourth: false,
        third: false,
      },
    };
  },
  mounted() {
    console.log("active", this.$route);
    let name = this.$route.params.name;
    if (name == "fourth") {
      console.log("okok");
      this.activeName = name;
      this.tabsArr.second = false;
      this.tabsArr.third = false;
      this.tabsArr.fourth = true;
    } else if (name == "third") {
      this.activeName = name;
      this.tabsArr.second = false;
      this.tabsArr.third = true;
      this.tabsArr.fourth = false;
    } else if (name == "second") {
      this.activeName = name;
      this.tabsArr.second = true;
      this.tabsArr.third = false;
      this.tabsArr.fourth = false;
    }
  },
  methods: {
    handleClick(tab) {
      window.history.pushState("", "", "/Setting/" + this.activeName);
      // console.log(tab, event);
      for (var key in this.tabsArr) {
        if (tab.name != key) {
          this.tabsArr[key] = false;
        } else {
          this.tabsArr[key] = true;
        }
      }
    },
  },
};
</script>
<style scoped>
.basicSetup {
  height: 100%;
  margin-left: 240px;
}
::v-deep .el-tabs__nav-scroll {
  padding-top: 24px;
  width: 208px;
  height: 224px;
  background: #ffffff;
  border-radius: 8px;
  margin-right: 24px;
}
::v-deep .el-tabs__item.is-active {
  width: 208px;
  height: 48px;
  color: #fff;
  background: #4977e6;
}
::v-deep .el-tabs__item.is-left {
  font-size: 16px;

  font-weight: 400;
  text-align: left;
  margin-bottom: 16px;
}
::v-deep .el-tabs--left .el-tabs__active-bar.is-left,
.el-tabs--left .el-tabs__nav-wrap.is-left::after {
  display: none;
}
::v-deep .el-tabs--left .el-tabs__nav-wrap.is-left::after,
.el-tabs--left .el-tabs__nav-wrap.is-right::after,
.el-tabs--right .el-tabs__nav-wrap.is-left::after,
.el-tabs--right .el-tabs__nav-wrap.is-right::after {
  display: none;
}
</style>
