<template>
  <div>
    <div class="make-link-box">
      <a class="more-font post-make" @click="openPostMakeDialog">
        <i class="el-icon-plus"></i>
        {{ $t("thing.Post a make") }}
      </a>
      <a class="view-more" @click="dialogViewMake = true">
        {{ $t("thing.View all") }}
      </a>
    </div>
    <PostMakeDialog
      :isShow.sync="dialogPostMake"
      :customClass="'make-dialog'"
      @addMake="addMake"
    ></PostMakeDialog>
    <el-row>
      <el-col
        :span="8"
        v-for="(item, index) in makes.slice(0, 6)"
        :key="item.id"
      >
        <make
          :make="item"
          :index="index"
          @openMake="openMake"
          @getIndex="getIndex"
        ></make>
      </el-col>
    </el-row>
    <el-drawer
      :modal="false"
      :visible.sync="showMake"
      :direction="direction"
      :before-close="closeMake"
    >
      <ElImageViewers
        class="imageViewer"
        v-if="showMake"
        :makesInfo="makesInfo"
        :url-list="makes"
        :isMake="true"
        :initialIndex="index"
      ></ElImageViewers>
    </el-drawer>
    <ViewMake
      :makes="makes"
      :isShow.sync="dialogViewMake"
      @openMake="openMake(item)"
      @addMake="addMake"
    ></ViewMake>
  </div>
</template>
<script>
import PostMakeDialog from "./PostMakeDialog.vue";
import ElImageViewers from "@/components/ImageViewers";
import Make from "./Make.vue";
import ViewMake from "./ViewMake.vue";
import { getMakeList } from "@/api/user";
export default {
  name: "Makes",
  components: { Make, PostMakeDialog, ViewMake, ElImageViewers },
  created() {
    getMakeList({ resId: this.$route.params.thingId, ...this.pagination }).then(
      (res) => {
        this.makes = res.data.rows;
        this.makes.map((item) => {
          if (item.image) {
            item.image = item.image.split(",");
            item.url = item.image[0];
          } else {
            item.image = "";
            item.url = "";
          }
        });
      }
    );
  },
  data() {
    return {
      makes2: [],
      makesInfo: {},
      direction: "ttb",
      dialogPostMake: false,
      dialogViewMake: false,
      makes: [],
      showMake: false,
      index: 0,
      // pagination: {
      //   pageNum: 1,
      //   pageSize: 6,
      // },
    };
  },
  methods: {
    getIndex(index) {
      this.index = index;
      getMakeList({ resId: this.$route.params.thingId }).then((res) => {
        this.makes2 = res.data.rows;
        this.makesInfo = this.makes2[this.index].resource;
        this.makesInfo.isDesignShow = false;
      });
    },
    openMake(item) {
      this.makeId = item;
      this.showMake = true;
      document.documentElement.style.overflowY = "hidden";
    },
    closeMake() {
      this.showMake = false;
      document.documentElement.style.overflowY = "scroll";
      getMakeList({
        resId: this.$route.params.thingId,
        ...this.pagination,
      }).then((res) => {
        console.log("makes", res);
        this.makes = res.data.rows;
        this.makes.map((item) => {
          item.image = item.image.split(",");
          item.url = item.image[0];
        });
      });
    },
    addMake() {
      //   this.makes.push(make);
      getMakeList({ resId: this.$route.params.thingId }).then((res) => {
        this.makes = res.data.rows;
        this.makes.map((item) => {
          item.image = item.image.split(",");
          item.url = item.image[0];
        });
      });
    },
    openPostMakeDialog() {
      if (!this.$store.getters.isLogin) {
        this.showLoginDialog();
        return;
      }
      this.dialogPostMake = true;
    },
    showLoginDialog() {
      let payload = { loginDialogVisible: true, isLoginForm: true };
      this.$store.dispatch("user/switchLoginRegisteForm", payload);
    },
  },
};
</script>
<style scoped lang="scss">
.view-more {
  font-size: 16px;
  color: #1e78f0;
  cursor: pointer;
}
.more-font {
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 400;
}
.post-make {
  cursor: pointer;
}
.make-link-box {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .el-drawer__wrapper {
  top: 56px;
  height: 317%;
}
::v-deep .el-drawer__header {
  width: 1480px;
  margin: auto;
  padding: 0 20px 0 20px;
}
::v-deep .el-drawer__close-btn {
  z-index: 3;
  font-size: 22px;
  width: 36px;
  height: 36px;
  color: #ffffff;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 8px;
  position: relative;
  top: 34px;
  right: 27px;
}
::v-deep .el-drawer__body {
  width: 1480px;
  margin: auto;
}
::v-deep .el-drawer__open .el-drawer.ttb {
  background: #f0f3fa;
}
</style>
