<template>
  <div class="container">
    <div class="tab-wrapper">
      <el-button class="post-btn" @click="handlePost">
        {{ $t("community.Start Post") }}
      </el-button>
      <el-tabs v-model="activeTabName" @tab-click="handleClickTab">
        <el-tab-pane :label="$t('community.Following')" name="follow">
          <community-content
            v-for="item in resources['follow']"
            :key="item.id"
            :item="item"
            :like-count.sync="item.like_count"
            :comment-count.sync="item.comment_count"
            :view-count.sync="item.view_count"
            :isLike.sync="item.isLike"
          ></community-content>
        </el-tab-pane>
        <el-tab-pane :label="$t('community.The popular')" name="popular">
          <community-content
            v-for="item in resources['popular']"
            :key="item.id"
            :item="item"
            :like-count.sync="item.like_count"
            :comment-count.sync="item.comment_count"
            :view-count.sync="item.view_count"
            :isLike.sync="item.isLike"
          ></community-content>
        </el-tab-pane>
        <el-tab-pane :label="$t('community.The newest')" name="newest">
          <community-content
            v-for="item in resources['newest']"
            :key="item.id"
            :item="item"
            :like-count.sync="item.like_count"
            :comment-count.sync="item.comment_count"
            :view-count.sync="item.view_count"
            :isLike.sync="item.isLike"
          ></community-content>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CommunityContent from "@/views/community/CommunityContent";
import { getCommunityList, getLikeList } from "@/api/community";
import { createNamespacedHelpers } from "vuex";
import { generatorDefaultAvator } from "@/utils/generateImage";
const { mapState } = createNamespacedHelpers("user");
export default {
  name: "about",
  data() {
    return {
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
      resources: {
        newest: [],
        popular: [],
        follow: [],
      },
      loading: false,
      resourcesTotal: 0,
      likeIds: [],
    };
  },
  components: { CommunityContent },
  computed: {
    ...mapState(["userInfo"]),
  },
  mounted() {
    getLikeList({ userId: this.userInfo.user_id }).then((res) => {
      this.likeIds = res.data.rows.map((v) => {
        return v.id;
      });
      this.getCommunityList();
    });
  },
  methods: {
    getCommunityList() {
      getCommunityList({
        ...this.pagination[this.activeTabName],
        sort: this.activeTabName,
      })
        .then((res) => {
          console.log(this.likeIds, "============");
          res.data.rows.forEach((item) => {
            if (this.likeIds.indexOf(item.id) != -1) {
              item.isLike = true;
            } else {
              item.isLike = false;
            }
          });
          res.data.rows = res.data.rows.map((item) => {
            item.creator.avatar =
              item.creator.avatar == ""
                ? generatorDefaultAvator(item.creator.name, item.creator.id)
                : item.creator.avatar;
            item.resource.creator.avatar =
              item.resource.creator.avatar == ""
                ? generatorDefaultAvator(
                    item.resource.creator.name,
                    item.resource.creator.id
                  )
                : item.resource.creator.avatar;
            console.log("test", item.creator.avatar);
            return item;
          });

          this.resources[this.activeTabName].push(...res.data.rows);
          console.log(this.resources[this.activeTabName]);
          this.pagination[this.activeTabName].pageNum++;
          this.resourcesTotal = res.data.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.noMore = true;
        });
    },
    handleClickTab() {
      //切换tab的时候获取

      var tabName = this.activeTabName;
      var pagination = this.pagination[tabName];
      console.log(pagination.pageNum);
      if (
        (tabName == "popular" || tabName == "newest") &&
        pagination.pageNum == 1
      ) {
        this.getCommunityList();
      }

      if (tabName == "follow" && pagination.pageNum == 1) {
        // this.getFollowResourceList();
      }
    },
    handlePost() {
      this.$router.push("/postCommunity");
    },
  },
};
</script>

<style scoped lang="scss">
.tab-wrapper {
  position: relative;
  width: 1100px;
  margin: 0 auto;
  .post-btn {
    position: absolute;
    right: 30px;
    top: -4px;
    background-color: #1e78f0;
    width: 112px;
    height: 40px;
    color: #fff;
    z-index: 1;
  }
}
</style>
