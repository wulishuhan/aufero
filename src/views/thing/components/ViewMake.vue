<template>
  <div>
    <el-dialog
      class="visibleBox"
      :visible.sync="visible"
      :width="width"
      :custom-class="customClass"
      :append-to-body="true"
      :close-on-click-modal="false"
      @opened="openDialoged"
      ref="viewMakeDialog"
    >
      <el-button
        class="post-make-button"
        type="text"
        @click="openPostMakeDialog"
        slot="title"
      >
        <i class="el-icon-plus"></i>
        {{ $t("thing.post make") }}
      </el-button>
      <PostMakeDialog
        :isShow.sync="showPostForm"
        @addMake="addMake"
      ></PostMakeDialog>
      <!-- Makes 的总数 -->
      <div class="makes">Makes • {{ makes.length }}</div>
      <el-row>
        <el-col :span="6" v-for="(item, index) in makes" :key="item.id">
          <make
            :make="item"
            :index="index"
            @openMake="openMake"
            @getIndex="getIndex"
          ></make>
        </el-col>
      </el-row>
    </el-dialog>
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
        :on-close="closeMake"
        :url-list="makes"
        :isMake="true"
        :initialIndex="index"
        :appendToBody="false"
      ></ElImageViewers>
    </el-drawer>
  </div>
</template>
<script>
import ElImageViewers from "@/components/ImageViewers";
import Make from "./Make.vue";
import PostMakeDialog from "./PostMakeDialog.vue";
import { getMakeList } from "@/api/user";
export default {
  name: "ViewMake",
  components: { Make, PostMakeDialog, ElImageViewers },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "1136px",
    },
    makes: {
      type: Array,
      default: () => {
        return [
          {
            url: "https://orturbucket.s3.amazonaws.com/assets/2022/08/30/abcddd_20220830153658A043.png",
            id: 1234,
          },
        ];
      },
    },
  },
  data() {
    return {
      direction: "ttb",
      makes2: [],
      makesInfo: {},
      showPostForm: false,
      showMake: false,
      index: 0,
      url: "https://orturbucket.s3.amazonaws.com/assets/2022/08/30/abcddd_20220830153658A043.png",
    };
  },
  computed: {
    visible: {
      get() {
        return this.isShow;
      },
      set(val) {
        console.log("val", val);
        this.$emit("update:isShow", false);
      },
    },
  },
  methods: {
    getIndex(index) {
      console.log(index);
      this.index = index;
      getMakeList({ resId: this.$route.params.thingId }).then((res) => {
        this.makes2 = res.data.rows;
        this.makesInfo = this.makes2[this.index].resource;
        this.makesInfo.isDesignShow = false;
      });
    },
    openMake() {
      this.showMake = true;
      document.documentElement.style.overflowY = "hidden";
    },
    closeMake() {
      this.showMake = false;
      document.documentElement.style.overflowY = "scroll";
    },
    openDialoged() {
      console.log("test", this.$refs["viewMakeDialog"].updatePopper());
    },
    openPostMakeDialog() {
      if (!this.$store.getters.isLogin) {
        this.showLoginDialog();
        return;
      }
      this.showPostForm = true;
    },
    showLoginDialog() {
      let payload = { loginDialogVisible: true, isLoginForm: true };
      this.$store.dispatch("user/switchLoginRegisteForm", payload);
    },
    addMake() {
      this.$emit("addMake");
    },
  },
  watch: {
    visible(val) {
      // 在此做显示与隐藏的交互
      if (val === false) {
        // 重置操作
      } else {
        // 展示时操作
      }
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-image-viewer__img {
  width: 1084px;
  height: 660px;
}
::v-deep .el-image-viewer__close {
  background-color: rgba(26, 26, 26, 0.3);
  border-radius: 0px;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  font-size: 14px;
}
::v-deep .more-image {
  width: 228px;
  height: 139px;
}
::v-deep .makes-mask {
  width: 227px;
  height: 40px;
  line-height: 40px;
}
::v-deep .ortur-icon-message {
  font-size: 18px;
}
::v-deep .el-icon-arrow-right {
  font-size: 18px;
}
.visibleBox {
  ::v-deep .el-dialog__body {
    padding-top: 1px;
  }
}

.post-make-button:hover {
  background: #ececec;
  color: #606266;
}
.post-make-button {
  color: #606266;
  padding: 10px;
  font-size: 16px;
}
.el-icon-plus {
  margin-right: 5px;
  font-size: 16px;
}
.makes {
  font-size: 20px;

  font-weight: 400;
  color: #1a1a1a;
  margin-bottom: 30px;
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
