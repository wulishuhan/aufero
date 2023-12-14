<template>
  <div
    class="card-box"
    @mouseenter="enter"
    @mouseleave="leave(thing)"
    @touchstart="touchstart"
  >
    <div style="position: relative">
      <div class="resource-show-image-box" @click="toDetail(thing.id)">
        <img
          class="resource-show-image"
          :src="thing.image"
          alt="can't load this image"
        />
      </div>
      <div
        v-show="showCollection && isCollectIconShow"
        class="icon-collect-box"
        ref="collect-button"
        @click.stop="opencollectionShow(thing.id)"
        :id="'opencollection' + thing.id"
      >
        <i class="ortur-icon-add-collect icon-collect"></i>
      </div>
      <div
        v-show="showEdit && isCollectIconShow"
        @click="toUpload(thing.id)"
        class="icon-collect-box"
      >
        <i style="color: #fff" class="ortur-icon-pen"></i>
      </div>
    </div>
    <div class="card-box-bottom">
      <div class="card-box-bottom-left">
        <el-popover
          popper-class="user-popover"
          placement="bottom-start"
          trigger="hover"
          :visible-arrow="false"
          @show="userRecommendation"
        >
          <UserRecommendation
            v-if="showUserRecommendation"
            :creator="thing.creator"
            :currentResourceId="thing.id"
          ></UserRecommendation>
          <el-avatar
            v-if="showAvatar"
            :size="40"
            :src="avatar"
            :fit="'cover'"
            slot="reference"
            @click.native="viewAuthorInfo(thing.creator && thing.creator.id)"
          ></el-avatar>
        </el-popover>
        <div class="card-box-bottom-left-name">
          <!-- <el-tooltip
            effect="light"
            placement="bottom-start"
            :open-delay="tooltipDelay"
            :visible-arrow="false"
            :popper-class="'margin-top-distance'"
          >
            <div slot="content">
              {{ thing.title }}
            </div>
            <div class="thing-name">
              {{ thing.title }}
            </div>
          </el-tooltip> -->
          <div class="thing-name" :title="thing.title">
            {{ thing.title }}
          </div>
          <!-- <el-tooltip
            effect="light"
            placement="bottom-start"
            :open-delay="tooltipDelay"
            :visible-arrow="false"
            :popper-class="'margin-top-distance'"
          >
            <div slot="content">
              {{ thing.creator && thing.creator.name }}
            </div>
            <span
              v-if="showAvatar"
              class="author"
              @click="viewAuthorInfo(thing.creator && thing.creator.id)"
            >
              {{ thing.creator && thing.creator.name }}
            </span>
          </el-tooltip> -->
          <span
            v-if="showAvatar"
            class="author"
            @click="viewAuthorInfo(thing.creator && thing.creator.id)"
            :title="thing.creator.name"
          >
            {{ thing.creator && thing.creator.name }}
          </span>
        </div>
      </div>
      <div class="card-box-bottom-right">
        <div
          class="card-box-bottom-right-like-box"
          @click="like"
          v-if="showStar"
        >
          <svg-icon
            v-show="!showLikeStar"
            class="icon-star"
            icon-class="213喜欢-线性"
            class-name="icon-213喜欢-线性"
          ></svg-icon>
          <svg-icon
            v-show="showLikeStar"
            class="icon-star"
            icon-class="已喜欢"
            class-name="icon-已喜欢"
          ></svg-icon>
          {{ likes }}
        </div>
        <div class="share-box" slot="reference">
          <i class="ortur-icon-look icon-share"></i>
          {{ thing.view_count }}
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t('collection.Collect to')"
      :visible.sync="outerDialog"
      :append-to-body="true"
    >
      <el-divider></el-divider>

      <el-checkbox-group v-model="checkList" @change="change">
        <p v-for="item in collectLists" :key="item.id">
          <el-checkbox :label="item">
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :open-delay="tooltipDelay"
              :visible-arrow="false"
            >
              <div slot="content">
                {{ item.name }}
              </div>
              <span class="folder-button-text">
                <i v-show="item.id !== 0"></i>
                {{ item.name }}
              </span>
            </el-tooltip>
          </el-checkbox>
        </p>
      </el-checkbox-group>

      <div class="outerDialogButton">
        <div class="NewCollection" @click="innerDialog = true">
          <span class="el-icon-plus"></span>
          {{ $t("collection.New Collection") }}
        </div>
        <div>
          <el-button @click="closeOuterDialog">
            {{ $t("collection.Cancel") }}
          </el-button>
          <el-button type="primary" @click="outerComfirm">
            {{ $t("collection.Confirm") }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      class="innerDialogBox"
      :title="$t('collection.create new collection')"
      :visible.sync="innerDialog"
      :append-to-body="true"
    >
      <el-input
        v-model="newFolderName"
        minlength="1"
        maxlength="32"
        show-word-limit
      ></el-input>
      <div class="innerDialogTis">
        <span v-show="innerDialogTis" class="innerDialogTitle">
          {{ $t("collection.The folder name cannot be empty or pure space") }}
        </span>
      </div>
      <div class="innerDialogButton">
        <el-button @click="closeInnerDialog">
          {{ $t("collection.Cancel") }}
        </el-button>
        <el-button type="primary" @click="innerComfirm">
          {{ $t("collection.Confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCollectionList,
  addCollection,
  getResourceInCollection,
  addResourceToCollection,
  deleteResourceInCollection,
} from "@/api/collection.js";
import { mapGetters } from "vuex";
import UserRecommendation from "@/components/UserRecommendation";
import { addLike, deleteLike } from "@/api/like";
import { generatorDefaultAvator } from "@/utils/generateImage";
export default {
  name: "ResourceCard",
  components: { UserRecommendation },
  props: {
    isYourAccount: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    isCollected: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    isLike: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    showAvatar: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    showEdit: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    showCollection: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    showShare: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    showStar: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    thing: {
      type: Object,
      default: function () {
        return {
          creator: {
            name: "ccc@ccc.cccq",
            id: 110,
            avatar:
              "https://orturbucket.s3.amazonaws.com/pic/5f93f983524def3dca464469d2cf9f3e",
          },
          id: 2,
          image:
            "https://orturbucket.s3.amazonaws.com/pic/5f93f983524def3dca464469d2cf9f3e",
          like_count: 0,
          share_count: 0,
          title: "laser",
          isLike: false,
        };
      },
    },
  },
  data() {
    return {
      innerDialogTis: false,
      resourceId: "",
      outerDialog: false,
      innerDialog: false,
      deletevisit: false,
      addvisit: false,
      newFolderName: "",
      addList: [],
      deleteList: [],
      checkList: [],
      preCheckList: [],
      collectList: [],
      collectLists: [],
      isAdd: undefined,
      showMoreMenu: false,
      likes: 0,
      isShare: false,
      isCollectIconShow: false,
      folder: true,
      openCollectedOption: false,
      showLikeStar: false,
      loadLike: false,
      showUserRecommendation: false,
      isViewMorePage: false,
      touchNum: 0,
      isTouch: false,
      tooltipDelay: 1000,
    };
  },
  mounted() {
    this.likes = this.thing.like_count;
    this.showLikeStar = this.isLike;
  },
  // 开启缓存后有tooltip组件留存页面需要手动去除
  deactivated() {
    const nodeList = document.querySelectorAll(".user-card");
    for (let i = 0; i < nodeList.length; i++) {
      const element = nodeList[i];
      element.style.display = "none";
    }
  },
  computed: {
    ...mapGetters(["isLogin", "userInfo"]),
    selected() {
      return this.$store.getters.selectCollectionBox;
    },
    avatar() {
      return this.thing.creator.avatar
        ? this.thing.creator.avatar
        : generatorDefaultAvator(
            this.thing.creator.name,
            this.thing.creator.id
          );
    },
  },
  watch: {
    isLike: function () {
      this.showLikeStar = this.isLike;
    },
  },
  methods: {
    opencollectionShow(id) {
      if (!this.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return;
      }
      this.resourceId = id;
      this.outerDialog = true;
      this.checkList = [];
      this.preCheckList = [];
      getCollectionList({
        userId: this.$store.getters.userInfo.user_id,
      })
        .then((res) => {
          this.collectList = res.data.data;
          this.collectLists = [
            { id: 0, name: "Liked resources" },
            ...this.collectList,
          ];
          return this.collectLists;
        })
        .then((collectList) => {
          for (const item of collectList) {
            getResourceInCollection({
              collectionId: item.id,
              userId: this.$store.getters.userInfo.user_id,
            }).then((res) => {
              if (res.data.total > 0) {
                let flag = res.data.rows.some((r) => {
                  return r.id == this.resourceId;
                });
                if (flag) {
                  this.checkList.push(item);
                  this.preCheckList.push(item);
                }
              }
            });
          }
        });
    },
    change() {
      console.log("当前checklist:", this.checkList);
    },
    closeOuterDialog() {
      this.outerDialog = false;
    },
    closeInnerDialog() {
      this.newFolderName = "";
      this.innerDialog = false;
    },
    diff(preList, currentList) {
      let addList = currentList.filter((item) => {
        if (!preList.includes(item)) {
          return item;
        }
      });
      let deleteList = preList.filter((item) => {
        if (!currentList.includes(item)) {
          return item;
        }
      });
      return { addList, deleteList };
    },
    // 确认编辑按钮
    outerComfirm() {
      let { addList, deleteList } = this.diff(
        this.preCheckList,
        this.checkList
      );
      console.log({ addList, deleteList }, 367);
      // 添加收藏
      addList.forEach((item) => {
        addResourceToCollection({
          collectionId: item.id,
          resourceId: this.resourceId,
        });
        // .then(() => {
        //   this.addvisit = true;
        //   console.log(this.addvisit, 385);
        // });
        this.addvisit = true;
      });
      console.log(deleteList, 374);
      // 删除收藏
      deleteList.forEach((item) => {
        deleteResourceInCollection({
          collectionId: item.id,
          resourceId: this.resourceId,
        });
        // .then(() => {
        //   this.deletevisit = true;
        //   console.log(this.deletevisit, 395);
        // });
        this.deletevisit = true;
      });
      if (this.addvisit || this.deletevisit) {
        console.log(this.deletevisit, 398);
        this.$message({
          message: this.$t(
            "ResourceCard.The collection is modified successfully"
          ),
          type: "success",
        });
      }
      this.opencollectionShow();
      this.closeOuterDialog();
    },
    innerComfirm() {
      // 去除首尾空格
      this.newFolderName = this.newFolderName.trim();
      console.log(this.newFolderName, 418);
      if (this.newFolderName !== "") {
        addCollection({
          userId: this.$store.getters.userInfo.user_id,
          name: this.newFolderName,
        }).then(() => {
          this.$message.success("ok");
          // 重新点击作品名，获取资源id，刷新弹窗数据
          document.getElementById("opencollection" + this.resourceId).click();
          this.closeInnerDialog();
          this.innerDialogTis = false;
        });
      } else {
        this.innerDialogTis = true;
      }
    },

    touchstart() {
      this.touchNum++;
      this.isTouch = true;
    },
    toUpload(id) {
      if (!this.$store.getters.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return;
      }
      this.$router.push(`/upload/${id}`);
    },
    toDetail(id) {
      if (!this.isTouch) {
        //存储主页跳转前的滚动条位置
        // localStorage.setItem("top", document.documentElement.scrollTop);
        // this.$router.push(`/thing/${id}`);
        window.open(`/thing/${id}`);
      }
      if (this.touchNum >= 2 && this.isTouch) {
        this.$router.push(`/thing/${id}`);
        // window.open(`/thing/${id}`);
      }
    },
    like() {
      if (this.loadLike) {
        return;
      }
      if (this.showLikeStar) {
        this.showLikeStar = false;
        this.loadLike = true;
        deleteLike({
          resId: this.thing.id,
        })
          .then(() => {
            this.$message({
              message: this.$t("ResourceCard.delete likes successfully"),
              type: "success",
            });
            this.likes = Number(this.likes) - 1;
            this.loadLike = false;
            this.$store.commit(
              "user/SET_LIKESLIST",
              this.$store.getters.myLikesList.filter((item) => {
                return item.id !== this.thing.id;
              })
            );
            if (this.likes < 0) {
              this.likes = 0;
            }
          })
          .catch((err) => {
            this.showLikeStar = true;
            this.loadLike = false;
            console.log(err);
          });
      } else {
        this.showLikeStar = true;
        this.loadLike = true;
        addLike({
          resId: this.thing.id,
        })
          .then(() => {
            this.$message({
              message: this.$t("ResourceCard.add likes successfully"),
              type: "success",
            });
            this.loadLike = false;
            this.likes = 1 + Number(this.likes);
            this.$store.commit("user/SET_LIKESLIST", [
              ...this.$store.getters.myLikesList,
              { id: this.thing.id },
            ]);
          })
          .catch((err) => {
            if (err.code == 1013) {
              this.$store.dispatch("user/switchLoginRegisteForm", {
                loginDialogVisible: true,
                isLoginForm: true,
              });
            }
            this.loadLike = false;
            this.showLikeStar = false;
          });
      }
    },
    share() {
      this.isShare = !this.isShare;
    },
    viewAuthorInfo(userId) {
      // this.$store.commit("filterCard/SET_SELECTPROFILE", "Designs");
      //存储主页跳转前的滚动条位置
      // localStorage.setItem("top", document.documentElement.scrollTop);
      this.$router.push(`/design/${userId}`);
    },
    addCollection() {
      if (!this.$store.getters.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return;
      }
      let collectBox = this.$refs["collect-button"];
      // let left = this.getElementLeft(collectBox);
      let left = this.getElementLeft(collectBox) - collectBox.offsetLeft + 82;
      let top = this.getElementTop(collectBox);
      let displayTop = false;
      if (this.isViewMorePage) {
        displayTop = top - 360 > 0;
      } else {
        displayTop = collectBox.getBoundingClientRect().top - 360 > 0;
      }
      if (displayTop) {
        top = top - 240 - collectBox.offsetTop;
      } else {
        top = top + 210 - collectBox.offsetTop;
      }
      this.$emit("openCollection", this.thing.id, left, top);
    },
    deleteCollection() {
      this.$emit("deleteCollection", this.thing.id);
    },
    enter() {
      this.isCollectIconShow = true;
    },
    leave() {
      this.isCollectIconShow = false;
      this.showMoreMenu = false;
    },
    userRecommendation() {
      this.showUserRecommendation = true;
    },
    getElementLeft(element) {
      let actualLeft = element.offsetLeft;
      let current = element.parentElement;
      while (current !== null) {
        console.log(current.className);
        if (current.className.includes("view-more-row")) {
          console.log("命中");
          this.isViewMorePage = true;
          break;
        }
        actualLeft += current.offsetLeft + current.clientLeft;
        current = current.offsetParent;
      }
      return actualLeft;
    },
    getElementTop(element) {
      let actualTop = element.offsetTop;
      let current = element.parentElement;
      while (current !== null) {
        if (current.className.includes("view-more-row")) {
          this.isViewMorePage = true;
          console.log("命中");
          break;
        }
        actualTop += current.offsetTop + current.clientTop;
        current = current.offsetParent;
      }
      return actualTop;
    },
  },
};
</script>
<style lang="scss" scoped>
.author {
  color: #5c5959;
  border-bottom: solid 1px #f0f3fa;
  font-size: 12px;

  font-weight: 400;
  color: #999999;
  max-width: 81px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.author:hover {
  border-bottom: solid 1px #000;
  color: #000;
  cursor: pointer;
}
.el-avatar {
  cursor: pointer;
}
.card-box:hover {
  border: 1px solid #c2c4cc;
}
.card-box {
  border: 1px solid #f5f5f5;
  position: relative;
  width: 100%;
  border-radius: 8px;
  padding: 7px;
  margin-right: 16px;
  margin-bottom: 32px;
  width: 344px;
}
.resource-show-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}
.resource-show-image-box {
  width: 100%;
  height: 248px;
  border-radius: 8px;
  cursor: pointer;
}
::v-deep .el-avatar > img {
  width: 100%;
}
.innerDialogButton {
  margin-top: 38px;
  padding-left: 253px;
}
.outerDialogButton {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-left: 19px;
}
.card-box-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 12px;
}
.card-box-bottom-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-box-bottom-left-name {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 5px;
}
.card-box-bottom-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999999;
  font-size: 14px;
}
.card-box-bottom-right-like-box {
  margin-right: 8px;
  user-select: none;
}
.icon-share,
.icon-star {
  margin-right: 5px;
  font-size: 14px;
}
.icon-share:hover {
  color: #000;
  cursor: pointer;
}
.card-box-bottom-right-like-box:hover {
  color: #000;
  cursor: pointer;
}
img:hover {
  cursor: pointer;
}
.share-container {
  position: absolute;
  top: 222px;
  right: 0px;
  z-index: 999;
}
.thing-name {
  font-size: 14px;

  font-weight: 400;
  color: #1a1a1a;
  max-width: 167px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.share-box:hover {
  color: #000;
  cursor: pointer;
}
.icon-collect-box {
  width: 56px;
  height: 40px;
  background: rgba(30, 120, 240, 0.3);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 16px;
  right: 24px;
  cursor: pointer;
}
.icon-collect {
  font-size: 20px;
  color: #fff;
}
::v-deep .el-dialog {
  width: 465px;
  height: 340px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
}
::v-deep .el-dialog__title {
  font-size: 14px;

  font-weight: 400;
  color: #999999;
}
::v-deep .el-divider {
  position: absolute;
  top: 28px;
  left: 8px;
  width: 448px;
  height: 1px;
  background: #cccccc;
}
::v-deep .el-dialog__body {
  padding: 24px 20px 30px 0px;
}
::v-deep .el-checkbox-group {
  height: 192px;
  overflow: auto;
}
::v-deep .el-checkbox {
  font-size: 16px;
  margin-left: 24px;
  margin-bottom: 16px;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1a1a1a;
}
::v-deep .el-checkbox__label {
  padding-left: 16px;
  font-size: 14px;
  width: 387px;

  font-weight: 400;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.NewCollection {
  cursor: pointer;
  font-size: 14px;

  font-weight: 400;
  color: #1e78f0;
}
.innerDialogBox {
  ::v-deep .el-dialog {
    width: 465px;
    height: 232px;
    background: #ffffff;
    border-radius: 10px;
  }
  ::v-deep .el-dialog__body {
    padding: 8px 20px 30px 0px;
  }
  ::v-deep .el-dialog__header {
    padding: 24px 25px 10px 30px;
  }
  ::v-deep .el-dialog__title {
    font-size: 20px;

    font-weight: 400;
    color: #141414;
    line-height: 34px;
  }
  ::v-deep .el-input__inner {
    margin-left: 31px;
    width: 401px;
    height: 48px;
    background: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 6px;
    padding: 0px 43px 0px 15px;
  }
  ::v-deep .el-input .el-input__count .el-input__count-inner {
    margin-right: 10px;
  }
  .innerDialogTis {
    margin-left: 31px;
    height: 16px;
  }
  .innerDialogTitle {
    font-weight: 400;
    color: red;
    font-size: 12px;
  }
}
</style>
