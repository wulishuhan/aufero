<template>
  <div class="more-container" ref="more-container">
    <el-row class="view-more-row" ref="content" style="height: 673px">
      <div v-for="item in resources" :key="item.thingId">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <resource-card
            :thing="item"
            :isLike="comfirmLike(item.id)"
            :isCollected="comfirmCollection(item.id)"
            @openCollection="openCollection"
            @deleteCollection="deleteCollection"
          ></resource-card>
        </el-col>
      </div>
    </el-row>
    <p v-if="loading">loading...</p>
    <p v-if="noMore">no more</p>
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
import { throttle } from "@/utils/cache.js";
import {
  getResourceListById,
  getSimilar,
  getMoreByThisCreator,
} from "@/api/resource";
import CollectedOption from "@/components/CollectedOption";
import { mapGetters } from "vuex";
import {
  getCollectionList,
  addCollection,
  addResourceToCollection,
  deleteCollectionResource,
} from "@/api/collection";
export default {
  name: "ViewMore",
  components: { ResourceCard, CollectedOption },
  props: {
    creator: {
      type: Object,
      default: () => {
        return {
          avatar: "",
          name: "",
          id: "",
        };
      },
    },
    isRemixes: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "view-creator",
    },
  },
  data() {
    return {
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      load: () => {},
      resources: [],
      loading: false,
      resourcesTotal: 0,
      noMore: false,
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
    ...mapGetters(["isLogin", "userInfo"]),
  },
  mounted() {
    console.log("mounted", this.isRemixes);

    this.getResourceList();

    let container = this.$refs["more-container"];
    this.load = throttle(() => {
      // 距离底部200px时加载一次
      let bottomOfWindow =
        container.scrollHeight - container.offsetHeight - container.scrollTop <=
        200;
      if (bottomOfWindow && !this.loading && !this.noMore) {
        this.pagination.pageNum++;
        if (
          this.pagination.pageNum <=
          Math.ceil(this.resourcesTotal / this.pagination.pageSize)
        ) {
          this.getResourceList();
        }
      }
    }, 1000);
    container.addEventListener("scroll", this.load);
  },
  beforeDestroy() {
    this.$refs["more-container"].removeEventListener("scroll", this.load);
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
      let parameters = { ...this.pagination, userId: this.creator.id };
      if (this.isRemixes) {
        parameters = {
          ...this.pagination,
          type: "remix",
          resId: this.$route.params.thingId,
        };
        this.getRemixes(parameters);
      } else if (this.name === "view-creator") {
        parameters = {
          ...this.pagination,
          resId: this.$route.params.thingId,
          userId: this.creator.id,
        };
        this.getMoreByThisCreator(parameters);
      } else if (this.name === "view-similar") {
        parameters = {
          ...this.pagination,
          resId: this.$route.params.thingId,
        };
        this.getSimilar(parameters);
      }
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
          message: "cancel collected successfully",
          type: "success",
        });
        this.$store.commit(
          "user/SET_COLLECTIONSLIST",
          this.$store.getters.myCollectionslist.filter((item) => {
            return item.id !== this.prepareCollectedResId;
          })
        );
      });
    },
    closeCollectedOption() {
      this.openCollectedOption = false;
    },
    moveCollectedOption(folderObject) {
      this.openCollectedOption = false;
      addResourceToCollection({
        resourceId: this.prepareCollectedResId,
        collectionId: folderObject.id,
      }).then(() => {
        this.$message({
          message: "move successfully",
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
            message: "add folder successfully",
            type: "success",
          });
        })
        .then(() => {
          getCollectionList({
            userId: this.$store.getters.userInfo.user_id,
          }).then((res) => {
            this.folders = res.data.data;
          });
        });
    },
    getRemixes(parameters) {
      getResourceListById(parameters)
        .then((res) => {
          console.log("res", res);
          let resource = res.data.rows;
          this.resources.push(...resource);
          this.resourcesTotal = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.noMore = true;
        });
    },
    getMoreByThisCreator(parameters) {
      getMoreByThisCreator(parameters)
        .then((res) => {
          let resource = res.data.rows;
          for (let i = 0; i < resource.length; i++) {
            const element = resource[i];
            element.creator = this.creator;
          }
          this.resources.push(...resource);
          this.resourcesTotal = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.noMore = true;
        });
    },
    getSimilar(parameters) {
      getSimilar(parameters)
        .then((res) => {
          console.log("res", res);
          let resource = res.data.rows;
          this.resources.push(...resource);
          this.resourcesTotal = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.noMore = true;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.more-container {
  overflow-y: auto;
  height: 672px;
}
</style>
