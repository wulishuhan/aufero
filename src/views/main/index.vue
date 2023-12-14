<template>
  <div id="top" class="main" @click="closeCollectedOptionBox">
    <header class="groups-header">
      <el-carousel height="392px" indicator-position="outside">
        <el-carousel-item v-for="item in bannerImages" :key="item.title">
          <a :href="item.url" target="_blank">
            <img :src="item.image" alt="" />
            <div class="learn-more">{{ $t("main.barnerViewMore") }}</div>
          </a>
        </el-carousel-item>
      </el-carousel>
    </header>
    <div class="content" id="content">
      <el-row class="filter">
        <el-col>
          <el-tabs v-model="activeTabName" @tab-click="handleClickTab">
            <el-tab-pane :label="$t('main.Following')" name="follow">
              <div v-for="(item, index) in resources['follow']" :key="index">
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                  <resource-card
                    :thing="item"
                    :isLike="myLikesList.some((i) => i.id === item.id)"
                    :isCollected="
                      myCollectionslist.some((i) => i.id === item.id)
                    "
                    @openCollection="openCollection"
                    @deleteCollection="deleteCollection"
                  ></resource-card>
                </el-col>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('main.The popular')" name="popular">
              <div v-for="(item, index) in resources['popular']" :key="index">
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                  <resource-card
                    :thing="item"
                    :isLike="myLikesList.some((i) => i.id === item.id)"
                    :isCollected="
                      myCollectionslist.some((i) => i.id === item.id)
                    "
                    @openCollection="openCollection"
                    @deleteCollection="deleteCollection"
                  ></resource-card>
                </el-col>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('main.The newest')" name="newest">
              <div v-for="(item, index) in resources['newest']" :key="index">
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                  <resource-card
                    :thing="item"
                    :isLike="myLikesList.some((i) => i.id === item.id)"
                    :isCollected="
                      myCollectionslist.some((i) => i.id === item.id)
                    "
                    @openCollection="openCollection"
                    @deleteCollection="deleteCollection"
                  ></resource-card>
                </el-col>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <p v-if="loading">loading...</p>
      <p v-if="noMore">no more</p>
      <sroll-top-button></sroll-top-button>
    </div>
    <CollectedOption
      :style="collectionStyle"
      :show="openCollectedOption"
      :folders="folders"
      @close="closeCollectedOption"
      @moveFolder="moveCollectedOption"
      @addFolder="addFolder"
    ></CollectedOption>
  </div>
</template>
<script>
import ResourceCard from "@/components/ResourceCard";
import CollectedOption from "@/components/CollectedOption";
import SrollTopButton from "@/components/SrollTopButton";
import { throttle } from "@/utils/cache.js";
// import { getThingList } from "@/api/thing";
import { getResourceList, getFollowResourceList } from "@/api/resource";
import { getBanner } from "@/api/banner";
// import { getLikelist } from "@/api/like";
import { mapGetters } from "vuex";
import {
  // getCollectionResourceList,
  getCollectionList,
  getResourceInCollection,
  addCollection,
  addResourceToCollection,
  deleteCollectionResource,
} from "@/api/collection";

export default {
  // eslint-disable-next-line
  name: "Main",
  components: { ResourceCard, SrollTopButton, CollectedOption },
  data() {
    return {
      total: 0,
      activeTabName: "popular",
      pagination: {
        popular: {
          pageSize: 12,
          pageNum: 1,
        },
        newest: {
          pageSize: 12,
          pageNum: 1,
        },
        follow: {
          pageSize: 12,
          pageNum: 1,
        },
      },
      load: () => {},
      resources: {
        newest: [],
        popular: [],
        follow: [],
      },
      loading: false,
      resourcesTotal: 0,
      popularList: [],
      newestList: [],
      noMore: false,
      bannerImages: [],
      likeList: [],
      collectedList: [],
      openCollectedOption: false,
      collectionStyle: {
        position: "absolute",
        left: "0px",
        top: "0px",
      },
      folders: [],
      prepareCollectedResId: 0,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "myCollectionslist", "myLikesList"]),
  },

  watch: {
    "$store.getters.isLogin": function () {
      if (this.$store.getters.isLogin) {
        this.$store.dispatch("user/getMyLikesList", {
          userId: this.userInfo.user_id,
        });
        this.$store.dispatch("user/getMyCollectionList", {
          userId: this.userInfo.user_id,
        });
        this.$store.dispatch("user/getMyFollowingList", {
          userId: this.userInfo.user_id,
        });
      }
    },
  },
  mounted() {
    if (this.$route.query.redirect) {
      this.showLoginDialog();
    }
    this.getResourceList();
    this.load = throttle(() => {
      // 距离底部200px时加载一次
      let bottomOfWindow =
        document.documentElement.offsetHeight -
          document.documentElement.scrollTop -
          window.innerHeight <=
        200;
      if (this.activeTabName == "popular" || this.activeTabName == "newest") {
        if (bottomOfWindow && !this.loading && !this.noMore) {
          this.pagination[this.activeTabName].pageNum++;
          if (
            this.pagination[this.activeTabName].pageNum <=
            Math.ceil(
              this.resourcesTotal / this.pagination[this.activeTabName].pageSize
            )
          ) {
            this.getResourceList();
          }
        }
      }

      if (this.activeTabName == "follow") {
        if (bottomOfWindow && !this.loading && !this.noMore) {
          this.pagination[this.activeTabName].pageNum++;
          if (
            this.pagination[this.activeTabName].pageNum <=
            Math.ceil(
              this.resourcesTotal / this.pagination[this.activeTabName].pageSize
            )
          ) {
            this.getFollowResourceList();
          }
        }
      }
    }, 1000);
    window.addEventListener("scroll", this.load);
    // 如果不判断登录状态的话，会触发登录弹窗
    if (this.$store.getters.isLogin) {
      this.$store.dispatch("user/getNoticeCount").catch(() => {});
    }
    getBanner()
      .then((res) => {
        this.bannerImages = res.data.data;
      })
      .then(() => {
        this.$store.dispatch("user/getMyLikesList", {
          userId: this.userInfo.user_id,
        });
        this.$store.dispatch("user/getMyCollectionList", {
          userId: this.userInfo.user_id,
        });
        this.$store.dispatch("user/getMyFollowingList", {
          userId: this.userInfo.user_id,
        });
      });
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.load);
  },
  methods: {
    comfirmLike(id) {
      return this.$store.getters.myLikesList.some((item) => {
        return item.id === id;
      });
    },
    comfirmCollection(id) {
      return this.$store.getters.myCollectionslist.some((item) => {
        return item.id === id;
      });
    },
    getResourceList() {
      //第一页的时候加载第一页，第二页的时候，加载第二页
      getResourceList({
        ...this.pagination[this.activeTabName],
        sort: this.activeTabName,
      })
        .then((res) => {
          this.resources[this.activeTabName].push(...res.data.rows);
          this.pagination[this.activeTabName].pageNum++;
          this.resourcesTotal = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.noMore = true;
        });
    },
    getFollowResourceList() {
      //第一页的时候加载第一页，第二页的时候，加载第二页
      getFollowResourceList({
        ...this.pagination.follow,
      })
        .then((res) => {
          this.resources[this.activeTabName].push(...res.data.rows);
          this.pagination[this.activeTabName].pageNum++;
          this.resourcesTotal = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.noMore = true;
        });
    },
    openCollection(id, left, top) {
      this.openCollectedOption = true;
      this.collectionStyle.left = left + "px";
      this.collectionStyle.top = top + "px";
      this.prepareCollectedResId = id;
      getCollectionList({
        userId: this.$store.getters.userInfo.user_id,
      }).then((res) => {
        this.folders = res.data.data;
      });
    },
    deleteCollection(id) {
      this.openCollectedOption = false;
      deleteCollectionResource({
        userId: this.$store.getters.userInfo.user_id,
        resourceId: id,
      }).then(() => {
        this.$message({
          message: this.$t("design.delSuccess"),
          type: "success",
        });
        // this.prepareCollectedResId为0的时候代表没有进过openColection方法，可能是刷新页面所以使用dispatch更新状态vuex
        if (this.prepareCollectedResId != 0) {
          this.$store.commit(
            "user/SET_COLLECTIONSLIST",
            this.$store.getters.myCollectionslist.filter((item) => {
              console.log(item.id, this.prepareCollectedResId);
              return item.id !== this.prepareCollectedResId;
            })
          );
        } else {
          this.$store.dispatch("user/getMyCollectionList", {
            userId: this.userInfo.user_id,
          });
        }
      });
    },
    closeCollectedOption() {
      this.openCollectedOption = false;
    },
    moveCollectedOption(folderObject) {
      this.openCollectedOption = false;
      console.log(folderObject, 329);
      addResourceToCollection({
        resourceId: this.prepareCollectedResId,
        collectionId: folderObject.id,
      }).then(() => {
        this.$message({
          message: this.$t("design.moveSuccess"),
          type: "success",
        });
        this.$store.commit("user/SET_COLLECTIONSLIST", [
          ...this.$store.getters.myCollectionslist,
          { id: this.prepareCollectedResId },
        ]);
      });
    },
    addFolder(folderName) {
      addCollection({
        name: folderName,
        userId: this.$store.getters.userInfo.user_id,
      })
        .then(() => {
          this.$message({
            message: this.$t("design.addSuccess"),
            type: "success",
          });
        })
        .then(() => {
          getCollectionList({
            userId: this.$store.getters.userInfo.user_id,
          }).then((res) => {
            this.folders = res.data.data;
            return this.folders;
          });
        })
        .then((folders) => {
          for (const item of folders) {
            getResourceInCollection({
              collectionId: item.id,
              userId: this.$store.getters.userInfo.user_id,
            }).then((res) => {
              console.log(res.data, 168);
              console.log(res.data.rows, 169);
              if (res.data.total > 0) {
                let flag = res.data.rows.some((r) => {
                  // 这里的item。id应该是点击作品集对应的id
                  return r.id == this.id;
                });
                console.log(item.id, 175);
                if (flag) {
                  this.checkList.push(item);
                  console.log(this.checkList, 176);
                  this.preCheckList.push(item);
                }
              }
            });
          }
        });
    },
    handleClickTab() {
      //切换tab的时候获取
      var tabName = this.activeTabName;
      var pagination = this.pagination[tabName];
      if (
        (tabName == "popular" || tabName == "newest") &&
        pagination.pageNum == 1
      ) {
        this.getResourceList();
      }

      if (tabName == "follow" && pagination.pageNum == 1) {
        this.getFollowResourceList();
      }
    },
    closeCollectedOptionBox() {
      this.closeCollectedOption();
    },
    showLoginDialog() {
      let payload = { loginDialogVisible: true, isLoginForm: true };
      this.$store.dispatch("user/switchLoginRegisteForm", payload);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  /* text-align: center; */
  /* background-color: #f5f5f5; */
  background: #f0f3fa;
}
.content {
  /* width: 1200px; */
  width: 1440px;
  margin: 0 auto;
}
.filter {
  margin: 20px auto;
}
a {
  text-decoration-line: none;
  color: #303133;
}
p {
  text-align: center;
}
.groups-header {
  /* width: 1200px; */
  width: 1440px;
  height: 392px;
  margin: 0 auto;
  color: #f0f3fa;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  a {
    position: relative;
    .learn-more {
      position: absolute;
      width: 84px;
      height: 36px;
      background: #1a1a1a;
      opacity: 0.3;
      border-radius: 5px;
      bottom: 12px;
      right: 12px;
      font-size: 12px;

      font-weight: 400;
      color: #ffffff;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
}
::v-deep .el-input__inner,
.el-input,
.el-select {
  font-size: 14px;
  height: 48px;
}
::v-deep .el-input__inner {
  border: none;
}
::v-deep .el-input__inner:hover {
  border: 1px solid #c2c4cc;
}
::v-deep .el-input__inner::before {
  content: "\e93f";
}
::v-deep .el-input__inner::placeholder {
  text-align: center;
  color: #1a1a1a;
  font-size: 11px;
}
.select-box {
  position: relative;
  height: 48px;
}
.icon-hourglass {
  position: absolute;
  top: 12px;
  left: 10px;
  z-index: 2;
  font-size: 22px;
}
.select {
  width: 160px;
  height: 36px;
  border-radius: 5px;
  font-size: 12px;
  position: absolute;
  top: 0px;
  left: 0px;
}
::v-deep .el-input__inner {
  background: #f0f3fa;
  text-align: center;
}

.option {
  width: 150px;
  height: 48px;
  margin: 0 auto;
  border-radius: 6px;
  font-size: 14px;

  font-weight: 400;
  box-sizing: border-box;
  text-align: center;
  padding: 0px;
  overflow: visible;
  line-height: 48px;
}
.option:hover {
  background: #8ab5ef;
  color: #ffffff;
}

@media only screen and (max-width: 768px) {
  .row {
    width: 100%;
    display: none;
  }
  .main {
    width: 100%;
  }
  .content {
    width: 100%;
  }
  .el-row {
    width: 100%;
  }
}
</style>
