<template>
  <div>
    <div class="historiescard">
      <div class="card-box" @touchstart="touchstart">
        <div class="visitTime">
          <div slot="content">
            {{ visit_time }}
          </div>
        </div>
        <div style="position: relative">
          <div class="resource-show-image-box" @click="toDetail(thing.id)">
            <img
              class="resource-show-image"
              :src="thing.image"
              alt="can't load this image"
            />
          </div>
        </div>
        <div class="card-box-bottom">
          <!-- 作品名 -->
          <el-tooltip
            class="card-box-bottom-title"
            effect="light"
            placement="bottom-start"
            :visible-arrow="false"
            :open-delay="1000"
          >
            <div slot="content">
              {{ thing.title }}
            </div>
            <div>{{ thing.title }}</div>
          </el-tooltip>
          <!-- 收藏以及查看 -->
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
            <span
              @click="handleClickMore(thing)"
              class="moreMenuIcon"
              v-if="showMoreMenuBtn"
            >
              <div class="moreMenu" v-if="showMoreMenu">
                <div
                  v-show="isYourAccount"
                  class="moreMenuItem"
                  @click.stop="handleDelClick"
                >
                  {{ $t("design.Delete") }}
                </div>
                <div class="moreMenuItem" @click.stop="handleMoveClick">
                  {{ $t("design.moveTo") }}
                </div>
                <div class="moreMenuItem" @click.stop="handleDownClick">
                  {{ $t("design.download") }}
                </div>
              </div>
              ···
            </span>
          </div>
          <!-- 头像 -->
          <div class="card-box-bottom-left">
            <div>
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
                  @click.native="
                    viewAuthorInfo(thing.creator && thing.creator.id)
                  "
                ></el-avatar>
              </el-popover>
            </div>
            <div class="card-box-bottom-left-name">
              <el-tooltip
                effect="light"
                placement="bottom-start"
                :open-delay="1000"
                :visible-arrow="false"
              >
                <div slot="content">
                  {{ thing.creator && thing.creator.name }}
                </div>
                <span
                  v-if="showAvatar"
                  @click="viewAuthorInfo(thing.creator && thing.creator.id)"
                >
                  {{ thing.creator && thing.creator.name }}
                </span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="delHistories" @click="delHistories(thing.id)">
        <svg-icon icon-class="Vector 86" class-name="icon-Vector 86"></svg-icon>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>
<script>
import UserRecommendation from "@/components/UserRecommendation";
import { addLike, deleteLike } from "@/api/like";
import { generatorDefaultAvator } from "@/utils/generateImage";
import { delHistories } from "@/api/design";
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
    showMoreMenuBtn: {
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
      Arr: [],
      visit_time: "",
      showMoreMenu: false,
      likes: 0,
      isShare: false,
      isCollectIconShow: false,
      folder: true,
      openCollectedOption: false,
      showLikeStar: false,
      folders: [],
      loadLike: false,
      showUserRecommendation: false,
      isViewMorePage: false,
      touchNum: 0,
      isTouch: false,
    };
  },
  mounted() {
    this.likes = this.thing.like_count;
    this.showLikeStar = this.isLike;
    // 处理后台返回的时间数据
    let b = this.thing.visit_time.split("T");
    this.visit_time = b[0];
  },
  computed: {
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
    getHistoriesList() {
      this.$emit("getHistoriesList");
    },
    delHistories(id) {
      delHistories(id).then(() => {
        this.getHistoriesList();
      });
    },
    touchstart() {
      this.touchNum++;
      this.isTouch = true;
    },
    handleDownClick() {
      this.showMoreMenu = false;
      this.$emit("clickDownMenu", this.thing);
    },
    handleDelClick() {
      if (!this.$store.getters.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return;
      }
      this.showMoreMenu = false;
      this.$emit("clickDelMenu", this.thing);
    },
    handleMoveClick() {
      this.showMoreMenu = false;
      this.addCollection();
    },
    handleClickMore() {
      this.showMoreMenu = !this.showMoreMenu;
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
              message: "delete likes successfully",
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
              message: "add likes successfully",
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
            console.log(err);
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
    oprateCollectionOption() {
      if (this.isCollected) {
        this.deleteCollection();
      } else {
        this.addCollection();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-avatar {
  cursor: pointer;
}
.historiescard {
  display: flex;
  justify-content: space-between;
  padding: 0 21px 0 11px;
}
// .historiescard:hover {
//   display: flex;
//   justify-content: space-between;
//   padding: 0 21px 0 11px;
//   border: 1px solid #999999;
// }
.card-box {
  display: flex;
  border: 1px solid #f5f5f5;
  position: relative;
  width: 100%;
  border-radius: 8px;
  padding: 7px;
  margin: 0 auto;
}
.visitTime {
  line-height: 136px;
  font-size: 16px;

  font-weight: 400;
  color: #999999;
}
.resource-show-image {
  height: 136px;
  border-radius: 8px;
  object-fit: cover;
}
.resource-show-image-box {
  margin-left: 16px;
  display: flex;
  justify-content: space-around;
  width: 184px;
  height: 136px;
  border-radius: 3px;
  background: #e8ebf4;
  cursor: pointer;
  overflow: hidden;
}
::v-deep .el-avatar > img {
  width: 100%;
}
::v-deep .el-divider--horizontal {
  background: #e6e6e6;
  margin: 0;
}
.card-box-bottom {
  margin: 14px 0 17px 23px;
}
.card-box-bottom-title {
  font-size: 20px;

  font-weight: 500;
  color: #1a1a1a;
  width: 690px;
  /* 1.溢出隐藏 */
  overflow: hidden;
  /* 2.用省略号来代替超出文本 */
  text-overflow: ellipsis;
  /* 3.设置盒子属性为-webkit-box  必须的 */
  display: -webkit-box;
  /* 4.-webkit-line-clamp 设置为2，表示超出2行的部分显示省略号，如果设置为3，那么就是超出3行部分显示省略号 */
  -webkit-line-clamp: 1;
  /* 5.字面意思：单词破坏：破坏英文单词的整体性，在英文单词还没有在一行完全展示时就换行  即一个单词可能会被分成两行展示 */
  word-break: break-all;
  // /* 6.盒子实现多行显示的必要条件，文字是垂直展示，即文字是多行展示的情况下使用 */
  -webkit-box-orient: vertical;
}
.card-box-bottom-left {
  display: flex;
}
.card-box-bottom-left-name {
  cursor: pointer;
  margin-left: 18px;
  font-size: 12px;
  line-height: 40px;

  font-weight: 400;
  color: #999999;
}
.moreMenuIcon {
  text-align: center;
  width: 32px;
  height: 24px;
  line-height: 24px;
  background: #e8ebf4;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  .moreMenu {
    position: absolute;
    width: 160px;
    background: #ffffff;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.07);
    border-radius: 10px;
    bottom: 40px;
    right: 20px;
    text-align: left;
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
}
.card-box-bottom-right {
  margin: 14px 0;
  display: flex;
  align-items: center;
  color: #999999;
  font-size: 14px;
}
.card-box-bottom-right-like-box {
  margin-right: 14px;
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
.share-box:hover {
  color: #000;
  cursor: pointer;
}

.icon-collect {
  font-size: 20px;
  color: #fff;
}
.delHistories {
  margin-top: 72px;
  cursor: pointer;
  width: 22px;
  height: 22px;
  color: #999999;
}
.delHistories:hover {
  margin-top: 72px;
  cursor: pointer;
  width: 22px;
  height: 22px;
  color: #ea5c5b;
}
</style>
