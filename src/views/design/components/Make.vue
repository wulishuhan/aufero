<template>
  <div @mouseleave="handleMouseLeave">
    <div class="makeCard">
      <div
        style="position: relative"
        @mouseenter="showMask = true"
        @mouseleave="showMask = false"
      >
        <el-image
          @click="openMake"
          class="more-image"
          :src="make.url"
          :fit="'contain'"
        >
        </el-image>
        <div
          v-show="showMask && isYourAccount"
          @click.stop="handleDelClick"
          class="icon-collect-box"
        >
          <svg-icon
            style="font-size: 22px; color: #fff"
            icon-class="Vector 86"
            class-name="icon-Vector 86"
          ></svg-icon>
        </div>
        <div class="moreMenu" v-if="showMoreMenu">
          <div
            class="moreMenuItem"
            @click.stop="handleDelClick"
            v-show="isYourAccount"
          >
            {{ $t("design.Delete") }}
          </div>
        </div>
        <div style="margin-top: 5px">
          <div style="display: flex; justify-content: space-between">
            <div style="cursor: pointer" @click="toDetail(make.resource.id)">
              <el-tooltip
                effect="light"
                placement="bottom-start"
                :visible-arrow="false"
                :open-delay="1000"
              >
                <div slot="content">
                  {{ make.content }}
                </div>
                <span class="makeContent">
                  {{ make.content }}
                </span>
              </el-tooltip>
            </div>
            <!-- make图片张数显示 -->
            <div class="makeImage">
              <i class="el-icon-picture"> {{ make.image.length }}</i>
            </div>
          </div>
          <div>
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :visible-arrow="false"
              :open-delay="1000"
            >
              <div slot="content">
                {{ make.user.name }}
              </div>
              <span class="makeName">
                {{ make.user.name }}
              </span>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    urlList: {
      type: Array,
      default: () => [],
    },
    isYourAccount: {
      type: Boolean,
      default: false,
    },
    showMoreIcon: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default:
        "https://orturbucket.s3.amazonaws.com/assets/2022/08/10/c4d93a3805b3ce3f323f7974e6f78jpeg_20220810182053A028.jpeg",
    },
    make: {
      type: Object,
      default: () => {
        return {
          id: new Date().getTime(),
          url: "https://orturbucket.s3.amazonaws.com/assets/2022/08/10/c4d93a3805b3ce3f323f7974e6f78jpeg_20220810182053A028.jpeg",
        };
      },
    },

    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showMake: false,
      showMoreMenu: false,
      showMask: false,
    };
  },
  // mounted() {
  //   this.showPanel();
  // },
  methods: {
    // showPanel() {
    //   console.log(this.make, 117);
    // },
    toDetail(id) {
      if (!this.isTouch) {
        //存储主页跳转前的滚动条位置
        window.open(`/thing/${id}`);
      }
      if (this.touchNum >= 2 && this.isTouch) {
        this.$router.push(`/thing/${id}`);
      }
    },
    handleMouseLeave() {
      this.showMoreMenu = false;
    },
    handleDownClick() {
      if (!this.$store.getters.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return;
      }
      this.showMoreMenu = false;
      this.$emit("clickDownMenu");
    },
    handleDelClick() {
      if (!this.$store.getters.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return;
      }
      this.showMoreMenu = false;
      this.$emit("clickDelMenu");
    },
    handleClickMore() {
      this.showMoreMenu = !this.showMoreMenu;
    },
    openMake() {
      this.$emit("openMake");
      this.$emit("getIndex", this.index);
    },
  },
};
</script>
<style scoped lang="scss">
.makeCard {
  display: flex;
  justify-content: space-between;
  border: 1px solid #f0f3fa;
  flex-wrap: wrap;
  width: 344px;
  height: 328px;
  border-radius: 10px;
  padding: 8px;
}
.makeCard:hover {
  border: 1px solid #c2c4cc;
  box-shadow: 0px 2px 10px 0px rgba(18, 18, 18, 0.07);
  border-radius: 10px;
  padding: 8px;
}
.makeContent {
  font-size: 14px;

  font-weight: 400;
  color: #1a1a1a;
}
.makeName {
  font-size: 12px;

  font-weight: 400;
  color: #999999;
}
.makeImage {
  font-size: 14px;

  font-weight: 400;
  color: #999999;
}
.moreMenu {
  z-index: 9999;
  position: absolute;
  width: 160px;
  // height: 176px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  text-align: left;
  bottom: 35px;
  right: 7px;
  .moreMenuItem {
    width: 144px;
    height: 48px;
    border-radius: 8px;
    line-height: 48px;
    margin: 8px auto;
    padding-left: 25px;
  }
  .moreMenuItem:hover {
    background: #8ab5ef;
  }
}
.makes-mask {
  display: flex;
  justify-content: space-between;
  position: absolute;
  margin-bottom: 55px;
  bottom: 3px;
  width: 328px;
  height: 32px;
  background-color: rgba(34, 34, 34, 0.5);
  text-align: center;
  line-height: 32px;
  .ortur-icon-message {
    position: relative;
    top: 2px;
    margin-left: 10px;
  }
  .el-icon-arrow-right {
  }
  .makes-mask-font-container {
    color: #fff;
    font-size: 16px;
  }
}
.more-image-box {
  margin-top: 31px;
  cursor: pointer;
  display: grid;
  grid-template-columns: repeat(3, 184px);
  justify-content: space-between;
}

.more-image {
  width: 328px;
  height: 248px;
  margin-top: 5px;
  border-radius: 8px;
  background: #e8ebf4;
  cursor: pointer;
}

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
.makes-mask:hover {
  cursor: pointer;
}
.icon-collect-box {
  width: 56px;
  height: 40px;
  background: #ff5e5e;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 75px;
  right: 17px;
  cursor: pointer;
}
</style>
